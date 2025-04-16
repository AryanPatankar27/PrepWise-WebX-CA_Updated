import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import RoadmapPage from './pages/RoadmapPage';
import AuthPages from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import InterviewPrep from './pages/InterviewPrep';
import ResumeBuilder from './pages/ResumeBuilder';
import ExamPreparation from './components/ExamPreparation';
// import MockInterview from './pages/MockInterview';
// import NotesAnalysis from './pages/NotesAnalysis';
import ProfilePage from './pages/ProfilePage';
// import { AuthProvider } from './context/AuthContext';
//import MockInterviewPrep from './pages/MockInterviewpPrep';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
          />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/exam-prep" element={<ExamPreparation />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/resume" element={<ResumeBuilder />} />
        {/* <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/notes-analysis" element={<NotesAnalysis />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
