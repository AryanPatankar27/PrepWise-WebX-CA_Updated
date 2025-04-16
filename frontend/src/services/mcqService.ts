import { getToken } from './authService';

interface MCQResult {
  question: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  questionType: 'topic' | 'pdf';
  topic: string;
}

export const saveMCQResult = async (result: MCQResult): Promise<void> => {
  // In guest mode, we don't need tokens for authentication
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'}/api/mcq/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save MCQ result');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving MCQ result:', error);
    throw error;
  }
};

export const getMCQHistory = async (): Promise<any[]> => {
  // In guest mode, we don't need tokens for authentication
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'}/api/mcq/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch MCQ history');
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching MCQ history:', error);
    return [];
  }
};

export const getMCQStats = async (): Promise<any> => {
  // In guest mode, we don't need tokens for authentication
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'}/api/mcq/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch MCQ stats');
    }
    
    const data = await response.json();
    return data.stats || {
      total: 0,
      correct: 0,
      accuracy: 0,
      byTopic: {}
    };
  } catch (error) {
    console.error('Error fetching MCQ stats:', error);
    return {
      total: 0,
      correct: 0,
      accuracy: 0,
      byTopic: {}
    };
  }
}; 