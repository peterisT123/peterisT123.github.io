'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import type { AppState, AppContextType, Building } from '@/lib/types';

const defaultBuilding: Building = {
  id: 'building-0',
  objectType: 'Ēka',
  ownerName: '',
  propertyArea: 0,
  commissioningYear: 'Pēc 2000',
  constructionMaterial: 'Mūris',
  lastRenovationYear: 0,
  finishingLevel: 'Kvalitatīvs',
  isConstantlyInhabited: true,
  isRented: false,
  hasSecurityAlarm: false,
  lossesInLast3Years: false,
  movablePropertyIncluded: false,
  valuableMovablePropertyIncluded: false,
  hasSolarPanels: false,
  solarPanelsCount: 0,
  solarPanelsValue: 0,
  solarPanelsLocation: undefined,
  totalFloors: 0,
  currentFloor: 0,
  isCommercial: false,
  commercialActivityType: undefined,
  civilLiabilityInsuranceIncluded: false,
  civilLiabilityCoverage: undefined,
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
  const nextBuildingId = useRef(1);

  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const handleNext = useCallback(() => {
    setState((prev) => (prev.step < 4 ? { ...prev, step: prev.step + 1 } : prev));
  }, []);

  const handleBack = useCallback(() => {
    setState((prev) => (prev.step > 1 ? { ...prev, step: prev.step - 1 } : prev));
  }, []);

  const addBuilding = useCallback(() => {
    setState((prev) => ({
      ...prev,
      buildings: [
        ...prev.buildings,
        { ...defaultBuilding, id: `building-${nextBuildingId.current++}` },
      ],
    }));
  }, []);

  const updateBuilding = useCallback((index: number, data: Partial<Building>) => {
    setState((prev) => {
      const newBuildings = [...prev.buildings];
      newBuildings[index] = { ...newBuildings[index], ...data };
      return { ...prev, buildings: newBuildings };
    });
  }, []);

  const removeBuilding = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      buildings: prev.buildings.filter((_, i) => i !== index),
    }));
  }, []);
  
  const setSubmitted = useCallback((submitted: boolean) => {
    setState((prev) => ({ ...prev, submitted }));
  }, []);


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
