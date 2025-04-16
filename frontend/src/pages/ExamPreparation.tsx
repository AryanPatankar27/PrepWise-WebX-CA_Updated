import React, { useState, useRef, useEffect } from 'react';
import { generateMCQ, generateMCQFromPDF, evaluateAnswer } from '../services/geminiApi';
import { extractTextFromPdf } from '../utils/pdfUtils';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import Label from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

interface MCQOption {
  id: string;
  text: string;
  correct: boolean;
}

interface MCQ {
  question: string;
  options: MCQOption[];
  explanation: string;
}

const topics = [
  'Algorithms',
  'Data Structures',
  'System Design',
  'Operating Systems',
  'Database Management',
  'Computer Networks',
  'Software Engineering',
  'Web Development',
  'Machine Learning',
  'Artificial Intelligence'
];

export default function ExamPreparation() {
  // Separate state for topic-based and PDF-based MCQs
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'topic' | 'pdf'>('topic');
  
  // State for topic MCQ
  const [topicMCQ, setTopicMCQ] = useState<MCQ | null>(null);
  
  // State for PDF MCQs - we store an array and track the current index
  const [pdfMCQs, setPdfMCQs] = useState<MCQ[]>([]);
  const [currentPdfMCQIndex, setCurrentPdfMCQIndex] = useState<number>(0);
  // The current PDF MCQ is derived from the array and current index
  const pdfMCQ = pdfMCQs.length > 0 && currentPdfMCQIndex < pdfMCQs.length 
    ? pdfMCQs[currentPdfMCQIndex] 
    : null;
  
  // Separate state for selected options in each tab
  const [topicSelectedOption, setTopicSelectedOption] = useState<string>('');
  const [pdfSelectedOption, setPdfSelectedOption] = useState<string>('');
  
  // Separate state for explanation visibility in each tab
  const [topicShowExplanation, setTopicShowExplanation] = useState<boolean>(false);
  const [pdfShowExplanation, setPdfShowExplanation] = useState<boolean>(false);
  
  // Separate state for feedback in each tab
  const [topicFeedback, setTopicFeedback] = useState<{ correct: boolean; feedback: string } | null>(null);
  const [pdfFeedback, setPdfFeedback] = useState<{ correct: boolean; feedback: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current MCQ, selected option, show explanation, and feedback based on active tab
  const currentMCQ = activeTab === 'topic' ? topicMCQ : pdfMCQ;
  const selectedOption = activeTab === 'topic' ? topicSelectedOption : pdfSelectedOption;
  const showExplanation = activeTab === 'topic' ? topicShowExplanation : pdfShowExplanation;
  const feedback = activeTab === 'topic' ? topicFeedback : pdfFeedback;

  // Set option functions
  const setSelectedOption = (optionId: string) => {
    if (activeTab === 'topic') {
      setTopicSelectedOption(optionId);
    } else {
      setPdfSelectedOption(optionId);
    }
  };

  // Set explanation functions
  const setShowExplanation = (show: boolean) => {
    if (activeTab === 'topic') {
      setTopicShowExplanation(show);
    } else {
      setPdfShowExplanation(show);
    }
  };

  // Set feedback functions
  const setFeedback = (feedbackData: { correct: boolean; feedback: string } | null) => {
    if (activeTab === 'topic') {
      setTopicFeedback(feedbackData);
    } else {
      setPdfFeedback(feedbackData);
    }
  };

  // Handle tab change - clear error message
  const handleTabChange = (tab: 'topic' | 'pdf') => {
    setActiveTab(tab);
    setErrorMessage('');
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setTopicMCQ(null);
    setTopicSelectedOption('');
    setTopicShowExplanation(false);
    setTopicFeedback(null);
    setErrorMessage('');
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPdfFile(file);
      setPdfMCQs([]);
      setCurrentPdfMCQIndex(0);
      setPdfSelectedOption('');
      setPdfShowExplanation(false);
      setPdfFeedback(null);
      setErrorMessage('');
      
      // Read the PDF file
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          try {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Use the placeholder text extraction function
            const extractedText = await extractTextFromPdf(uint8Array);
            setPdfText(extractedText);
            
            // Show success message
            console.log("PDF processed successfully!");
          } catch (error) {
            console.error("Error extracting text from PDF:", error);
            setErrorMessage("Failed to process PDF. Using sample text instead.");
            
            // If extraction fails, use a sample text
            setPdfText("Sample text from the PDF for demo purposes.");
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const generateQuestion = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    if (activeTab === 'topic') {
      setTopicSelectedOption('');
      setTopicShowExplanation(false);
      setTopicFeedback(null);
    } else {
      setPdfSelectedOption('');
      setPdfShowExplanation(false);
      setPdfFeedback(null);
    }
    
    try {
      if (activeTab === 'topic' && selectedTopic) {
        // Include a specific request for relevant questions about the topic
        console.log(`Generating MCQ for topic: ${selectedTopic}`);
        const mcqData = await generateMCQ(selectedTopic);
        setTopicMCQ(mcqData);
      } else if (activeTab === 'pdf' && pdfText) {
        // Ensure we're passing the PDF text and requesting relevant MCQs
        console.log(`Generating MCQ from PDF with ${pdfText.length} characters`);
        const mcqData = await generateMCQFromPDF(pdfText);
        console.log("Received MCQ data:", mcqData);
        
        // This is the key fix - store the array of MCQs and set the current index to 0
        setPdfMCQs(mcqData);
        setCurrentPdfMCQIndex(0);
      } else {
        throw new Error(activeTab === 'topic' 
          ? "Please select a topic first" 
          : "Please upload a PDF file first");
      }
      
    } catch (error) {
      console.error("Error generating MCQ:", error);
      setErrorMessage(`Failed to generate question. ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = async () => {
    if (!currentMCQ || !selectedOption) return;
    
    setIsLoading(true);
    try {
      const correctOption = currentMCQ.options.find(opt => opt.correct);
      
      if (!correctOption) {
        console.error("No correct option found in MCQ data:", currentMCQ);
        // Fallback: try to find the first option that might be correct
        const potentialCorrectOptions = currentMCQ.options.filter(opt => 
          opt.text.toLowerCase().includes("correct") || 
          opt.text.toLowerCase().includes("true") ||
          opt.text.toLowerCase().includes("right")
        );
        
        if (potentialCorrectOptions.length > 0) {
          console.log("Using potential correct option as fallback:", potentialCorrectOptions[0]);
          handleCorrectAnswer(potentialCorrectOptions[0].id);
          return;
        }
        
        // If still no correct option, use the first option as default
        console.log("Using first option as default correct answer");
        handleCorrectAnswer(currentMCQ.options[0].id);
        return;
      }
      
      console.log("Submitting answer - Selected:", selectedOption, "Correct:", correctOption.id);
      
      // Process the answer with the correct option
      handleCorrectAnswer(correctOption.id);
      
    } catch (error) {
      console.error("Error evaluating answer:", error);
      setErrorMessage("Failed to evaluate answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorrectAnswer = async (correctOptionId: string) => {
    // First, directly set feedback based on correctness (immediate feedback)
    const initialFeedback = {
      correct: selectedOption === correctOptionId,
      feedback: selectedOption === correctOptionId 
        ? "Correct! Good job!" 
        : `Incorrect. The correct answer is option ${correctOptionId}.`
    };
    
    // Show immediate feedback
    setFeedback(initialFeedback);
    setShowExplanation(true);
    
    // Then try to get more detailed feedback from the API
    try {
      const evaluationResult = await evaluateAnswer(
        currentMCQ!.question,
        selectedOption,
        correctOptionId
      );
      
      // Only update feedback if we get a valid response
      if (evaluationResult && typeof evaluationResult.correct === 'boolean' && evaluationResult.feedback) {
        setFeedback(evaluationResult);
      }
    } catch (evalError) {
      console.error("Error getting detailed feedback:", evalError);
      // We already have basic feedback, so we don't need to show an error
    }
  };

  const handleNextQuestion = () => {
    if (activeTab === 'topic') {
      setTopicMCQ(null);
      setTopicSelectedOption('');
      setTopicShowExplanation(false);
      setTopicFeedback(null);
      generateQuestion();
    } else {
      // For PDF MCQs, just go to the next question in the array if available
      if (currentPdfMCQIndex < pdfMCQs.length - 1) {
        setCurrentPdfMCQIndex(currentPdfMCQIndex + 1);
        setPdfSelectedOption('');
        setPdfShowExplanation(false);
        setPdfFeedback(null);
      } else {
        // If we've gone through all questions, generate new ones
        setPdfMCQs([]);
        setCurrentPdfMCQIndex(0);
        setPdfSelectedOption('');
        setPdfShowExplanation(false);
        setPdfFeedback(null);
        generateQuestion();
      }
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const fileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        
        // Clear PDF state when a new file is dropped
        setPdfMCQs([]);
        setCurrentPdfMCQIndex(0);
        setPdfSelectedOption('');
        setPdfShowExplanation(false);
        setPdfFeedback(null);
        
        // Read the PDF file
        const reader = new FileReader();
        reader.onload = async (evt) => {
          if (evt.target?.result) {
            try {
              const arrayBuffer = evt.target.result as ArrayBuffer;
              const uint8Array = new Uint8Array(arrayBuffer);
              
              // Use the placeholder text extraction function
              const extractedText = await extractTextFromPdf(uint8Array);
              setPdfText(extractedText);
              
              // Show success message
              console.log("PDF processed successfully!");
            } catch (error) {
              console.error("Error extracting text from PDF:", error);
              setErrorMessage("Failed to process PDF. Using sample text instead.");
              
              // If extraction fails, use a sample text
              setPdfText("Sample text from the PDF for demo purposes.");
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setErrorMessage("Please upload a PDF file");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Exam Preparation
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate multiple-choice questions from selected topics or your uploaded study materials
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white rounded-t-lg shadow-md mb-px justify-center p-1">
          <button
            className={`py-3 px-6 rounded-lg text-lg font-medium transition duration-200 ${
              activeTab === 'topic'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleTabChange('topic')}
          >
            Topic-Based MCQs
          </button>
          <button
            className={`py-3 px-6 rounded-lg text-lg font-medium transition duration-200 ${
              activeTab === 'pdf'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleTabChange('pdf')}
          >
            PDF-Based MCQs
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-lg shadow-md p-8">
          {activeTab === 'topic' ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Select a Topic</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${
                      selectedTopic === topic
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700 font-medium shadow-sm'
                        : 'border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                    }`}
                    onClick={() => handleTopicChange(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button
                  onClick={generateQuestion}
                  disabled={!selectedTopic || isLoading}
                  className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Question...
                    </span>
                  ) : (
                    <>Generate Topic MCQ</>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Upload Study Material</h2>
              <div
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-200 ${
                  pdfFile ? 'border-green-400 bg-green-50' : 'border-blue-300 hover:border-blue-500 bg-blue-50'
                }`}
                style={{ minHeight: '200px' }}
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
              >
                {pdfFile ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-green-600 mb-2">File uploaded successfully!</p>
                    <p className="text-sm text-gray-600 mb-4">{pdfFile.name}</p>
                    <Button
                      onClick={() => {
                        setPdfFile(null);
                        setPdfText('');
                        setPdfMCQs([]);
                        setCurrentPdfMCQIndex(0);
                        setPdfSelectedOption('');
                        setPdfShowExplanation(false);
                        setPdfFeedback(null);
                      }}
                      className="bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">Drag & Drop your PDF here</p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
                    <Button
                      onClick={handleFileButtonClick}
                      disabled={isLoading}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                    >
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePdfUpload}
                      accept=".pdf"
                      className="hidden"
                      disabled={isLoading}
                    />
                    <p className="mt-4 text-xs text-gray-500">
                      Supports: PDF files up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-8 text-center">
                <Button
                  onClick={generateQuestion}
                  disabled={!pdfText || isLoading}
                  className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Question...
                    </span>
                  ) : (
                    <>Generate PDF MCQ</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Question Display */}
          {currentMCQ && (
            <div className="mt-10 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-6">
                <h2 className="text-xl font-bold text-white">Question</h2>
              </div>
              
              <div className="p-6">
                <p className="text-lg text-gray-800 font-medium mb-8">{currentMCQ.question}</p>
                
                <div className="space-y-3 mb-8">
                  {currentMCQ.options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => !showExplanation && handleOptionSelect(option.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedOption === option.id && !showExplanation
                          ? 'bg-blue-100 border border-blue-300'
                          : !showExplanation
                          ? 'border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          : 'border'
                      } ${
                        showExplanation && option.correct
                          ? 'bg-green-100 border-green-500'
                          : ''
                      } ${
                        showExplanation &&
                        selectedOption === option.id &&
                        !option.correct
                          ? 'bg-red-100 border-red-300'
                          : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border ${
                          selectedOption === option.id
                            ? showExplanation
                              ? option.correct
                                ? 'border-green-500 bg-green-500'
                                : 'border-red-500 bg-red-500'
                              : 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                          } flex items-center justify-center mr-3 mt-0.5`}
                        >
                          {selectedOption === option.id && (
                            <span className="text-white text-xs">
                              {showExplanation ? (
                                option.correct ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )
                              ) : (
                                '✓'
                              )}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-700">
                          <span className="font-medium">{option.id}) </span>
                          {option.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!showExplanation ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOption || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking...
                      </span>
                    ) : (
                      'Submit Answer'
                    )}
                  </Button>
                ) : (
                  <div>
                    {/* Explanation */}
                    <div className="mb-6 p-5 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2">Explanation</h3>
                      <p className="text-gray-700">{currentMCQ.explanation}</p>
                    </div>
                    
                    {/* Feedback */}
                    {feedback && (
                      <div
                        className={`mb-6 p-5 rounded-lg ${
                          feedback.correct 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <h3 className={`font-semibold mb-2 ${
                          feedback.correct ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {feedback.correct ? '✓ Correct!' : '✗ Incorrect'}
                        </h3>
                        <p className="text-gray-700">{feedback.feedback}</p>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Next Question
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 