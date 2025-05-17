import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

interface MathExpressionProps {
  expression: string;
  fontSize?: number;
  color?: string;
}

const MathExpression: React.FC<MathExpressionProps> = ({ 
  expression, 
  fontSize = 16, 
  color = '#000000' 
}) => {
  const [height, setHeight] = useState<number>(40);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Log the expression for debugging
  useEffect(() => {
    console.log('Math Expression:', expression);
  }, [expression]);

  // Escape backslashes and quotes to prevent JS errors
  const escapedExpression = expression
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ');

  // HTML template with KaTeX for rendering math expressions
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-size: ${fontSize}px;
            color: ${color};
            background-color: transparent;
            overflow: hidden;
          }
          #math {
            padding: 4px 0;
          }
          .katex-display {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div id="math"></div>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            try {
              console.log("Rendering expression: ${escapedExpression}");
              katex.render("${escapedExpression}", document.getElementById('math'), {
                displayMode: true,
                throwOnError: false,
                output: 'html'
              });
              
              // Get the height of the rendered content and send it to React Native
              const height = document.body.scrollHeight;
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'height',
                height: height
              }));
            } catch (e) {
              console.error("KaTeX error:", e);
              document.getElementById('math').innerHTML = 'Error: ' + e.message;
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: e.message
              }));
            }
          });
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'height') {
        setHeight(data.height);
        setLoading(false);
      } else if (data.type === 'error') {
        console.error('Math rendering error:', data.message);
        setError(data.message);
        setLoading(false);
      }
    } catch (e) {
      console.error('Error parsing WebView message:', e);
      setError('Failed to parse WebView message');
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error rendering math: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#2259A1" />
        </View>
      )}
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        onError={(e) => {
          console.error('WebView error:', e.nativeEvent);
          setError('WebView error');
          setLoading(false);
        }}
        onHttpError={(e) => {
          console.error('WebView HTTP error:', e.nativeEvent);
          setError('WebView HTTP error');
          setLoading(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  webview: {
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 8,
    backgroundColor: '#ffeeee',
    borderRadius: 4,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
  }
});

export default MathExpression;