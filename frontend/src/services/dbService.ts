import axios from 'axios';

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

interface MCQResult {
  guestId?: string;
  type: 'topic' | 'pdf';
  topic?: string;
  pdfName?: string;
  questions: {
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
  score: number;
  totalQuestions: number;
  createdAt: Date;
}

// Set base URL for API requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to save MCQ results to MongoDB
export const saveMCQResult = async (result: MCQResult): Promise<boolean> => {
  try {
    console.log('Saving MCQ result:', result);
    // Generate a guest ID if not provided
    if (!result.guestId) {
      result.guestId = `guest_${new Date().getTime()}`;
    }
    
    const response = await api.post('/mcq-results', result);
    console.log('API response:', response.data);
    return response.status === 201;
  } catch (error) {
    console.error('Error saving MCQ results to database:', error);
    return false;
  }
};

// Function to prepare result object from topic MCQ
export const prepareTopicMCQResult = (
  topic: string,
  mcqs: MCQ[],
  userAnswers: { [key: number]: string }
): MCQResult => {
  // Map the questions with correct and user answers
  const questions = mcqs.map((mcq, index) => {
    const correctOption = mcq.options.find(opt => opt.correct);
    const correctAnswer = correctOption?.id || '';
    const userAnswer = userAnswers[index] || '';
    
    return {
      question: mcq.question,
      correctAnswer,
      userAnswer,
      isCorrect: correctAnswer === userAnswer
    };
  });

  // Calculate score
  const score = questions.filter(q => q.isCorrect).length;

  return {
    guestId: `guest_${new Date().getTime()}`,
    type: 'topic',
    topic,
    questions,
    score,
    totalQuestions: mcqs.length,
    createdAt: new Date()
  };
};

// Function to prepare result object from PDF MCQ
export const preparePdfMCQResult = (
  pdfName: string,
  mcqs: MCQ[],
  userAnswers: { [key: number]: string }
): MCQResult => {
  // Map the questions with correct and user answers
  const questions = mcqs.map((mcq, index) => {
    const correctOption = mcq.options.find(opt => opt.correct);
    const correctAnswer = correctOption?.id || '';
    const userAnswer = userAnswers[index] || '';
    
    return {
      question: mcq.question,
      correctAnswer,
      userAnswer,
      isCorrect: correctAnswer === userAnswer
    };
  });

  // Calculate score
  const score = questions.filter(q => q.isCorrect).length;

  return {
    guestId: `guest_${new Date().getTime()}`,
    type: 'pdf',
    pdfName,
    questions,
    score,
    totalQuestions: mcqs.length,
    createdAt: new Date()
  };
};

// Function to get MCQ history
export const getMCQHistory = async (): Promise<MCQResult[]> => {
  try {
    const response = await api.get('/mcq-results');
    return response.data;
  } catch (error) {
    console.error('Error fetching MCQ history:', error);
    return [];
  }
}; 