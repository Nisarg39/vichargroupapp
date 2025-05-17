import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { renderLatex } from '@/utils/textUtils';
import { WebView } from 'react-native-webview';

interface DppQuestion {
    _id: string;
    serialNumber: number;
    question: string;
    questionImage?: string;
    objectiveoptions?: Array<{
      option: string;
      text: string;
      isImage: boolean;
    }>;
    multipleObjective?: Array<{
      option: string;
      text: string;
      isImage: boolean;
    }>;
    answerObjective?: string;
    answerMultiple?: string[];
    answerNumeric?: number;
    solutionPdf?: string;
}

interface Dpp {
    _id: string;
    dppQuestions: DppQuestion[];
    title?: string; // Optional title for the DPP
    // Remove or make optional
    // createdAt?: string; // For displaying date
}

interface DPPsProps {
  dpps: Dpp[];
}

const DPPs: React.FC<DPPsProps> = ({ dpps }) => {
  const [selectedDpp, setSelectedDpp] = useState<string | null>(null);
  const [showDppList, setShowDppList] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    
    // State for user answers
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedMultipleOptions, setSelectedMultipleOptions] = useState<string[]>([]);
    const [numericAnswer, setNumericAnswer] = useState<string>('');
    const [userAnswers, setUserAnswers] = useState<{
      [questionId: string]: {
        selectedOption?: string;
        selectedMultipleOptions?: string[];
        numericAnswer?: string;
      }
    }>({});
    
    const [showResults, setShowResults] = useState<boolean>(false);
    // Add these state variables
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [questionTimes, setQuestionTimes] = useState<{[questionId: string]: number}>({});
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [webViewHeights, setWebViewHeights] = useState<{[questionId: string]: number}>({});

    // Add this helper function to format time
    const formatTime = (timeInSeconds: number): string => {
      // Ensure timeInSeconds is a valid number
      if (typeof timeInSeconds !== 'number' || isNaN(timeInSeconds)) {
        timeInSeconds = 0;
      }
      
      // Ensure the time is not negative or extremely large
      if (timeInSeconds < 0 || timeInSeconds > 86400) { // 24 hours max
        timeInSeconds = 0;
      }
      
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60); // Ensure seconds is an integer
      
      // Format as MM:SS
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Add this useEffect to handle timer updates
    useEffect(() => {
      // Clear any existing interval first to prevent multiple intervals
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      if (startTime > 0) {
        const interval = setInterval(() => {
          const newElapsedTime = Math.floor((Date.now() - startTime) / 1000);
          setElapsedTime(newElapsedTime);
        }, 1000);
        
        setTimerInterval(interval);
        
        return () => clearInterval(interval);
      }
    }, [startTime]);

    const handleDppSelect = (dppId: string) => {
        setSelectedDpp(dppId);
        setShowDppList(false);
        setCurrentQuestionIndex(0);
        setShowResults(false);
        
        // Clear any existing interval first
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
        
        // Reset timer to 0 first
        setElapsedTime(0);
        
        // Reset question times
        setQuestionTimes({});
        
        // Load saved answers for the first question if available
        const dpp = dpps.find(d => d._id === dppId);
        if (dpp && dpp.dppQuestions.length > 0) {
          loadSavedAnswers(dpp.dppQuestions[0]._id);
        } else {
          resetAnswers();
        }
        
        // Add a small delay before starting the timer
        setTimeout(() => {
          const now = Date.now();
          setStartTime(now);
        }, 100);
    };

    const handleBackToDppList = () => {
        setShowDppList(true);
        setShowResults(false);
        
        // Reset all answer states
        resetAnswers();
        
        // Reset user answers for all questions
        setUserAnswers({});
        
        // Reset current question index
        setCurrentQuestionIndex(0);
        
        // Reset selected DPP
        setSelectedDpp(null);
        
        // Clear the timer interval
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
        
        // Reset all timer-related states
        setElapsedTime(0);
        setStartTime(0);
        setQuestionTimes({});
        
        // Reset WebView heights
        setWebViewHeights({});
    };

    const resetAnswers = () => {
        setSelectedOption(null);
        setSelectedMultipleOptions([]);
        setNumericAnswer('');
    };

    const loadSavedAnswers = (questionId: string) => {
      const savedAnswer = userAnswers[questionId];
      if (savedAnswer) {
        if (savedAnswer.selectedOption) {
          setSelectedOption(savedAnswer.selectedOption);
        } else {
          setSelectedOption(null);
        }
        
        if (savedAnswer.selectedMultipleOptions) {
          setSelectedMultipleOptions(savedAnswer.selectedMultipleOptions);
        } else {
          setSelectedMultipleOptions([]);
        }
        
        if (savedAnswer.numericAnswer) {
            console.log('Saved numeric answer:', savedAnswer.numericAnswer);
          setNumericAnswer(savedAnswer.numericAnswer);
        } else {
          setNumericAnswer('');
        }
      } else {
        resetAnswers();
      }
    };

    const handleNextQuestion = () => {
        if (currentDpp && currentQuestionIndex < currentDpp.dppQuestions.length - 1) {
            // Save time for current question
            if (currentQuestion) {
              setQuestionTimes(prev => ({
                ...prev,
                [currentQuestion._id]: elapsedTime
              }));
            }
            
            // First stop the current timer
            if (timerInterval) {
              clearInterval(timerInterval);
              setTimerInterval(null);
            }
            
            // Reset elapsed time to 0
            setElapsedTime(0);
            
            // Move to next question
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            
            // Load saved answers for the next question
            if (currentDpp.dppQuestions[currentQuestionIndex + 1]) {
              loadSavedAnswers(currentDpp.dppQuestions[currentQuestionIndex + 1]._id);
            }
            
            // Add a small delay before starting the new timer
            setTimeout(() => {
              const now = Date.now();
              setStartTime(now);
            }, 100);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            // Save time for current question
            if (currentQuestion) {
              setQuestionTimes(prev => ({
                ...prev,
                [currentQuestion._id]: elapsedTime
              }));
            }
            
            // First stop the current timer
            if (timerInterval) {
              clearInterval(timerInterval);
              setTimerInterval(null);
            }
            
            // Reset elapsed time to 0
            setElapsedTime(0);
            
            // Move to previous question
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            
            // Load saved answers for the previous question
            if (currentDpp && currentDpp.dppQuestions[currentQuestionIndex - 1]) {
              loadSavedAnswers(currentDpp.dppQuestions[currentQuestionIndex - 1]._id);
            }
            
            // Add a small delay before starting the new timer
            setTimeout(() => {
              const now = Date.now();
              setStartTime(now);
            }, 100);
        }
    };

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
        // Store the answer
        if (currentQuestion) {
          setUserAnswers({
            ...userAnswers,
            [currentQuestion._id]: {
              ...userAnswers[currentQuestion._id],
              selectedOption: option
            }
          });
        }
    };

    const handleSelectMultipleOption = (option: string) => {
        let newSelectedOptions;
        if (selectedMultipleOptions.includes(option)) {
            // Remove option if already selected
            newSelectedOptions = selectedMultipleOptions.filter(opt => opt !== option);
            setSelectedMultipleOptions(newSelectedOptions);
        } else {
            // Add option if not already selected
            newSelectedOptions = [...selectedMultipleOptions, option];
            setSelectedMultipleOptions(newSelectedOptions);
        }
        
        // Store the answer
        if (currentQuestion) {
          setUserAnswers({
            ...userAnswers,
            [currentQuestion._id]: {
              ...userAnswers[currentQuestion._id],
              selectedMultipleOptions: newSelectedOptions
            }
          });
        }
    };

    const handleNumericAnswerChange = (text: string) => {
        // Allow only numbers and decimal point
        if (/^-?\d*\.?\d*$/.test(text) || text === '') {
            setNumericAnswer(text);
            
            // Store the answer
            if (currentQuestion) {
              setUserAnswers({
                ...userAnswers,
                [currentQuestion._id]: {
                  ...userAnswers[currentQuestion._id],
                  numericAnswer: text
                }
              });
            }
        }
    };

    // Find the currently selected DPP
    const currentDpp = dpps.find(dpp => dpp._id === selectedDpp);
    // Get the current question
    const currentQuestion = currentDpp?.dppQuestions[currentQuestionIndex];

    // Add this function after the other handler functions
    const handleFinishTest = () => {
      // Save the answer for the current question if needed
      if (currentQuestion) {
        const currentAnswers = { ...userAnswers };
        
        // Initialize the answer object for this question if it doesn't exist
        if (!currentAnswers[currentQuestion._id]) {
          currentAnswers[currentQuestion._id] = {};
        }
        
        // Only update properties that have values
        if (selectedOption !== null) {
          currentAnswers[currentQuestion._id].selectedOption = selectedOption;
        }
        
        if (selectedMultipleOptions.length > 0) {
          currentAnswers[currentQuestion._id].selectedMultipleOptions = selectedMultipleOptions;
        }
        
        if (numericAnswer !== '') {
          currentAnswers[currentQuestion._id].numericAnswer = numericAnswer;
        }
        
        // Update the state
        setUserAnswers(currentAnswers);
        
        // Save time for the last question
        setQuestionTimes(prev => ({
          ...prev,
          [currentQuestion._id]: elapsedTime
        }));
      }
      
      // Clear the timer interval
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      // Show the results view
      setShowResults(true);
    };

    // Add these helper functions before the return statement
    const checkIfAnswerIsCorrect = (
      question: DppQuestion,
      userAnswer: {
        selectedOption?: string;
        selectedMultipleOptions?: string[];
        numericAnswer?: string;
      }
    ) => {
      // Check objective (single choice) answers
      if (question.answerObjective && userAnswer.selectedOption) {
        return question.answerObjective === userAnswer.selectedOption;
      }
      
      // Check multiple choice answers
      if (question.answerMultiple && userAnswer.selectedMultipleOptions) {
        // If either array is empty, the answer is incorrect
        if (!question.answerMultiple.length || !userAnswer.selectedMultipleOptions.length) {
          return false;
        }
        
        // Check if arrays have the same length
        if (question.answerMultiple.length !== userAnswer.selectedMultipleOptions.length) {
          return false;
        }
        
        // Check if all correct answers are selected (order doesn't matter)
        return question.answerMultiple.every(option => 
          userAnswer.selectedMultipleOptions?.includes(option)
        );
      }
      
      // Check numeric answers
      if (question.answerNumeric !== undefined && userAnswer.numericAnswer) {
        const numericUserAnswer = parseFloat(userAnswer.numericAnswer);
        
        if (!isNaN(numericUserAnswer)) {
          return question.answerNumeric === numericUserAnswer;
        }
        return false;
      }
      
      // If no valid answer type was found or user didn't provide an answer
      return false;
    };

    const displayUserAnswer = (
      question: DppQuestion,
      userAnswer: {
        selectedOption?: string;
        selectedMultipleOptions?: string[];
        numericAnswer?: string;
      }
    ) => {
      // Display single choice answer
      if (question.objectiveoptions && userAnswer.selectedOption) {
        const option = question.objectiveoptions.find(opt => opt.option === userAnswer.selectedOption);
        return (
          <View>
            <Text className="text-gray-800">
              {userAnswer.selectedOption}) {option?.isImage ? '' : option?.text || ''}
            </Text>
            {option?.isImage && (
              <Image 
                source={{ uri: option.text }} 
                className="w-full h-40 mt-2 rounded-lg"
                resizeMode="contain"
              />
            )}
          </View>
        );
      }
      
      // Display multiple choice answers
      if (question.multipleObjective && userAnswer.selectedMultipleOptions && userAnswer.selectedMultipleOptions.length > 0) {
        return (
          <View>
            {userAnswer.selectedMultipleOptions.map((opt, idx) => {
              const option = question.multipleObjective?.find(o => o.option === opt);
              return (
                <View key={idx} className="mb-2">
                  <Text className="text-gray-800">
                    {opt}) {option?.isImage ? '' : option?.text || ''}
                  </Text>
                  {option?.isImage && (
                    <Image 
                      source={{ uri: option.text }} 
                      className="w-full h-40 mt-1 rounded-lg"
                      resizeMode="contain"
                    />
                  )}
                </View>
              );
            })}
          </View>
        );
      }
      
      // Display numeric answer
      if (question.answerNumeric !== undefined && userAnswer.numericAnswer) {
        return <Text className="text-gray-800">{userAnswer.numericAnswer}</Text>;
      }
      
      return <Text className="text-gray-500 italic">No answer provided</Text>;
    };

    const displayCorrectAnswer = (question: DppQuestion) => {
      // Display correct single choice answer
      if (question.answerObjective && question.objectiveoptions) {
        const option = question.objectiveoptions.find(opt => opt.option === question.answerObjective);
        return (
          <View>
            <Text className="text-green-800">
              {question.answerObjective}) {option?.isImage ? '' : option?.text || ''}
            </Text>
            {option?.isImage && (
              <Image 
                source={{ uri: option.text }} 
                className="w-full h-40 mt-2 rounded-lg"
                resizeMode="contain"
              />
            )}
          </View>
        );
      }
      
      // Display correct multiple choice answers
      if (question.answerMultiple && question.multipleObjective) {
        return (
          <View>
            {question.answerMultiple.map((opt, idx) => {
              const option = question.multipleObjective?.find(o => o.option === opt);
              return (
                <View key={idx} className="mb-2">
                  <Text className="text-green-800">
                    {opt}) {option?.isImage ? '' : option?.text || ''}
                  </Text>
                  {option?.isImage && (
                    <Image 
                      source={{ uri: option.text }} 
                      className="w-full h-40 mt-1 rounded-lg"
                      resizeMode="contain"
                    />
                  )}
                </View>
              );
            })}
          </View>
        );
      }
      
      // Display correct numeric answer
      if (question.answerNumeric !== undefined) {
        let displayValue = '';
        
        if (typeof question.answerNumeric === 'number') {
          displayValue = question.answerNumeric.toString();
        } else if (typeof question.answerNumeric === 'string') {
          displayValue = question.answerNumeric;
        } else {
          displayValue = String(question.answerNumeric);
        }
        
        return <Text className="text-green-800">{displayValue}</Text>;
      }
      
      return <Text className="text-gray-500 italic">No answer available</Text>;
    };

    const handleWebViewMessage = (questionId: string, event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'contentHeight') {
          setWebViewHeights(prev => ({
            ...prev,
            [questionId]: data.height + 20 // Add some padding
          }));
        }
      } catch (error) {
        console.error('Error parsing WebView message:', error);
      }
    };

    const renderDynamicLatex = (content: string, questionId: string, style: any = {}) => {
      if (!content || typeof content !== 'string') return null;
      
      // Check if content contains LaTeX
      const containsLatex = content.includes('$');
      
      if (!containsLatex) {
        // If no LaTeX, use the regular renderLatex function
        return renderLatex(content, style);
      }
      
      // HTML template with script to report content height
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
              }
              strong { font-weight: bold; }
              em { font-style: italic; }
              #content {
                padding: 0;
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div id="content">${processContent(content)}</div>
            <script>
              // Function to report content height to React Native
              function reportHeight() {
                const height = document.documentElement.scrollHeight;
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'contentHeight',
                  height: height
                }));
              }
              
              // Render LaTeX and then report height
              document.addEventListener("DOMContentLoaded", function() {
                renderMathInElement(document.getElementById("content"), {
                  delimiters: [
                    {left: "$", right: "$", display: false},
                    {left: "$$", right: "$$", display: true}
                  ],
                  throwOnError: false
                });
                
                // Report height after rendering
                setTimeout(reportHeight, 100);
              });
              
              // Report height on load as well
              window.onload = reportHeight;
            </script>
          </body>
        </html>
      `;
      
      return (
        <WebView
          key={`latex-${questionId}`}
          originWhitelist={['*']}
          source={{ html }}
          style={[
            { 
              backgroundColor: 'transparent',
              height: webViewHeights[questionId] || 100, // Use stored height or default
              width: '100%'
            }, 
            style
          ]}
          scrollEnabled={false}
          javaScriptEnabled={true}
          onMessage={(event) => handleWebViewMessage(questionId, event)}
        />
      );
    };

    const processContent = (content: string): string => {
      if (!content) return '';
      
      // Escape HTML special characters except for our formatting markers
      let processed = content
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, "'")
      
      // Process bold formatting
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Process italic formatting
      processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Process line breaks
      processed = processed.replace(/\n/g, '<br>');
      
      return processed;
    };

    const displayDynamicUserAnswer = (
      question: DppQuestion,
      userAnswer: {
        selectedOption?: string;
        selectedMultipleOptions?: string[];
        numericAnswer?: string;
      }
    ) => {
      // Display single choice answer
      if (question.objectiveoptions && userAnswer.selectedOption) {
        const option = question.objectiveoptions.find(opt => opt.option === userAnswer.selectedOption);
        return (
          <View>
            <View className="flex-row items-start">
              <Text className="text-gray-800 mr-1">
                {userAnswer.selectedOption})
              </Text>
              {option?.isImage ? (
                <Image 
                  source={{ uri: option.text }} 
                  className="w-full h-40 mt-2 rounded-lg"
                  resizeMode="contain"
                />
              ) : (
                <View className="flex-1">
                  {renderDynamicLatex(option?.text || '', `user-answer-${question._id}-${userAnswer.selectedOption}`, { 
                    fontSize: 14, 
                    color: '#374151' 
                  })}
                </View>
              )}
            </View>
          </View>
        );
      }
      
      // Display multiple choice answers
      if (question.multipleObjective && userAnswer.selectedMultipleOptions && userAnswer.selectedMultipleOptions.length > 0) {
        return (
          <View>
            {userAnswer.selectedMultipleOptions.map((opt, idx) => {
              const option = question.multipleObjective?.find(o => o.option === opt);
              return (
                <View key={idx} className="mb-2">
                  <View className="flex-row items-start">
                    <Text className="text-gray-800 mr-1">
                      {opt})
                    </Text>
                    {option?.isImage ? (
                      <Image 
                        source={{ uri: option.text }} 
                        className="w-full h-40 mt-1 rounded-lg"
                        resizeMode="contain"
                      />
                    ) : (
                      <View className="flex-1">
                        {renderDynamicLatex(option?.text || '', `user-answer-${question._id}-multiple-${idx}`, { 
                          fontSize: 14, 
                          color: '#374151' 
                        })}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        );
      }
      
      // Display numeric answer
      if (question.answerNumeric !== undefined && userAnswer.numericAnswer) {
        return <Text className="text-gray-800">{userAnswer.numericAnswer}</Text>;
      }
      
      return <Text className="text-gray-500 italic">No answer provided</Text>;
    };

    const displayDynamicCorrectAnswer = (question: DppQuestion) => {
      // Display correct single choice answer
      if (question.answerObjective && question.objectiveoptions) {
        const option = question.objectiveoptions.find(opt => opt.option === question.answerObjective);
        return (
          <View>
            <View className="flex-row items-start">
              <Text className="text-green-800 mr-1">
                {question.answerObjective})
              </Text>
              {option?.isImage ? (
                <Image 
                  source={{ uri: option.text }} 
                  className="w-full h-40 mt-2 rounded-lg"
                  resizeMode="contain"
                />
              ) : (
                <View className="flex-1">
                  {renderDynamicLatex(option?.text || '', `correct-answer-${question._id}-${question.answerObjective}`, { 
                    fontSize: 14, 
                    color: '#005f46' 
                  })}
                </View>
              )}
            </View>
          </View>
        );
      }
      
      // Display correct multiple choice answers
      if (question.answerMultiple && question.multipleObjective) {
        return (
          <View>
            {question.answerMultiple.map((opt, idx) => {
              const option = question.multipleObjective?.find(o => o.option === opt);
              return (
                <View key={idx} className="mb-2">
                  <View className="flex-row items-start">
                    <Text className="text-green-800 mr-1">
                      {opt})
                    </Text>
                    {option?.isImage ? (
                      <Image 
                        source={{ uri: option.text }} 
                        className="w-full h-40 mt-1 rounded-lg"
                        resizeMode="contain"
                      />
                    ) : (
                      <View className="flex-1">
                        {renderDynamicLatex(option?.text || '', `correct-answer-${question._id}-multiple-${idx}`, { 
                          fontSize: 14, 
                          color: '#005f46' 
                        })}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        );
      }
      
      // Display correct numeric answer
      if (question.answerNumeric !== undefined) {
        let displayValue = '';
        
        if (typeof question.answerNumeric === 'number') {
          displayValue = question.answerNumeric.toString();
        } else if (typeof question.answerNumeric === 'string') {
          displayValue = question.answerNumeric;
        } else {
          displayValue = String(question.answerNumeric);
        }
        
        return <Text className="text-green-800">{displayValue}</Text>;
      }
      
      return <Text className="text-gray-500 italic">No answer available</Text>;
    };

    return (
      <ScrollView className="flex-1">
        <View className="flex-row items-center p-4">
          <View style={{ width: 50, alignItems: 'flex-start', zIndex: 10 }}>
            {!showDppList && (
              <TouchableOpacity 
                onPress={handleBackToDppList}
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'transparent' }}
              >
                <Text className="text-humpback-500 text-3xl font-bold">←</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800 text-center">Daily Practice Problems</Text>
          </View>
          <View style={{ width: 50 }}></View> {/* Empty view for balance */}
        </View>
        
        {showDppList ? (
          // List of DPPs
          dpps.map((dpp, index) => (
            <TouchableOpacity 
              key={dpp._id}
              onPress={() => handleDppSelect(dpp._id)}
              className="bg-humpback-500 rounded-[20px] overflow-hidden mb-4 mx-3"
              style={{
                borderWidth: 3,
                borderColor: '#2259A1',
                borderBottomWidth: 6,
                borderRightWidth: 6,
              }}
            >
              <View className="p-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-semibold text-white">
                    {dpp.title || `DPP ${index + 1}`}
                  </Text>
                  {/* Remove this Text component that shows the date */}
                  {/* <Text className="text-sm text-white/80">
                    {formatDate(dpp.createdAt)}
                  </Text> */}
                </View>
                <View className="flex-row items-center mt-2">
                  <Text className="text-white/90 text-sm">
                    {dpp.dppQuestions.length} questions
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : showResults ? (
          <View className="px-3">
            {currentDpp && (
              <View className="mb-4 p-4 bg-humpback-100 rounded-lg">
                <Text className="text-lg font-semibold text-gray-800">
                  {currentDpp.title || `DPP ${dpps.findIndex(d => d._id === selectedDpp) + 1}`} - Results
                </Text>
              </View>
            )}
            
            <ScrollView className="mb-6">
              {currentDpp && currentDpp.dppQuestions.map((question, index) => {
                const userAnswer = userAnswers[question._id] || {};
                const isCorrect = checkIfAnswerIsCorrect(question, userAnswer);
                const timeTaken = questionTimes[question._id] || 0;
                
                return (
                  <View key={question._id} className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-row items-start flex-1 mr-2">
                        <Text className="text-base font-medium text-gray-800 mr-1">
                          {question.serialNumber}.
                        </Text>
                        <View className="flex-1">
                          {renderDynamicLatex(question.question, `result-${question._id}`, { 
                            fontSize: 16, 
                            color: '#1f2937', 
                            fontWeight: '500' 
                          })}
                        </View>
                      </View>
                      <View className={`px-3 py-1 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Text className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Display question image if available */}
                    {question.questionImage && (
                      <Image 
                        source={{ uri: question.questionImage }} 
                        className="w-full h-48 mb-4 rounded-lg"
                        resizeMode="contain"
                      />
                    )}
                    
                    {/* Display time taken */}
                    <Text className="text-sm text-gray-600 mb-2">
                      Time taken: {formatTime(timeTaken)}
                    </Text>
                    
                    {/* Display user's answer */}
                    <View className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <Text className="text-sm font-medium text-gray-700 mb-1">Your answer:</Text>
                      {displayUserAnswer(question, userAnswer)}
                    </View>
                    
                    {/* Display correct answer */}
                    <View className="mt-3 p-3 bg-green-50 rounded-lg">
                      <Text className="text-sm font-medium text-green-700 mb-1">Correct answer:</Text>
                      {displayCorrectAnswer(question)}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          // Questions for the selected DPP
          <View>
            {/* DPP Title */}
            {currentDpp && (
              <View className="mb-4 mx-3 p-4 bg-humpback-100 rounded-lg">
                <Text className="text-lg font-semibold text-gray-800">
                  {currentDpp.title || `DPP ${dpps.findIndex(d => d._id === selectedDpp) + 1}`}
                </Text>
                <View className="flex-row items-center mt-1 justify-between">
                  <Text className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {currentDpp.dppQuestions.length}
                  </Text>
                  <Text className="text-sm font-medium text-humpback-500">
                    Time: {elapsedTime !== undefined ? formatTime(elapsedTime) : "00:00"}
                  </Text>
                </View>
              </View>
            )}
            
            {/* Current Question */}
            <View className="mt-2 mb-4 mx-3">
              {currentQuestion && (
                <View className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <View className="flex-row items-start mb-3">
                    <Text className="text-base font-medium text-gray-800 mr-1">
                      {currentQuestion.serialNumber}.
                    </Text>
                    <View className="flex-1">
                      {renderDynamicLatex(currentQuestion.question, currentQuestion._id, { 
                        fontSize: 16, 
                        color: '#1f2937', 
                        fontWeight: '500' 
                      })}
                    </View>
                  </View>
                
                  {currentQuestion.questionImage && (
                    <Image 
                      source={{ uri: currentQuestion.questionImage }} 
                      className="w-full h-48 mb-4 rounded-lg"
                      resizeMode="contain"
                    />
                  )}

                  {/* Type 1: Objective (Single Choice) Questions */}
                  {currentQuestion.objectiveoptions && currentQuestion.objectiveoptions.length > 0 && (
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 mb-2">Single Choice:</Text>
                      {currentQuestion.objectiveoptions.map((option, index) => (
                        <TouchableOpacity 
                          key={index} 
                          onPress={() => handleSelectOption(option.option)}
                          className={`flex-row items-center mb-3 p-3 border rounded-lg ${
                            selectedOption === option.option 
                              ? 'border-humpback-500 bg-humpback-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <View className={`h-6 w-6 rounded-full border mr-3 items-center justify-center ${
                            selectedOption === option.option 
                              ? 'border-humpback-500 bg-humpback-500' 
                              : 'border-gray-400'
                          }`}>
                            {selectedOption === option.option && (
                              <View className="h-3 w-3 bg-white rounded-full" />
                            )}
                          </View>
                          <Text className="mr-2 font-medium">{option.option})</Text>
                          {option.isImage ? (
                            <Image 
                              source={{ uri: option.text }} 
                              className="w-full h-24 rounded-lg"
                              resizeMode="contain"
                            />
                          ) : (
                            <View className="flex-1">
                              {renderDynamicLatex(option.text, `${currentQuestion._id}-option-${index}`, { 
                                fontSize: 14, 
                                color: '#374151' 
                              })}
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Type 2: Multiple Choice Questions */}
                  {currentQuestion.multipleObjective && currentQuestion.multipleObjective.length > 0 && (
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 mb-2">Multiple Choice:</Text>
                      {currentQuestion.multipleObjective.map((option, index) => (
                        <TouchableOpacity 
                          key={index} 
                          onPress={() => handleSelectMultipleOption(option.option)}
                          className={`flex-row items-center mb-3 p-3 border rounded-lg ${
                            selectedMultipleOptions.includes(option.option) 
                              ? 'border-humpback-500 bg-humpback-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <View className={`h-6 w-6 rounded border mr-3 items-center justify-center ${
                            selectedMultipleOptions.includes(option.option) 
                              ? 'border-humpback-500 bg-humpback-500' 
                              : 'border-gray-400'
                          }`}>
                            {selectedMultipleOptions.includes(option.option) && (
                              <Text className="text-white text-xs font-bold">✓</Text>
                            )}
                          </View>
                          <Text className="mr-2 font-medium">{option.option})</Text>
                          {option.isImage ? (
                            <Image 
                              source={{ uri: option.text }} 
                              className="w-full h-24 rounded-lg"
                              resizeMode="contain"
                            />
                          ) : (
                            <View className="flex-1">
                              {renderLatex(option.text, { 
                                fontSize: 14, 
                                color: '#374151' 
                              })}
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Type 3: Numeric Answer Questions */}
                  {currentQuestion.answerNumeric !== undefined && (
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 mb-2">Numeric Answer:</Text>
                      <TextInput
                        value={numericAnswer}
                        onChangeText={handleNumericAnswerChange}
                        placeholder="Enter your answer"
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-lg p-4 mt-1 text-base"
                      />
                    </View>
                  )}
                </View>
              )}
              
              {/* Navigation Buttons */}
              {currentDpp && currentDpp.dppQuestions.length > 0 && (
                <View className="flex-row justify-between mt-4 mx-3 mb-6">
                  <TouchableOpacity 
                    onPress={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`p-3 rounded-full flex-1 mr-2 flex-row justify-center items-center ${
                      currentQuestionIndex === 0 ? 'bg-gray-300' : 'bg-humpback-500'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      currentQuestionIndex === 0 ? 'text-gray-500' : 'text-white'
                    }`}>
                      Previous
                    </Text>
                  </TouchableOpacity>
                  
                  {currentQuestionIndex === currentDpp.dppQuestions.length - 1 ? (
                    <TouchableOpacity 
                      onPress={handleFinishTest}
                      className="p-3 rounded-full flex-1 ml-2 bg-green-600 flex-row justify-center items-center"
                    >
                      <Text className="text-center font-medium text-white">
                        Finish Test
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      onPress={handleNextQuestion}
                      className="p-3 rounded-full flex-1 ml-2 bg-humpback-500 flex-row justify-center items-center"
                    >
                      <Text className="text-center font-medium text-white">
                        Next
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    )
}

export default DPPs