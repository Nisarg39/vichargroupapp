import React from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

// Enhanced function to convert LaTeX to formatted text (based on 

const convertLatexToFormattedText = (latex: string): string => {
  if (!latex) return '';

  let output = latex;

  // Remove LaTeX preamble and wrappers
  output = output.replace(/\\documentclass(\[.*?\])?\{.*?\}/g, '');
  output = output.replace(/\\usepackage(\[.*?\])?\{.*?\}/g, '');
  output = output.replace(/\\begin\{document\}/g, '');
  output = output.replace(/\\end\{document\}/g, '');

  // Convert display math \[...\] to $$...$$
  output = output.replace(/\\\[(.*?)\\\]/gs, (_, math) =>
`$$${math.trim()}$$`);

  // Convert inline math \( ... \) to $...$
  output = output.replace(/\\\((.*?)\\\)/gs, (_, math) =>
`$${math.trim()}$`);

  // Convert \begin{equation}...\end{equation} to $$...$$
  output = output.replace(/\\begin\{equation\}(.*?)\\end\{equation\}/gs, (_,
 math) => `$$${math.trim()}$$`);

  // Convert \textbf{} to **bold**
  output = output.replace(/\\textbf\{(.*?)\}/g, '**$1**');

  // Convert \textit{} and \emph{} to *italic*
  output = output.replace(/\\textit\{(.*?)\}/g, '*$1*');
  output = output.replace(/\\emph\{(.*?)\}/g, '*$1*');

  // Strip LaTeX comments and clean spacing
  output = output.replace(/^\s*%.*$/gm, ''); // remove % comments (only at line start)
  output = output.replace(/\r\n|\r|\n/g, '\n'); // normalize line endings
  output = output.replace(/\n{3,}/g, '\n\n'); // collapse extra line breaks

  return output.trim();
};

// Enhanced function to check if text contains LaTeX
const containsLatex = (text: string): boolean => {
  if (!text) return false;

  // Check for various LaTeX patterns
  const latexPatterns = [
    /\$.*?\$/,                    // $...$ inline math
    /\$\$.*?\$\$/,               // $$...$$ display math
    /\\\[.*?\\\]/s,              // \[...\] display math
    /\\\(.*?\\\)/s,              // \(...\) inline math
    /\\begin\{.*?\}/,            // \begin{...}
    /\\end\{.*?\}/,              // \end{...}
    /\\[a-zA-Z]+\{.*?\}/,        // LaTeX commands like \frac{...}
    /\\[a-zA-Z]+/,               // LaTeX commands without braces
  ];

  return latexPatterns.some(pattern => pattern.test(text));
};

// WebView component for LaTeX rendering
const LaTeXWebView: React.FC<{ html: string; style: any; content: string }> = ({ html, style, content }) => {
  // Calculate initial height based on content length
  const estimateHeight = (text: string): number => {
    const lines = text.split('\n').length;
    const hasLaTeX = /\$|\\\(|\\\[|\\begin/.test(text);
    const baseHeight = Math.max(lines * (hasLaTeX ? 28 : 20), style.minHeight || 35);
    return Math.min(baseHeight, 400); // Reduced cap back to 400px
  };

  const [webViewHeight, setWebViewHeight] = React.useState(estimateHeight(content));

  return (
    <View style={{ minHeight: Math.min(webViewHeight, 300), overflow: 'visible' }}>
      <WebView
        key={`latex-${content.substring(0, 30)}`}
        originWhitelist={['*']}
        source={{ html }}
        style={[
          { 
            backgroundColor: 'transparent', 
            height: webViewHeight,
            minHeight: style.minHeight || 35,
            width: '100%',
            opacity: 1,
            overflow: 'visible'
          }, 
          style
        ]}
        scrollEnabled={false}
        javaScriptEnabled={true}
        onLoad={() => {
          // Trigger height calculation when WebView finishes loading
          setTimeout(() => {
            // Request height calculation from the WebView
          }, 100);
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'contentHeight') {
              const newHeight = Math.max(data.height, style.minHeight || 35);
              const cappedHeight = Math.min(newHeight, 400); // Reduced cap to 400px
              setWebViewHeight(cappedHeight);
            }
          } catch (e) {
            console.error('Error parsing WebView message:', e);
          }
        }}
      />
    </View>
  );
};

// Function to render LaTeX in WebView
export const renderLatex = (content: string, style: any = {}):
React.ReactNode => {
  if (!content || typeof content !== 'string') return null;

  // First convert LaTeX to formatted text (handles LaTeX preambles, comments, etc.)
  const convertedContent = convertLatexToFormattedText(content);

  if (!containsLatex(convertedContent)) {
    // If no LaTeX after conversion, just render formatted text
    return renderFormattedText(convertedContent, style);
  }

  // HTML template for rendering LaTeX with KaTeX
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, 
initial-scale=1.0">
        <link rel="stylesheet" 
href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
        <script 
src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/
auto-render.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 2px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
Roboto, Helvetica, Arial, sans-serif;
            font-size: ${style.fontSize || 16}px;
            color: ${style.color || '#000'};
            background-color: transparent;
            overflow: visible;
            line-height: 1.4;
            min-height: fit-content;
          }
          #content {
            width: 100%;
            overflow: visible;
            padding: 0;
            min-height: fit-content;
          }
          p {
            margin: 0.2em 0;
            word-wrap: break-word;
          }
          strong { font-weight: bold; }
          em { font-style: italic; }
          .katex { 
            font-size: 1em !important; 
            white-space: nowrap;
          }
          .katex-display { 
            margin: 0.2em 0 !important; 
            text-align: center;
          }
          br {
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <div id="content">${processContent(convertedContent)}</div>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            renderMathInElement(document.getElementById("content"), {
              delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\\\[", right: "\\\\]", display: true},
                {left: "\\\\(", right: "\\\\)", display: false}
              ],
              throwOnError: false,
              trust: true,
              strict: false
            });
            
            // Send message to React Native with content height
            function sendHeight() {
              const contentElement = document.getElementById("content");
              const height = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight,
                contentElement ? contentElement.scrollHeight + 4 : 0
              );
              
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'contentHeight',
                  height: height + 4 // Minimal padding for tight fit
                })
              );
            }
            
            // Multiple height calculations to ensure accuracy
            setTimeout(sendHeight, 50);   // Very quick initial calculation
            setTimeout(sendHeight, 200);  // After initial render
            setTimeout(sendHeight, 600);  // After KaTeX renders
            setTimeout(sendHeight, 1200); // Final calculation after all effects
            
            // Observe for any content changes that might affect height
            const observer = new MutationObserver(() => {
              setTimeout(sendHeight, 100);
            });
            observer.observe(document.body, { 
              childList: true, 
              subtree: true, 
              attributes: true 
            });
          });
        </script>
      </body>
    </html>
  `;

  return <LaTeXWebView html={html} style={style} content={convertedContent} />;
};

// Enhanced content processing function
const processContent = (content: string): string => {
  if (!content) return '';

  // Escape HTML special characters except for our formatting markers
  let processed = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // Process bold formatting (**text**)
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Process italic formatting (*text*)
  processed = processed.replace(/\*([^*]*?)\*/g, '<em>$1</em>');

  // Handle double line breaks as paragraph breaks
  processed = processed.replace(/\n\n+/g, '</p><p>');
  
  // Handle single line breaks as br tags
  processed = processed.replace(/\n/g, '<br>');
  
  // Wrap in paragraph tags if not already wrapped
  if (!processed.startsWith('<p>')) {
    processed = '<p>' + processed + '</p>';
  }

  return processed;
};

// Enhanced function to render formatted text without LaTeX
export const renderFormattedText = (text: string, style: any = {}):
React.ReactNode => {
  if (!text) return null;

  // First apply LaTeX conversion to handle any LaTeX formatting
  const convertedText = convertLatexToFormattedText(text);

  // Process bold formatting
  const processBold = (input: string): React.ReactNode[] => {
    const parts = input.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return <Text key={index} style={{ fontWeight: 'bold' 
}}>{processItalic(content)}</Text>;
      }
      return processItalic(part, index);
    });
  };

  // Process italic formatting
  const processItalic = (input: string, keyPrefix: any = ''):
React.ReactNode => {
    if (!input) return null;

    const parts = input.split(/(\*[^*]*?\*)/g);
    if (parts.length === 1) return <Text key={`text-${keyPrefix}`} 
style={style}>{input}</Text>;

    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const content = part.slice(1, -1);
        return <Text key={`italic-${keyPrefix}-${index}`} style={[style, { 
fontStyle: 'italic' }]}>{content}</Text>;
      }
      return <Text key={`text-${keyPrefix}-${index}`} 
style={style}>{part}</Text>;
    });
  };

  // Process line breaks
  const lines = convertedText.split('\n');
  if (lines.length === 1) {
    return <Text style={style}>{processBold(convertedText)}</Text>;
  }

  return (
    <View>
      {lines.map((line, index) => (
        <View key={`line-${index}`} style={{ flexDirection: 'row', flexWrap:
 'wrap' }}>
          {index > 0 && <Text style={style}>{'\n'}</Text>}
          <Text style={style}>{processBold(line)}</Text>
        </View>
      ))}
    </View>
  );
};