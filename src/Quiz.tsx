import React, { useState } from 'react';
import Header from './components/Header.tsx';
import ProgressBar from './components/ProgressBar.tsx';
import QuestionCard from './components/QuestionCard.tsx';
import NavigationButtons from './components/NavigationButtons.tsx';
import Welcome from './components/Welcome.tsx';
import Results from './components/Results.tsx';
import questions from './questions';
import { UserAnswer, styleTypes } from './types';

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [styles, setStyles] = useState(styleTypes);

  // Filter questions based on previous answers
  const filteredQuestions = questions.filter(question => {
    if (!question.condition) return true;

    const conditionAnswer = userAnswers.find(
      answer => answer.questionId === question.condition?.questionId
    );

    return conditionAnswer && conditionAnswer.optionId === question.condition.optionId;
  });

  // Get the current question to display
  const currentQuestion = currentQuestionIndex >= 0 && currentQuestionIndex < filteredQuestions.length
    ? filteredQuestions[currentQuestionIndex]
    : null;

  // Find the current answer for this question (if any)
  const currentAnswer = userAnswers.find(
    answer => currentQuestion && answer.questionId === currentQuestion.id
  )?.optionId;

  // Handle starting the quiz
  const handleStart = () => {
    setCurrentQuestionIndex(0);
  };

  // Handle user answering a question
  const handleAnswer = (answer: UserAnswer) => {
    setUserAnswers(prev => {
      // Remove any existing answer for this question
      const filtered = prev.filter(a => a.questionId !== answer.questionId);
      // Add the new answer
      return [...filtered, answer];
    });
  };

  // Handle moving to the next question
  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
      setShowResults(true);
    }
  };

  // Handle moving to the previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle restarting the quiz
  const handleRestart = () => {
    setUserAnswers([]);
    setCurrentQuestionIndex(-1);
    setShowResults(false);
    setStyles(styleTypes.map(style => ({ ...style, score: 0 })));
  };

  // Calculate the results based on user answers
  const calculateResults = () => {
    const updatedStyles = [...styles];

    userAnswers.forEach(answer => {
      // Skip the gender question
      if (answer.questionId === "gender") return;

      // Find the style that corresponds to this answer
      const styleIndex = updatedStyles.findIndex(style => style.id === answer.optionId);
      
      if (styleIndex !== -1) {
        // Increment the score for this style
        updatedStyles[styleIndex] = {
          ...updatedStyles[styleIndex],
          score: updatedStyles[styleIndex].score + 1
        };
      }
    });

    setStyles(updatedStyles);
  };

  // Determine if the current question has been answered
  const isCurrentQuestionAnswered = !!currentAnswer;

  // Render welcome screen, quiz, or results based on state
  if (currentQuestionIndex === -1) {
    return (
      <div className="min-h-screen bg-white py-8">
        <Header />
        <Welcome onStart={handleStart} />
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-white py-8">
        <Header />
        <Results styles={styles} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <Header />
      {currentQuestion && currentQuestion.id !== "gender" && (
        <ProgressBar 
          currentStep={currentQuestionIndex + 1} 
          totalSteps={filteredQuestions.length} 
        />
      )}
      
      {currentQuestion && (
        <>
          <QuestionCard 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
            currentAnswer={currentAnswer}
          />
          
          <NavigationButtons 
            onNext={handleNext}
            onPrev={handlePrev}
            isFirstQuestion={currentQuestionIndex === 0}
            isLastQuestion={currentQuestionIndex === filteredQuestions.length - 1}
            isCurrentQuestionAnswered={isCurrentQuestionAnswered}
          />
        </>
      )}
    </div>
  );
};

export default Quiz;
