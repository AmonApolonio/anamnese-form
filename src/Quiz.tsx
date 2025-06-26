import React, { useState } from 'react';
import Header from './components/Header.tsx';
import ProgressBar from './components/ProgressBar.tsx';
import QuestionCard from './components/QuestionCard.tsx';
import NavigationButtons from './components/NavigationButtons.tsx';
import Welcome from './components/Welcome.tsx';
import Results from './components/Results.tsx';
import PhotoUpload from './components/PhotoUpload.tsx';
import questions from './questions';
import { UserAnswer, styleTypes } from './types';

const PHOTO_UPLOAD_ID = 'photo-upload';

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [styles, setStyles] = useState(styleTypes);
  const [uploadedPhotos, setUploadedPhotos] = useState<{ file: File; result: string }[]>([]);
  const [photoUploadFirst, setPhotoUploadFirst] = useState<boolean>(false);

  // Build the questions array with PhotoUpload as first or last
  const filteredQuestions = (() => {
    // Filter questions based on previous answers
    const filtered = questions.filter(question => {
      if (!question.condition) return true;
      const conditionAnswer = userAnswers.find(
        answer => answer.questionId === question.condition?.questionId
      );
      return conditionAnswer && conditionAnswer.optionId === question.condition.optionId;
    });
    // Insert PhotoUpload as first or last
    if (photoUploadFirst) {
      return [
        { id: PHOTO_UPLOAD_ID, type: 'photo-upload' },
        ...filtered
      ];
    } else {
      return [
        ...filtered,
        { id: PHOTO_UPLOAD_ID, type: 'photo-upload' }
      ];
    }
  })();

  // Get the current question to display
  const currentQuestion = currentQuestionIndex >= 0 && currentQuestionIndex < filteredQuestions.length
    ? filteredQuestions[currentQuestionIndex]
    : null;

  // Find the current answer for this question (if any)
  const currentAnswer = userAnswers.find(
    answer => currentQuestion && answer.questionId === currentQuestion.id
  )?.optionId;

  // Handle starting the quiz (questions first)
  const handleStart = () => {
    setPhotoUploadFirst(false);
    setCurrentQuestionIndex(0);
  };

  // Handle skipping directly to photo upload (photos first)
  const handleSkipToPhotoUpload = () => {
    setPhotoUploadFirst(true);
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
      // Show results at the end
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
    setUploadedPhotos([]);
    setPhotoUploadFirst(false);
    setStyles(styleTypes.map(style => ({ ...style, score: 0 })));
  };

  // Handle photo upload completion (acts as answering the photo-upload question)
  const handlePhotoUploadComplete = (photos: { file: File; result: string }[]) => {
    setUploadedPhotos(photos);
    // Mark as answered for navigation (no 'value' property)
    handleAnswer({ questionId: PHOTO_UPLOAD_ID, optionId: 'uploaded' });
  };

  // Calculate the results based on user answers and photo results
  const calculateResults = () => {
    const updatedStyles = [...styles];
    userAnswers.forEach(answer => {
      // Skip the gender and photo-upload questions
      if (answer.questionId === 'gender' || answer.questionId === PHOTO_UPLOAD_ID) return;
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
    // Add photo-upload results
    uploadedPhotos.forEach(photo => {
      const styleIndex = updatedStyles.findIndex(style => style.name === photo.result);
      if (styleIndex !== -1) {
        updatedStyles[styleIndex] = {
          ...updatedStyles[styleIndex],
          score: updatedStyles[styleIndex].score + 1
        };
      }
    });
    setStyles(updatedStyles);
  };

  // Determine if the current question has been answered
  const isCurrentQuestionAnswered = currentQuestion?.id === PHOTO_UPLOAD_ID
    ? !!uploadedPhotos.length
    : !!currentAnswer;

  // Render welcome screen, quiz, or results based on state
  if (currentQuestionIndex === -1) {
    return (
      <div className="min-h-screen bg-white py-8">
        <Header />
        <Welcome onStart={handleStart} onSkipToPhotoUpload={handleSkipToPhotoUpload} />
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-white py-8">
        <Header />
        <Results styles={styles} onRestart={handleRestart} photoResults={uploadedPhotos} />
      </div>
    );
  }

  // Render the quiz flow, treating PhotoUpload as a question
  return (
    <div className="min-h-screen bg-white py-8">
      <Header />
      <ProgressBar
        currentStep={currentQuestionIndex + 1}
      />
      {currentQuestion && currentQuestion.id === PHOTO_UPLOAD_ID ? (
        <>
          <PhotoUpload
            onComplete={handlePhotoUploadComplete}
            onSkip={handleNext}
            initialFiles={uploadedPhotos}
          />
          {uploadedPhotos.length > 0 && (
            <NavigationButtons
              onNext={handleNext}
              onPrev={handlePrev}
              isFirstQuestion={currentQuestionIndex === 0}
              isLastQuestion={currentQuestionIndex === filteredQuestions.length - 1}
              isCurrentQuestionAnswered={true}
            />
          )}
        </>
      ) : currentQuestion && 'text' in currentQuestion && 'options' in currentQuestion ? (
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
      ) : null}
    </div>
  );
};

export default Quiz;
