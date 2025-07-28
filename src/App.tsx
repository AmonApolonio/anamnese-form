import React from 'react';
import './index.css'; // Import base styles and font
import './App.css'; // Import our custom CSS
import Quiz from './Quiz.tsx';
import Welcome from './components/Welcome';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import RemoveBg from './components/removeBg/RemoveBg.tsx';
import Coloracao from './components/coloracao/Coloracao.tsx';
import ColoracaoStep from './components/coloracao/ColoracaoStep.tsx';
import ColoracaoResults from './components/coloracao/ColoracaoResults.tsx';
import { ColoracaoProvider } from './contexts/ColoracaoContext.tsx';

function App() {
  return (
    <Router>
      <ColoracaoProvider>
        <div className="min-h-screen bg-gray-50 font-fraunces flex flex-col items-center justify-center">
          <Routes>
            <Route path="/" element={<WelcomePageWrapper />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/remove-bg" element={<RemoveBg />} />
            <Route path="/coloracao" element={<Coloracao />} />
            <Route path="/coloracao/:stepIndex" element={<ColoracaoStepWrapper />} />
            <Route path="/coloracao/resultados" element={<ColoracaoResults />} />
          </Routes>
        </div>
      </ColoracaoProvider>
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

// Wrapper to force component remounting when step changes
const ColoracaoStepWrapper: React.FC = () => {
  const { stepIndex } = useParams<{ stepIndex: string }>();
  return <ColoracaoStep key={stepIndex} />;
};

export default App;
