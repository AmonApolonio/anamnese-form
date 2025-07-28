import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ColoracaoState, ColoracaoFormState, StepFormState } from '../types/coloracao';

interface ColoracaoContextType {
  state: ColoracaoState;
  formState: ColoracaoFormState;
  updateResult: (key: keyof ColoracaoState, result: any) => void;
  updateFormState: (key: keyof ColoracaoFormState, formState: StepFormState) => void;
  clearResult: (key: keyof ColoracaoState) => void;
  clearAll: () => void;
}

const ColoracaoContext = createContext<ColoracaoContextType | undefined>(undefined);

export const useColoracao = () => {
  const context = useContext(ColoracaoContext);
  if (!context) {
    throw new Error('useColoracao must be used within a ColoracaoProvider');
  }
  return context;
};

interface ColoracaoProviderProps {
  children: ReactNode;
}

export const ColoracaoProvider: React.FC<ColoracaoProviderProps> = ({ children }) => {
  const [state, setState] = useState<ColoracaoState>({});
  const [formState, setFormState] = useState<ColoracaoFormState>({});

  const updateResult = useCallback((key: keyof ColoracaoState, result: any) => {
    setState(prev => ({
      ...prev,
      [key]: result
    }));
  }, []);

  const updateFormState = useCallback((key: keyof ColoracaoFormState, stepFormState: StepFormState) => {
    setFormState(prev => ({
      ...prev,
      [key]: stepFormState
    }));
  }, []);

  const clearResult = useCallback((key: keyof ColoracaoState) => {
    setState(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    // Also clear the form state for this step
    setFormState(prev => {
      const newFormState = { ...prev };
      delete newFormState[key as keyof ColoracaoFormState];
      return newFormState;
    });
  }, []);

  const clearAll = useCallback(() => {
    setState({});
    setFormState({});
  }, []);

  return (
    <ColoracaoContext.Provider value={{ state, formState, updateResult, updateFormState, clearResult, clearAll }}>
      {children}
    </ColoracaoContext.Provider>
  );
};
