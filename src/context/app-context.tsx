'use client';

import React, { createContext, useContext, useState } from 'react';
import type { AppState, AppContextType, Building } from '@/lib/types';

const defaultBuilding: Building = {
  id: 'building-0',
  objectType: 'Dzīvoklis',
  ownerName: '',
  propertyArea: undefined,
  buildYear: '',
  isConstantlyInhabited: true,
  lossesInLast3Years: false,
  movablePropertyIncluded: false,
  valuableMovablePropertyIncluded: false,
  totalFloors: undefined,
  currentFloor: undefined,
};

const initialState: AppState = {
  step: 1,
  legalStatus: 'Fiziska persona',
  buildings: [defaultBuilding],
  contact: {
    name: '',
    email: '',
    phone: '',
  },
  submitted: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setStep = (step: number) => {
    setState((prev) => ({ ...prev, step }));
  };

  const handleNext = () => {
    if (state.step < 4) {
      setStep(state.step + 1);
    }
  };

  const handleBack = () => {
    if (state.step > 1) {
      setStep(state.step - 1);
    }
  };

  const addBuilding = () => {
    setState((prev) => ({
      ...prev,
      buildings: [
        ...prev.buildings,
        { ...defaultBuilding, id: `building-${Date.now()}` },
      ],
    }));
  };

  const updateBuilding = (index: number, data: Partial<Building>) => {
    setState((prev) => {
      const newBuildings = [...prev.buildings];
      newBuildings[index] = { ...newBuildings[index], ...data };
      return { ...prev, buildings: newBuildings };
    });
  };

  const removeBuilding = (index: number) => {
    setState((prev) => ({
      ...prev,
      buildings: prev.buildings.filter((_, i) => i !== index),
    }));
  };
  
  const setSubmitted = (submitted: boolean) => {
    setState((prev) => ({ ...prev, submitted }));
  };


  const value = {
    state,
    setState,
    setStep,
    handleNext,
    handleBack,
    addBuilding,
    updateBuilding,
    removeBuilding,
    setSubmitted,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
