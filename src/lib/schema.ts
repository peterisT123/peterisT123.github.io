import { z } from 'zod';

const requiredError = { required_error: 'Šis lauks ir obligāts.' };
const invalidTypeError = { invalid_type_error: 'Ievadīta nekorekta vērtība.' };

const emptyStringToUndefined = z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() === '') {
        return undefined;
    }
    return val;
}, z.any());


export const BuildingSchema = z.object({
    id: z.string(),
    objectType: z.enum(['Ēka', 'Dzīvoklis', 'Palīgēka'], requiredError),
    ownerName: z.string(requiredError).min(2, 'Vārdam jābūt vismaz 2 burtus garam.').max(120, 'Vārds nevar būt garāks par 120 burtiem.'),
    propertyArea: emptyStringToUndefined.pipe(z.coerce.number({ ...invalidTypeError }).positive('Platībai jābūt lielākai par 0.').optional()),
    commissioningYear: z.enum(['Pirms 1971', 'No 1972 - 1999', 'Pēc 2000', 'Nav nodots'], requiredError),
    constructionMaterial: z.enum(['Mūris', 'Koks', 'Jaukta tipa'], requiredError),
    lastRenovationYear: emptyStringToUndefined.pipe(z.coerce.number(invalidTypeError)
        .int('Kapitālā remonta gadam jābūt veselam skaitlim.')
        .min(1850, 'Kapitālā remonta gads nevar būt senāks par 1850.')
        .max(new Date().getFullYear(), 'Kapitālā remonta gads nevar būt nākotnē.')
        .refine(val => String(val).length === 4, { message: 'Gadam jābūt 4 ciparu skaitlim.' })
        .optional()),
    finishingLevel: z.enum(['Vienkāršs', 'Kvalitatīvs', 'Ekskluzīvs'], requiredError),
    isConstantlyInhabited: z.boolean(),
    isRented: z.boolean(),
    hasSecurityAlarm: z.boolean(),
    lossesInLast3Years: z.boolean(),
    movablePropertyIncluded: z.boolean(),
    valuableMovablePropertyIncluded: z.boolean(),
    hasSolarPanels: z.boolean(),
    solarPanelsCount: emptyStringToUndefined.pipe(z.coerce.number(invalidTypeError).int('Paneļu skaitam jābūt veselam skaitlim.').positive('Paneļu skaitam jābūt pozitīvam skaitlim.').optional()),
    solarPanelsValue: emptyStringToUndefined.pipe(z.coerce.number(invalidTypeError).int('Vērtībai jābūt veselam skaitlim.').positive('Vērtībai jābūt pozitīvam skaitlim.').optional()),
    solarPanelsLocation: z.enum(['Uz jumta pamatēkai', 'Uz palīgēkas', 'Uz zemes']).optional(),
    totalFloors: emptyStringToUndefined.pipe(z.coerce.number(invalidTypeError).int('Stāvu skaitam jābūt veselam skaitlim.').positive('Stāvu skaitam jābūt pozitīvam skaitlim.').optional()),
    currentFloor: emptyStringToUndefined.pipe(z.coerce.number(invalidTypeError).int('Stāvam jābūt veselam skaitlim.').positive('Stāvam jābūt pozitīvam skaitlim.').optional()),
    isCommercial: z.boolean(),
    commercialActivityType: z.string().max(200, 'Apraksts nevar būt garāks par 200 simboliem.').optional(),
    civilLiabilityInsuranceIncluded: z.boolean(),
    civilLiabilityCoverage: z.enum(['Tikai dzīvoklī', 'Visā Latvijā', 'Visā pasaulē']).optional(),
}).superRefine((data, ctx) => {
    if (!data.propertyArea) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Īpašuma platība ir obligāts lauks.',
            path: ['propertyArea'],
        });
    }
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
    name: z.string().min(2, { message: 'Vārdam jābūt vismaz 2 burtus garam.' }),
    email: z.string().email({ message: 'Lūdzu, ievadiet derīgu e-pasta adresi.' }),
    phone: z.string().min(8, { message: 'Tālruņa numuram jābūt vismaz 8 ciparus garam.' }),
});
