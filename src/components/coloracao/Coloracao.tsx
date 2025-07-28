import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Coloracao: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the first step
    navigate('/coloracao/0');
  }, [navigate]);

  return null;
};

export default Coloracao;
