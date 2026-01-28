import { z } from 'zod';

const requiredError = { required_error: 'Šis lauks ir obligāts.' };
const invalidTypeError = { invalid_type_error: 'Ievadīta nekorekta vērtība.' };

export const ContactSchema = z.object({
  name: z.string(requiredError).min(2, 'Vārdam jābūt vismaz 2 burtus garam.').max(120, 'Vārds nevar būt garāks par 120 burtiem.'),
  email: z.string(requiredError).email('Lūdzu, ievadiet korektu e-pasta adresi.'),
  phone: z.string(requiredError).min(8, 'Telefona numuram jābūt vismaz 8 ciparus garam.'),
  company: z.string().optional(),
  consent: z.boolean().refine(value => value === true, { message: 'Jums jāpiekrīt noteikumiem.' }),
});


export const BuildingSchema = z.object({
    id: z.string(),
    objectType: z.enum(['Ēka', 'Dzīvoklis', 'Palīgēka'], requiredError),
    ownerName: z.string(requiredError).min(2, 'Vārdam jābūt vismaz 2 burtus garam.').max(120, 'Vārds nevar būt garāks par 120 burtiem.'),
    propertyArea: z.number({ ...invalidTypeError }).positive('Platībai jābūt lielākai par 0.').optional(),
    commissioningYear: z.enum(['Pirms 1971', 'No 1972 - 1999', 'Pēc 2000', 'Nav nodots'], requiredError),
    constructionMaterial: z.enum(['Mūris', 'Koks', 'Jaukta tipa'], requiredError),
    lastRenovationYear: z.number({ ...requiredError, ...invalidTypeError })
    .min(1800, 'Remonta gadam jābūt lielākam par 1800.')
    .max(new Date().getFullYear(), `Remonta gads nevar būt lielāks par ${new Date().getFullYear()}.`),
    finishingLevel: z.enum(['Vienkāršs', 'Kvalitatīvs', 'Ekskluzīvs'], requiredError),
    isConstantlyInhabited: z.boolean(),
    isRented: z.boolean(),
    hasSecurityAlarm: z.boolean(),
    lossesInLast3Years: z.boolean(),
    movablePropertyIncluded: z.boolean(),
    totalMovablePropertyValue: z.number(invalidTypeError).positive('Vērtībai jābūt pozitīvam skaitlim.').optional(),
    valuableMovablePropertyIncluded: z.boolean(),
    movablePropertyValue: z.number(invalidTypeError).positive('Vērtībai jābūt pozitīvam skaitlim.').optional(),
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
    civilLiabilityValue: z.enum(['5000', '10000', '15000', '20000 un vairāk']).optional(),
}).superRefine((data, ctx) => {
    if (data.objectType === 'Dzīvoklis') {
        if (!data.currentFloor) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Lūdzu, norādiet stāvu, kurā atrodas dzīvoklis.',
                path: ['currentFloor'],
            });
        }
        if (!data.totalFloors) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Lūdzu, norādiet kopējo stāvu skaitu ēkā.',
                path: ['totalFloors'],
            });
        }
    }
    if (data.objectType === 'Ēka' && !data.totalFloors) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Lūdzu, norādiet ēkas stāvu skaitu.',
            path: ['totalFlools'],
        });
    }

    if (data.isCommercial && !data.commercialActivityType) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Lūdzu, aprakstiet saimnieciskās darbības veidu.',
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
    if (data.movablePropertyIncluded && !data.totalMovablePropertyValue) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Lūdzu, ievadiet mantas kopējo vērtību.',
            path: ['totalMovablePropertyValue'],
        });
    }
    if (data.civilLiabilityInsuranceIncluded && !data.civilLiabilityValue) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Lūdzu, izvēlieties civiltiesiskās atbildības vērtību.',
            path: ['civilLiabilityValue'],
        });
    }
});
