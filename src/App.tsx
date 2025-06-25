import React from 'react';
import './index.css'; // Import base styles and font
import './App.css'; // Import our custom CSS
import Quiz from './Quiz.tsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-fraunces flex flex-col items-center justify-center">
      <Quiz />
    </div>
  );
}

export default App;
