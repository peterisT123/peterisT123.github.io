'use client';

import { AppState, Building } from '@/lib/types';
import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialState: AppState = {
  step: 1,
  product: null,
  legalStatus: 'Fiziska persona',
  travel: {
    travelTime: { from: undefined, to: undefined },
    multipleTrips: false,
    travelers: {
      upTo64: 1,
      from65to74: 0,
      from75: 0,
    },
    activities: 'atpūta',
  },
  buildings: [],
  contact: {
    name: '',
    email: '',
    phone: '',
    company: '',
    consent: false,
  },
  submitted: false,
};

type AppContextProps = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  isNextStepDisabled: boolean;
  setNextStepDisabled: (isDisabled: boolean) => void;
  handleNext: () => void;
  handleBack: () => void;
  setSubmitted: (submitted: boolean) => void;
  handleReset: () => void;
  formId: string | null;
  setFormId: (id: string | null) => void;
  addBuilding: () => void;
  updateBuilding: (index: number, updatedBuilding: Building) => void;
  removeBuilding: (index: number) => void;
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);
  const [isNextStepDisabled, setNextStepDisabled] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);

  const handleNext = () => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const setSubmitted = (submitted: boolean) => {
    setState((prev) => ({ ...prev, submitted }));
  };

  const handleReset = () => {
    setState(initialState);
  };

  const addBuilding = () => {
    const newBuilding: Building = {
      id: uuidv4(),
      objectType: 'Ēka',
      ownerName: '',
      constructionMaterial: '',
      lastRenovationYear: undefined,
      finishingLevel: '',
      commissioningYear: 'Pēc 2000',
      propertyArea: undefined,
      currentFloor: undefined,
      totalFloors: undefined,
      isConstantlyInhabited: true,
      lossesInLast3Years: false,
      isRented: false,
      hasSecurityAlarm: false,
      isCommercial: false,
      commercialActivityType: '',
      hasSolarPanels: false,
      solarPanelsCount: undefined,
      solarPanelsValue: undefined,
      solarPanelsLocation: 'Uz jumta pamatēkai',
      movablePropertyIncluded: false,
      totalMovablePropertyValue: undefined,
      valuableMovablePropertyIncluded: false,
      civilLiabilityInsuranceIncluded: false,
      civilLiabilityCoverage: 'Tikai dzīvoklī',
      civilLiabilityValue: '5000',
    };
    setState(prevState => ({ ...prevState, buildings: [...prevState.buildings, newBuilding] }));
  };

  const updateBuilding = (index: number, updatedBuilding: Building) => {
    setState(prevState => {
        const newBuildings = [...prevState.buildings];
        newBuildings[index] = updatedBuilding;
        return { ...prevState, buildings: newBuildings };
    });
  };

  const removeBuilding = (index: number) => {
    setState(prevState => ({
        ...prevState,
        buildings: prevState.buildings.filter((_, i) => i !== index),
    }));
  };


  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        isNextStepDisabled,
        setNextStepDisabled,
        handleNext,
        handleBack,
        setSubmitted,
        handleReset,
        formId,
        setFormId,
        addBuilding,
        updateBuilding,
        removeBuilding
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
