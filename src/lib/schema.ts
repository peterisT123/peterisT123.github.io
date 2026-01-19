import { z } from 'zod';

const requiredError = { required_error: 'Šis lauks ir obligāts.' };
const invalidTypeError = { invalid_type_error: 'Ievadīta nekorekta vērtība.' };

export const BuildingSchema = z.object({
    id: z.string(),
    objectType: z.enum(['Dzīvoklis', 'Māja', 'Ēka'], requiredError),
    ownerName: z.string(requiredError).min(2, 'Vārdam jābūt vismaz 2 burtus garam.').max(120, 'Vārds nevar būt garāks par 120 burtiem.'),
    propertyArea: z.number({ ...requiredError, ...invalidTypeError }).positive('Platībai jābūt lielākai par 0.'),
    buildYear: z.enum(['Pirms 1971', 'No 1972 - 1999', 'Pēc 2000'], requiredError),
    isConstantlyInhabited: z.boolean(),
    lossesInLast3Years: z.boolean(),
    movablePropertyIncluded: z.boolean(),
    valuableMovablePropertyIncluded: z.boolean(),
    totalFloors: z.number(invalidTypeError).positive('Stāvu skaitam jābūt pozitīvam skaitlim.').optional(),
    currentFloor: z.number(invalidTypeError).positive('Stāvam jābūt pozitīvam skaitlim.').optional(),
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
    if (data.objectType === 'Māja') {
        if (!data.totalFloors) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Stāvu skaits ir obligāts.',
                path: ['totalFloors'],
            });
        }
    }
});


export const ContactSchema = z.object({
    name: z.string().min(2, { message: "Vārdam jābūt vismaz 2 burtus garam." }),
    email: z.string().email({ message: "Lūdzu, ievadiet derīgu e-pasta adresi." }),
    phone: z.string().min(8, { message: "Tālruņa numuram jābūt vismaz 8 ciparus garam." }),
});
