'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import type { AppState, AppContextType, Building, Product, Travel } from '@/lib/types';

const defaultBuilding: Building = {
  id: 'building-0',
  objectType: 'Ēka',
  ownerName: '',
  propertyArea: undefined,
  commissioningYear: 'Pēc 2000',
  constructionMaterial: 'Mūris',
  lastRenovationYear: undefined,
  finishingLevel: 'Kvalitatīvs',
  isConstantlyInhabited: true,
  isRented: false,
  hasSecurityAlarm: false,
  lossesInLast3Years: false,
  movablePropertyIncluded: false,
  valuableMovablePropertyIncluded: false,
  hasSolarPanels: false,
  solarPanelsCount: undefined,
  solarPanelsValue: undefined,
  solarPanelsLocation: 'Uz jumta pamatēkai',
  totalFloors: undefined,
  currentFloor: undefined,
  isCommercial: false,
  commercialActivityType: undefined,
  civilLiabilityInsuranceIncluded: false,
  civilLiabilityCoverage: 'Tikai dzīvoklī',
};

const defaultTravel: Travel = {
    travelers: {
        upTo64: 1,
        from65to74: 0,
        from75: 0,
    },
    travelTime: {
        from: new Date(),
        to: new Date(),
    },
    multipleTrips: false,
    activities: 'Bez paaugstināta riska aktivitātēm',
};

const initialState: AppState = {
  step: 1,
  product: null,
  legalStatus: 'Fiziska persona',
  buildings: [defaultBuilding],
  travel: defaultTravel,
  contact: {
    name: '',
    email: '',
    phone: '',
    consent: false,
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

  const setProduct = useCallback((product: Product) => {
    setState((prev) => ({ ...prev, product, step: 1 }));
  }, []);

  const handleNext = useCallback(() => {
    setState((prev) => {
      const maxSteps = prev.product === 'Īpašums' ? 4 : 3;
      return prev.step < maxSteps ? { ...prev, step: prev.step + 1 } : prev;
    });
  }, []);

  const handleBack = useCallback(() => {
    setState((prev) => {
        if (prev.step > 1) {
            return { ...prev, step: prev.step - 1 };
        } else {
            // If on the first step, reset the product to go back to product selection
            return { ...prev, product: null };
        }
    });
}, []);
  
  const handleReset = useCallback(() => {
    setState(initialState);
    nextBuildingId.current = 1;
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

  const updateTravel = useCallback((data: Partial<Travel>) => {
    setState((prev) => ({
        ...prev,
        travel: { ...prev.travel, ...data },
    }));
}, []);
  
  const setSubmitted = useCallback((submitted: boolean) => {
    setState((prev) => ({ ...prev, submitted }));
  }, []);


  const value = {
    state,
    setState,
    setStep,
    setProduct,
    handleNext,
    handleBack,
    addBuilding,
    updateBuilding,
    removeBuilding,
    updateTravel,
    setSubmitted,
    handleReset,
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
