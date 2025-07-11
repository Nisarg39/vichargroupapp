import React from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

// Function to check if text contains LaTeX
const containsLatex = (text: string): boolean => {
  return text.includes('$');
};

// Function to render LaTeX in WebView
export const renderLatex = (content: string, style: any = {}): React.ReactNode => {
  if (!content || typeof content !== 'string') return null;
  
  if (!containsLatex(content)) {
    // If no LaTeX, just render formatted text
    return renderFormattedText(content, style);
  }

  // HTML template for rendering LaTeX with KaTeX
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: ${style.fontSize || 16}px;
            color: ${style.color || '#000'};
            background-color: transparent;
            overflow: visible;
          }
          #content {
            width: 100%;
            overflow: visible;
          }
          strong { font-weight: bold; }
          em { font-style: italic; }
        </style>
      </head>
      <body>
        <div id="content">${processContent(content)}</div>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            renderMathInElement(document.getElementById("content"), {
              delimiters: [
                {left: "$", right: "$", display: false},
                {left: "$$", right: "$$", display: true}
              ],
              throwOnError: false
            });
            
            // Send message to React Native with content height
            setTimeout(function() {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'contentHeight',
                  height: document.body.scrollHeight
                })
              );
            }, 300);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      key={`latex-${content.substring(0, 20)}`}
      originWhitelist={['*']}
      source={{ html }}
      style={[
        { 
          backgroundColor: 'transparent', 
          height: 'auto',
          minHeight: 100, // Increased minimum height
          width: '100%',
          opacity: 1
        }, 
        style
      ]}
      scrollEnabled={false}
      javaScriptEnabled={true}
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'contentHeight') {
            // We could update height here if needed
          }
        } catch (e) {
          console.error('Error parsing WebView message:', e);
        }
      }}
    />
  );
};

// Process content to handle bold and italic formatting
const processContent = (content: string): string => {
  if (!content) return '';
  
  // Escape HTML special characters except for our formatting markers
  let processed = content
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")  // Use double quotes to avoid issues with single quotes
  
  // Process bold formatting
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Process italic formatting
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Process line breaks
  processed = processed.replace(/\n/g, '<br>');
  
  return processed;
};

// Function to render formatted text without LaTeX
export const renderFormattedText = (text: string, style: any = {}): React.ReactNode => {
  if (!text) return null;
  
  // Process bold formatting
  const processBold = (input: string): React.ReactNode[] => {
    const parts = input.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return <Text key={index} style={{ fontWeight: 'bold' }}>{processItalic(content)}</Text>;
      }
      return processItalic(part, index);
    });
  };
  
  // Process italic formatting
  const processItalic = (input: string, keyPrefix: any = ''): React.ReactNode => {
    if (!input) return null;
    
    const parts = input.split(/(\*.*?\*)/g);
    if (parts.length === 1) return <Text key={`text-${keyPrefix}`} style={style}>{input}</Text>;
    
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const content = part.slice(1, -1);
        return <Text key={`italic-${keyPrefix}-${index}`} style={[style, { fontStyle: 'italic' }]}>{content}</Text>;
      }
      return <Text key={`text-${keyPrefix}-${index}`} style={style}>{part}</Text>;
    });
  };
  
  // Process line breaks
  const lines = text.split('\n');
  if (lines.length === 1) {
    return <Text style={style}>{processBold(text)}</Text>;
  }
  
  return (
    <View>
      {lines.map((line, index) => (
        <View key={`line-${index}`} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {index > 0 && <Text style={style}>{'\n'}</Text>}
          <Text style={style}>{processBold(line)}</Text>
        </View>
      ))}
    </View>
  );
};