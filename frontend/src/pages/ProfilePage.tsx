import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMCQStats, getMCQHistory } from '../services/mcqService';
import { Button } from '../components/ui/button';

interface MCQStats {
  total: number;
  correct: number;
  accuracy: number;
  byTopic: Record<string, { total: number; correct: number; accuracy: number }>;
}

interface MCQResult {
  question: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  questionType: 'topic' | 'pdf';
  topic: string;
  timestamp: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState<MCQStats | null>(null);
  const [history, setHistory] = useState<MCQResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsData, historyData] = await Promise.all([
          getMCQStats(),
          getMCQHistory()
        ]);
        
        setStats(statsData);
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}!
            </p>
          </div>
          <Button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Overview */}
            <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Total Questions</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats?.total || 0}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Correct Answers</h3>
                  <p className="text-3xl font-bold text-green-600">{stats?.correct || 0}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Accuracy</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats?.accuracy ? `${Math.round(stats.accuracy)}%` : '0%'}
                  </p>
                </div>
              </div>
            </div>

            {/* Topic Performance */}
            <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance by Topic</h2>
              {stats && stats.byTopic && Object.keys(stats.byTopic).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(stats.byTopic).map(([topic, topicStats]) => (
                    <div key={topic} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-700">{topic}</h3>
                        <span className="text-sm font-medium text-gray-500">
                          {topicStats.correct} / {topicStats.total} questions
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${topicStats.accuracy}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-sm mt-1 text-gray-600">
                        {Math.round(topicStats.accuracy)}% accuracy
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No topic data available yet. Start answering questions to see your performance!
                </p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              {history && history.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {history.slice(0, 10).map((result, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      result.isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
                    }`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">{result.topic}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {result.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-1">{result.question}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No recent activity. Start answering questions to see your history!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button 
            onClick={() => navigate('/exam-preparation')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Practice More MCQs
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
} 