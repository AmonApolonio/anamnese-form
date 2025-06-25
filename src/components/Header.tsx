import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow mb-6">
      <div className="container mx-auto flex items-center py-4 px-6">
        <FontAwesomeIcon icon={faClipboardList} className="text-[#947B62] text-xl mr-2" />
        <h1 className="text-2xl font-bold font-fraunces text-[#947B62]">POC - Anamnese</h1>
      </div>
    </header>
  );
};

export default Header;
