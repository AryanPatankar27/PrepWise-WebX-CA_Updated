import React, { useState, useRef } from 'react';
import { generateMCQ, generateMCQFromPDF } from '../services/geminiApi';
import { extractTextFromPDF } from '../services/pdfService';
import { saveMCQResult, prepareTopicMCQResult, preparePdfMCQResult } from '../services/dbService';

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

const ExamPreparation: React.FC = () => {
  // PDF tab state
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [pdfName, setPDFName] = useState<string>("");
  const [pdfMCQs, setPdfMCQs] = useState<MCQ[]>([]);
  const [currentPdfMCQIndex, setCurrentPdfMCQIndex] = useState<number>(0);
  const [pdfSelectedAnswer, setPdfSelectedAnswer] = useState<string>("");
  const [pdfShowExplanation, setPdfShowExplanation] = useState<boolean>(false);
  
  // Topic tab state
  const [topic, setTopic] = useState<string>("");
  const [topicMCQs, setTopicMCQs] = useState<MCQ[]>([]);
  const [currentTopicMCQIndex, setCurrentTopicMCQIndex] = useState<number>(0);
  const [topicSelectedAnswer, setTopicSelectedAnswer] = useState<string>("");
  const [topicShowExplanation, setTopicShowExplanation] = useState<boolean>(false);
  
  // Shared state
  const [activeTab, setActiveTab] = useState<'topic' | 'pdf'>('topic');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed properties
  const currentTopicMCQ = topicMCQs[currentTopicMCQIndex];
  const currentPdfMCQ = pdfMCQs[currentPdfMCQIndex];
  const hasMoreTopicQuestions = currentTopicMCQIndex < topicMCQs.length - 1;
  const hasMorePdfQuestions = currentPdfMCQIndex < pdfMCQs.length - 1;

  // Add the following state variables
  const [pdfAnswers, setPdfAnswers] = useState<{ [key: number]: string }>({});
  const [topicAnswers, setTopicAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [lastScore, setLastScore] = useState<number>(0);
  const [lastTotal, setLastTotal] = useState<number>(0);

  // Tab handlers
  const switchTab = (tab: 'topic' | 'pdf') => {
    setActiveTab(tab);
    setMessage("");
  };

  // PDF handlers
  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPDF(file);
      setPDFName(file.name);
      setPdfMCQs([]);
      setCurrentPdfMCQIndex(0);
      setPdfSelectedAnswer("");
      setPdfShowExplanation(false);
      console.log("PDF file selected:", file.name);
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedPDF(null);
    setPDFName("");
    setPdfMCQs([]);
    setCurrentPdfMCQIndex(0);
    setPdfSelectedAnswer("");
    setPdfShowExplanation(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generatePDFMCQ = async () => {
    if (!selectedPDF) {
      setMessage("Please upload a PDF file first");
      return;
    }

    try {
      setLoading(true);
      setMessage("Extracting text from PDF...");
      
      // Extract text directly from the PDF file
      const pdfText = await extractTextFromPDF(selectedPDF);
      console.log(`Extracted ${pdfText.length} characters from PDF`);
      
      if (!pdfText || pdfText.length < 100) {
        setMessage("The PDF doesn't contain enough text to generate questions");
        setLoading(false);
        return;
      }
      
      setMessage("Generating MCQs from PDF content...");
      const mcqData = await generateMCQFromPDF(pdfText);
      console.log("Received MCQ data:", mcqData);
      
      setPdfMCQs(mcqData);
      setCurrentPdfMCQIndex(0);
      setPdfSelectedAnswer("");
      setPdfShowExplanation(false);
      setLoading(false);
      setMessage("MCQs generated successfully from PDF!");
    } catch (error) {
      console.error("Error generating MCQs from PDF:", error);
      setLoading(false);
      setMessage(`Error: ${error instanceof Error ? error.message : "Failed to generate MCQs from PDF"}`);
    }
  };

  const nextPdfQuestion = () => {
    if (hasMorePdfQuestions) {
      setPdfSelectedAnswer("");
      setPdfShowExplanation(false);
      setCurrentPdfMCQIndex(prev => prev + 1);
    }
  };

  const handlePdfAnswerSelect = (optionId: string) => {
    setPdfSelectedAnswer(optionId);
    // Store answer for this question
    setPdfAnswers(prev => ({
      ...prev,
      [currentPdfMCQIndex]: optionId
    }));
  };

  const togglePdfExplanation = () => {
    setPdfShowExplanation(prev => !prev);
  };

  // Topic handlers
  const generateTopicMCQ = async () => {
    if (!topic) {
      setMessage("Please enter a topic first");
      return;
    }

    try {
      setLoading(true);
      setMessage("Generating question for topic: " + topic);
      const data = await generateMCQ(topic);
      // Put the new MCQ at the beginning of the array
      setTopicMCQs([data]);
      setCurrentTopicMCQIndex(0);
      setTopicSelectedAnswer("");
      setTopicShowExplanation(false);
      setLoading(false);
      setMessage("MCQ generated successfully!");
    } catch (error) {
      console.error("Error generating MCQ:", error);
      setLoading(false);
      setMessage("Error generating MCQ. Please try again.");
    }
  };

  const nextTopicQuestion = async () => {
    // Rather than navigating to the next question, we generate a new one
    try {
      setLoading(true);
      setMessage("Generating new question for topic: " + topic);
      const data = await generateMCQ(topic);
      // Add the new MCQ to the array
      setTopicMCQs(prev => [...prev, data]);
      setCurrentTopicMCQIndex(prev => prev + 1);
      setTopicSelectedAnswer("");
      setTopicShowExplanation(false);
      setLoading(false);
      setMessage("MCQ generated successfully!");
    } catch (error) {
      console.error("Error generating MCQ:", error);
      setLoading(false);
      setMessage("Error generating next MCQ. Please try again.");
    }
  };

  const handleTopicAnswerSelect = (optionId: string) => {
    setTopicSelectedAnswer(optionId);
    // Store answer for this question
    setTopicAnswers(prev => ({
      ...prev,
      [currentTopicMCQIndex]: optionId
    }));
  };

  const toggleTopicExplanation = () => {
    setTopicShowExplanation(prev => !prev);
  };

  // Common utility functions
  const isCorrectAnswer = (questionOptions: MCQOption[], selectedOptionId: string): boolean => {
    const correctOption = questionOptions.find(opt => opt.correct);
    return correctOption?.id === selectedOptionId;
  };

  const isPdfCorrect = pdfSelectedAnswer ? 
    isCorrectAnswer(currentPdfMCQ?.options || [], pdfSelectedAnswer) : false;
  
  const isTopicCorrect = topicSelectedAnswer ? 
    isCorrectAnswer(currentTopicMCQ?.options || [], topicSelectedAnswer) : false;

  // Update the submitResults function
  const submitResults = async (type: 'topic' | 'pdf') => {
    try {
      if (type === 'topic' && topicMCQs.length > 0) {
        const result = prepareTopicMCQResult(
          topic,
          topicMCQs,
          topicAnswers
        );
        
        const success = await saveMCQResult(result);
        if (success) {
          setLastScore(result.score);
          setLastTotal(result.totalQuestions);
          setShowResults(true);
          setMessage("Results submitted successfully!");
        } else {
          setMessage("Failed to submit results.");
        }
      } else if (type === 'pdf' && pdfMCQs.length > 0) {
        const result = preparePdfMCQResult(
          pdfName,
          pdfMCQs,
          pdfAnswers
        );
        
        const success = await saveMCQResult(result);
        if (success) {
          setLastScore(result.score);
          setLastTotal(result.totalQuestions);
          setShowResults(true);
          setMessage("Results submitted successfully!");
        } else {
          setMessage("Failed to submit results.");
        }
      }
    } catch (error) {
      console.error("Error submitting results:", error);
      setMessage("Error submitting results. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800 
                      bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
          Exam Preparation
        </h1>
        
        {/* Tab Selection */}
        <div className="flex bg-white rounded-t-lg shadow-md mb-px justify-center p-1 mb-6">
          <button
            className={`py-3 px-6 rounded-lg text-lg font-medium transition duration-200 ${
              activeTab === 'topic'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => switchTab('topic')}
          >
            Topic-Based MCQs
          </button>
          <button
            className={`py-3 px-6 rounded-lg text-lg font-medium transition duration-200 ${
              activeTab === 'pdf'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => switchTab('pdf')}
          >
            PDF-Based MCQs
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : message.includes('success') 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {loading && (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{message}</span>
              </div>
            )}
            {!loading && <p>{message}</p>}
          </div>
        )}

        {/* Topic Based MCQ Section */}
        {activeTab === 'topic' && (
          <div className="transition-all duration-300">
            <div className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-blue-100">
              <h2 className="text-xl font-semibold mb-4 text-indigo-700">Generate MCQ by Topic</h2>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., Data Structures, Algorithms)"
                  className="flex-grow p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={generateTopicMCQ}
                  disabled={!topic || loading}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    !topic || loading 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  Generate MCQ
                </button>
              </div>
            </div>

            {/* Topic Question Display */}
            {currentTopicMCQ && (
              <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Question header with navigation indicator */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Question {currentTopicMCQIndex + 1} of {topicMCQs.length}</h3>
                    <div className="text-sm font-medium py-1 px-3 bg-white bg-opacity-20 rounded-full">
                      Topic: {topic}
                    </div>
                  </div>
                </div>
                
                {/* Question content */}
                <div className="p-6">
                  <p className="text-lg font-semibold mb-6">{currentTopicMCQ.question}</p>
                  
                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {currentTopicMCQ.options.map((option) => (
                      <div key={option.id} className="transition-all duration-200">
                        <label className={`flex items-start p-4 border rounded-lg cursor-pointer ${
                          topicSelectedAnswer 
                            ? option.id === topicSelectedAnswer
                              ? isTopicCorrect 
                                ? 'bg-green-50 border-green-300' 
                                : 'bg-red-50 border-red-300'
                              : option.correct && topicSelectedAnswer 
                                ? 'bg-green-50 border-green-300' 
                                : 'border-gray-200 opacity-70'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}>
                          <input
                            type="radio"
                            name={`topic-question-${currentTopicMCQIndex}`}
                            value={option.id}
                            checked={topicSelectedAnswer === option.id}
                            onChange={() => handleTopicAnswerSelect(option.id)}
                            disabled={!!topicSelectedAnswer}
                            className="mt-1 mr-3"
                          />
                          <div>
                            <span className="font-medium mr-2">{option.id}.</span>
                            <span>{option.text}</span>
                            {topicSelectedAnswer && option.correct && (
                              <span className="ml-2 inline-flex items-center text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Explanation and next button */}
                  <div className={`mt-6 ${topicSelectedAnswer ? 'block' : 'hidden'}`}>
                    <button
                      onClick={toggleTopicExplanation}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4"
                    >
                      {topicShowExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                    
                    {topicShowExplanation && (
                      <div className="mt-3 p-5 bg-indigo-50 border border-indigo-100 rounded-lg mb-6">
                        <h4 className="font-semibold text-indigo-700 mb-2">Explanation:</h4>
                        <p className="text-gray-800">{currentTopicMCQ.explanation}</p>
                      </div>
                    )}

                    <button
                      onClick={nextTopicQuestion}
                      disabled={loading}
                      className={`mt-4 w-full px-4 py-3 rounded-lg font-medium ${
                        loading 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      Next Question
                    </button>

                    {topicMCQs.length > 0 && topicSelectedAnswer && (
                      <button
                        onClick={() => submitResults('topic')}
                        className="mt-4 w-full px-4 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                      >
                        Finish Quiz & Save Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PDF Based MCQ Section */}
        {activeTab === 'pdf' && (
          <div className="transition-all duration-300">
            <div className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-blue-100">
              <h2 className="text-xl font-semibold mb-4 text-indigo-700">Generate MCQs from PDF</h2>
              
              {selectedPDF ? (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-700">File uploaded successfully!</p>
                      <p className="text-sm text-gray-600">{pdfName}</p>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Remove File
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-blue-300 rounded-lg p-8 mb-4 text-center cursor-pointer hover:border-blue-500 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                  onClick={handleFileButtonClick}
                >
                  <div className="mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-blue-700 mb-1">Drag & Drop your PDF here</p>
                  <p className="text-sm text-blue-500 mb-2">or click to browse</p>
                  <p className="text-xs text-blue-400">Supports PDF files up to 10MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePDFUpload}
                    accept=".pdf"
                    className="hidden"
                    disabled={loading}
                  />
                </div>
              )}
              
              <button
                onClick={generatePDFMCQ}
                disabled={!selectedPDF || loading}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  !selectedPDF || loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? 'Processing...' : 'Generate PDF MCQs'}
              </button>
            </div>

            {/* PDF Question Display */}
            {currentPdfMCQ && (
              <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Question header with navigation indicator */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Question {currentPdfMCQIndex + 1} of {pdfMCQs.length}</h3>
                    <div className="text-sm font-medium py-1 px-3 bg-white bg-opacity-20 rounded-full">
                      PDF: {pdfName}
                    </div>
                  </div>
                </div>
                
                {/* Question content */}
                <div className="p-6">
                  <p className="text-lg font-semibold mb-6">{currentPdfMCQ.question}</p>
                  
                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {currentPdfMCQ.options.map((option) => (
                      <div key={option.id} className="transition-all duration-200">
                        <label className={`flex items-start p-4 border rounded-lg cursor-pointer ${
                          pdfSelectedAnswer 
                            ? option.id === pdfSelectedAnswer
                              ? isPdfCorrect 
                                ? 'bg-green-50 border-green-300' 
                                : 'bg-red-50 border-red-300'
                              : option.correct && pdfSelectedAnswer 
                                ? 'bg-green-50 border-green-300' 
                                : 'border-gray-200 opacity-70'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}>
                          <input
                            type="radio"
                            name={`pdf-question-${currentPdfMCQIndex}`}
                            value={option.id}
                            checked={pdfSelectedAnswer === option.id}
                            onChange={() => handlePdfAnswerSelect(option.id)}
                            disabled={!!pdfSelectedAnswer}
                            className="mt-1 mr-3"
                          />
                          <div>
                            <span className="font-medium mr-2">{option.id}.</span>
                            <span>{option.text}</span>
                            {pdfSelectedAnswer && option.correct && (
                              <span className="ml-2 inline-flex items-center text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Explanation and next button */}
                  <div className={`mt-6 ${pdfSelectedAnswer ? 'block' : 'hidden'}`}>
                    <button
                      onClick={togglePdfExplanation}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4"
                    >
                      {pdfShowExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                    
                    {pdfShowExplanation && (
                      <div className="mt-3 p-5 bg-purple-50 border border-purple-100 rounded-lg mb-6">
                        <h4 className="font-semibold text-purple-700 mb-2">Explanation:</h4>
                        <p className="text-gray-800">{currentPdfMCQ.explanation}</p>
                      </div>
                    )}

                    {hasMorePdfQuestions && (
                      <button
                        onClick={nextPdfQuestion}
                        className="mt-4 w-full px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                      >
                        Next Question
                      </button>
                    )}

                    {pdfMCQs.length > 0 && currentPdfMCQIndex >= pdfMCQs.length - 1 && pdfSelectedAnswer && (
                      <button
                        onClick={() => submitResults('pdf')}
                        className="mt-4 w-full px-4 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                      >
                        Finish Quiz & Save Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Modal */}
        {showResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4 text-indigo-700">Quiz Results</h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2">
                  {lastScore}/{lastTotal}
                </div>
                <div className="text-lg text-gray-600">
                  {Math.round((lastScore / lastTotal) * 100)}% Correct
                </div>
              </div>
              <div className="mb-6">
                <div className="h-4 bg-gray-200 rounded-full">
                  <div 
                    className="h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                    style={{ width: `${Math.round((lastScore / lastTotal) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="w-full px-4 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPreparation; 