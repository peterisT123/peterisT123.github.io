'use client';
import { z } from 'zod';
import { CommissioningYearRange, ConstructionMaterial, FinishingLevel, ObjectType, SolarPanelsLocation } from './types';

export const policyTypes = ['Standarta', 'Ziemas sportu', 'Ekstrēmo sprotu', 'Studentu', 'Senioru'] as const;

export const TravelerSchema = z.object({
  id: z.string(),
  firstName: z
    .string()
    .min(2, { message: 'Vārdam jābūt vismaz 2 rakstzīmes garam' })
    .max(120, { message: 'Vārds nedrīkst būt garāks par 120 rakstzīmēm' }),
  lastName: z
    .string()
    .min(2, { message: 'Uzvārdam jābūt vismaz 2 rakstzīmes garam' })
    .max(120, { message: 'Uzvārds nedrīkst būt garāks par 120 rakstzīmēm' }),
  birthDate: z.date({ required_error: 'Dzimšanas datums ir obligāts lauks' }),
  policyType: z.enum(policyTypes, { required_error: 'Lūdzu, izvēlieties polises tipu' }),
  winterSports: z.enum(['jā', 'nē']).optional(),
  diving: z.enum(['jā', 'nē']).optional(),
  otherSports: z.enum(['jā', 'nē']).optional(),
  competitions: z.enum(['jā', 'nē']).optional(),
  extremeSports: z.enum(['jā', 'nē']).optional(),
  physicalWork: z.enum(['jā', 'nē']).optional(),
});

export const TravelSchema = z.object({
  travelers: z.array(TravelerSchema),
  travelDateFrom: z.date().optional(),
  travelDateTo: z.date().optional(),
});

export const BuildingSchema = z.object({
    id: z.string(),
    objectType: z.custom<ObjectType>(),
    ownerName: z.string(),
    constructionMaterial: z.custom<ConstructionMaterial>(),
    lastRenovationYear: z.number().optional(),
    finishingLevel: z.custom<FinishingLevel>(),
    commissioningYear: z.custom<CommissioningYearRange>(),
    propertyArea: z.number().optional(),
    currentFloor: z.number().optional(),
    totalFloors: z.number().optional(),
    isConstantlyInhabited: z.boolean(),
    lossesInLast3Years: z.boolean(),
    isRented: z.boolean(),
    hasSecurityAlarm: z.boolean(),
    isCommercial: z.boolean(),
    commercialActivityType: z.string().optional(),
    hasSolarPanels: z.boolean(),
    solarPanelsCount: z.number().optional(),
    solarPanelsValue: z.number().optional(),
    solarPanelsLocation: z.custom<SolarPanelsLocation>(),
    movablePropertyIncluded: z.boolean(),
    totalMovablePropertyValue: z.number().optional(),
    valuableMovablePropertyIncluded: z.boolean(),
    civilLiabilityInsuranceIncluded: z.boolean(),
    civilLiabilityCoverage: z.string().optional(),
    civilLiabilityValue: z.string().optional(),
  });

  export const ContactSchema = z.object({
    name: z.string().min(2, { message: 'Vārdam jābūt vismaz 2 rakstzīmes garam' }),
    email: z.string().email({ message: 'Ievadiet derīgu e-pasta adresi' }),
    phone: z.string().min(8, { message: 'Telefona numuram jābūt vismaz 8 ciparus garam' }),
    consent: z.boolean().refine(val => val === true, { message: 'Lai turpinātu, ir jāpiekrīt noteikumiem' }),
  });

export const AppSchema = z.object({
  step: z.number(),
  product: z.string().nullable(),
  buildings: z.array(BuildingSchema),
  travel: TravelSchema,
  contact: ContactSchema,
  submitted: z.boolean(),
});
