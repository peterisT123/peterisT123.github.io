import { z } from 'zod';

const requiredError = { required_error: 'Šis lauks ir obligāts.' };
const invalidTypeError = { invalid_type_error: 'Ievadīta nekorekta vērtība.' };

export const BuildingSchema = z.object({
    id: z.string(),
    objectType: z.enum(['Ēka', 'Dzīvoklis', 'Palīgēka'], requiredError),
    ownerName: z.string(requiredError).min(2, 'Vārdam jābūt vismaz 2 burtus garam.').max(120, 'Vārds nevar būt garāks par 120 burtiem.'),
    propertyArea: z.number({ ...requiredError, ...invalidTypeError }).positive('Platībai jābūt lielākai par 0.'),
    commissioningYear: z.enum(['Pirms 1971', 'No 1972 - 1999', 'Pēc 2000', 'Nav nodots'], requiredError),
    constructionMaterial: z.enum(['Mūris', 'Koks', 'Jaukta tipa'], requiredError),
    lastRenovationYear: z.number(invalidTypeError).positive('Remonta gadam jābūt pozitīvam skaitlim.').optional(),
    finishingLevel: z.enum(['Vienkāršs', 'Kvalitatīvs', 'Ekskluzīvs'], requiredError),
    isConstantlyInhabited: z.boolean(),
    isRented: z.boolean(),
    hasSecurityAlarm: z.boolean(),
    lossesInLast3Years: z.boolean(),
    movablePropertyIncluded: z.boolean(),
    valuableMovablePropertyIncluded: z.boolean(),
    hasSolarPanels: z.boolean(),
    solarPanelsCount: z.number(invalidTypeError).positive('Paneļu skaitam jābūt pozitīvam skaitlim.').optional(),
    solarPanelsValue: z.number(invalidTypeError).positive('Vērtībai jābūt pozitīvam skaitlim.').optional(),
    solarPanelsLocation: z.enum(['Uz jumta pamatēkai', 'Uz palīgēkas', 'Uz zemes']).optional(),
    totalFloors: z.number(invalidTypeError).positive('Stāvu skaitam jābūt pozitīvam skaitlim.').optional(),
    currentFloor: z.number(invalidTypeError).positive('Stāvam jābūt pozitīvam skaitlim.').optional(),
    isCommercial: z.boolean(),
    commercialActivityType: z.string().max(200, 'Apraksts nevar būt garāks par 200 simboliem.').optional(),
    civilLiabilityInsuranceIncluded: z.boolean(),
    civilLiabilityCoverage: z.enum(['Tikai dzīvoklī', 'Visā Latvijā', 'Visā pasaulē']).optional(),
}).superRefine((data, ctx) => {
    if (data.objectType === 'Dzīvoklis') {
        if (!data.currentFloor) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Stāvs ir obligāts lauks.',
                path: ['currentFloor'],
            });
        }
        if (!data.totalFloors) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Kopējais stāvu skaits ir obligāts.',
                path: ['totalFloors'],
            });
        }
        if (data.currentFloor && data.totalFloors && data.currentFloor > data.totalFloors) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Stāvs nevar būt lielāks par kopējo stāvu skaitu.',
                path: ['currentFloor'],
            });
        }
    }
    if (data.objectType === 'Ēka') {
        if (!data.totalFloors) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Stāvu skaits ir obligāts.',
                path: ['totalFloors'],
            });
        }
    }
    if (data.hasSolarPanels) {
        if (!data.solarPanelsCount) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Saules paneļu skaits ir obligāts.',
                path: ['solarPanelsCount'],
            });
        }
        if (!data.solarPanelsValue) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Saules paneļu vērtība ir obligāta.',
                path: ['solarPanelsValue'],
            });
        }
        if (!data.solarPanelsLocation) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Atrašanās vieta ir obligāta.',
                path: ['solarPanelsLocation'],
            });
        }
    }
    if (data.isCommercial && !data.commercialActivityType) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Uzņēmējdarbības veids ir obligāts lauks.',
            path: ['commercialActivityType'],
        });
    }
    if (data.civilLiabilityInsuranceIncluded && !data.civilLiabilityCoverage) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Lūdzu, izvēlieties civiltiesiskās atbildības apdrošināšanas segumu.',
            path: ['civilLiabilityCoverage'],
        });
    }
});


export const ContactSchema = z.object({
    name: z.string().min(2, { message: "Vārdam jābūt vismaz 2 burtus garam." }),
    email: z.string().email({ message: "Lūdzu, ievadiet derīgu e-pasta adresi." }),
    phone: z.string().min(8, { message: "Tālruņa numuram jābūt vismaz 8 ciparus garam." }),
    consent: z.boolean().refine(val => val === true, {
        message: 'Lai turpinātu, jums jāpiekrīt informācijas nodošanai speciālistam.',
    }),
});
