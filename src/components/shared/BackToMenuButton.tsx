import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackToMenuButtonProps {
  className?: string;
}

const BackToMenuButton: React.FC<BackToMenuButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/')}
      className={`mb-6 self-start pl-3 pr-5 py-2 rounded-lg border-2 border-[#947B62] text-[#947B62] font-semibold bg-white hover:bg-[#f5f0ea] transition-colors flex items-center gap-2 shadow ${className}`}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#947B62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
      Voltar ao Menu
    </button>
  );
};

export default BackToMenuButton;
