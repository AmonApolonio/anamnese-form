import React from 'react';
import './index.css'; // Import base styles and font
import './App.css'; // Import our custom CSS
import Quiz from './Quiz.tsx';
import RemoveBg from './components/RemoveBg';
import Welcome from './components/Welcome';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-fraunces flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<WelcomePageWrapper />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/remove-bg" element={<RemoveBg />} />
        </Routes>
      </div>
    </Router>
  );
}

// Wrapper to handle navigation from Welcome
const WelcomePageWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Welcome
        onStart={() => navigate('/quiz')}
        onSkipToPhotoUpload={() => navigate('/quiz?photoUploadFirst=true')}
      />
    </>
  );
};

export default App;
