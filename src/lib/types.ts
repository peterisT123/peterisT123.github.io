import type { z } from "zod";
import type { BuildingSchema, ContactSchema } from "./schema";

export type ObjectType = 'Dzīvoklis' | 'Māja' | 'Ēka';
export type BuildYearRange = 'Pirms 1971' | 'No 1972 - 1999' | 'Pēc 2000';
export type LegalStatus = 'Fiziska persona' | 'Juridiska persona';

export type Building = z.infer<typeof BuildingSchema>;
export type Contact = z.infer<typeof ContactSchema>;

export interface AppState {
    step: number;
    legalStatus: LegalStatus;
    buildings: Building[];
    contact: Contact;
    submitted: boolean;
}

export interface AppContextType {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    setStep: (step: number) => void;
    handleNext: () => void;
    handleBack: () => void;
    addBuilding: () => void;
    updateBuilding: (index: number, data: Partial<Building>) => void;
    removeBuilding: (index: number) => void;
    setSubmitted: (submitted: boolean) => void;
}
