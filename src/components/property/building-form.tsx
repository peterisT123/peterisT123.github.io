
'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Building, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { FormInput } from '@/components/form/form-input';
import { FormRadioGroup } from '@/components/form/form-radio-group';
import { FormSwitch } from '@/components/form/form-switch';
import { FormTextarea } from '@/components/form/form-textarea';


export function BuildingForm() {
    const { control, watch } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: 'buildings' });

    const handleAddBuilding = () => {
        append({
            id: crypto.randomUUID(),
            objectType: 'Dzīvoklis',
            ownerName: '',
            propertyArea: undefined,
            commissioningYear: undefined,
            constructionMaterial: undefined,
            lastRenovationYear: undefined,
            finishingLevel: undefined,
            isConstantlyInhabited: true,
            isRented: false,
            hasSecurityAlarm: false,
            lossesInLast3Years: false,
            movablePropertyIncluded: false,
            valuableMovablePropertyIncluded: false,
            movablePropertyValue: undefined,
            hasSolarPanels: false,
            solarPanelsCount: undefined,
            solarPanelsValue: undefined,
            solarPanelsLocation: undefined,
            totalFloors: undefined,
            currentFloor: undefined,
            isCommercial: false,
            commercialActivityType: '',
            civilLiabilityInsuranceIncluded: false,
            civilLiabilityCoverage: undefined,
            civilLiabilityValue: undefined,
            totalMovablePropertyValue: undefined

        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Apdrošināšanas objekts</CardTitle>
            </CardHeader>
            <CardContent>
                <AnimatePresence>
                    {fields.map((field, index) => {
                        const objectType = watch(`buildings.${index}.objectType`);
                        const isRented = watch(`buildings.${index}.isRented`);
                        const isCommercial = watch(`buildings.${index}.isCommercial`);
                        const movablePropertyIncluded = watch(`buildings.${index}.movablePropertyIncluded`);
                        const valuableMovablePropertyIncluded = watch(`buildings.${index}.valuableMovablePropertyIncluded`);
                        const hasSolarPanels = watch(`buildings.${index}.hasSolarPanels`);
                        const civilLiabilityInsuranceIncluded = watch(`buildings.${index}.civilLiabilityInsuranceIncluded`);

                        return (
                            <motion.div
                                key={field.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="mb-6 rounded-lg border p-4 relative"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-5 w-5" />
                                        <h3 className="text-lg font-semibold">Objekts #{index + 1}</h3>
                                    </div>
                                    {fields.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <FormRadioGroup
                                        name={`buildings.${index}.objectType`}
                                        label="Objekta veids"
                                        items={['Dzīvoklis', 'Ēka', 'Palīgēka']}
                                        gridCols="grid-cols-3"
                                    />

                                    <FormInput
                                        name={`buildings.${index}.ownerName`}
                                        label="Īpašnieka vārds, uzvārds"
                                        placeholder="Jānis Bērziņš"
                                        description="Persona, uz kuras vārda reģistrēts īpašums"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput
                                            name={`buildings.${index}.propertyArea`}
                                            label="Platība (m²)"
                                            type="number"
                                            placeholder="100"
                                        />
                                        <FormRadioGroup
                                            name={`buildings.${index}.commissioningYear`}
                                            label="Ekspluatācijas nodošanas gads"
                                            items={['Pirms 1971', 'No 1972 - 1999', 'Pēc 2000', 'Nav nodots']}
                                        />
                                    </div>

                                    {(objectType === 'Dzīvoklis' || objectType === 'Ēka') && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormRadioGroup
                                                name={`buildings.${index}.constructionMaterial`}
                                                label="Būvkonstrukcijas materiāls"
                                                items={['Mūris', 'Koks', 'Jaukta tipa']}
                                                gridCols="grid-cols-3"
                                            />
                                            <FormRadioGroup
                                                name={`buildings.${index}.finishingLevel`}
                                                label="Iekšējā apdare"
                                                items={['Vienkāršs', 'Kvalitatīvs', 'Ekskluzīvs']}
                                                gridCols="grid-cols-3"
                                            />
                                        </div>
                                    )}

                                    {objectType === 'Dzīvoklis' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput
                                                name={`buildings.${index}.currentFloor`}
                                                label="Stāvs"
                                                type="number"
                                                placeholder="3"
                                            />
                                            <FormInput
                                                name={`buildings.${index}.totalFloors`}
                                                label="Stāvu skaits mājā"
                                                type="number"
                                                placeholder="5"
                                            />
                                        </div>
                                    )}

                                    {objectType === 'Ēka' && (
                                        <FormInput
                                            name={`buildings.${index}.totalFloors`}
                                            label="Stāvu skaits"
                                            type="number"
                                            placeholder="2"
                                        />
                                    )}

                                    <div className="rounded-md border p-4 bg-muted/20">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <FormSwitch name={`buildings.${index}.isConstantlyInhabited`} label="Pastāvīgi apdzīvots" />
                                            <FormSwitch name={`buildings.${index}.isRented`} label="Tiek izīrēts" />
                                            <FormSwitch name={`buildings.${index}.hasSecurityAlarm`} label="Signalizācija" />
                                            <FormSwitch name={`buildings.${index}.lossesInLast3Years`} label="Zaudējumi pēdējos 3 gados" />
                                        </div>
                                        {isRented && (
                                            <div className="mt-4">
                                                <FormSwitch name={`buildings.${index}.isCommercial`} label="Tiek veikta saimnieciskā darbība" />
                                                {isCommercial && (
                                                    <FormTextarea
                                                        name={`buildings.${index}.commercialActivityType`}
                                                        label="Saimnieciskās darbības apraksts"
                                                        placeholder="Piemēram, birojs, veikals, ražotne..."
                                                        className="mt-2"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="font-semibold">Papildu riski</h4>
                                        <div className="rounded-md border p-4 bg-muted/20 space-y-4">
                                            <div>
                                                <h5 className="font-medium mb-2">Kustamā manta</h5>
                                                <FormSwitch name={`buildings.${index}.movablePropertyIncluded`} label="Iekļaut kustamo mantu" />
                                                {movablePropertyIncluded && (
                                                    <div className="mt-4 space-y-4 pl-6 border-l">
                                                        <FormInput
                                                            name={`buildings.${index}.totalMovablePropertyValue`}
                                                            label="Mantas kopējā vērtība"
                                                            type="number"
                                                            placeholder="10000"
                                                        />
                                                        <FormSwitch name={`buildings.${index}.valuableMovablePropertyIncluded`} label="Vērtīgāks par 3000 EUR" />
                                                        {valuableMovablePropertyIncluded && (
                                                            <FormInput
                                                                name={`buildings.${index}.movablePropertyValue`}
                                                                label="Dārgākās mantas apraksts un vērtība"
                                                                placeholder="Piemēram, velosipēds (3200 EUR), dators (4000 EUR)"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h5 className="font-medium mb-2">Civiltiesiskās atbildības apdrošināšana</h5>
                                                <FormSwitch name={`buildings.${index}.civilLiabilityInsuranceIncluded`} label="Iekļaut civiltiesiskās atbildības apdrošināšanu" />
                                                {civilLiabilityInsuranceIncluded && (
                                                    <div className="mt-4 space-y-4 pl-6 border-l">
                                                        <FormRadioGroup
                                                            name={`buildings.${index}.civilLiabilityCoverage`}
                                                            label="Apdrošināšanas segums"
                                                            items={['Tikai dzīvoklī', 'Visā Latvijā', 'Visā pasaulē']}
                                                            gridCols="grid-cols-3"
                                                        />
                                                        <FormRadioGroup
                                                            name={`buildings.${index}.civilLiabilityValue`}
                                                            label="Vērtība EUR"
                                                            items={['5000', '10000', '15000', '20000 un vairāk']}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h5 className="font-medium mb-2">Saules paneļi</h5>
                                                <FormSwitch name={`buildings.${index}.hasSolarPanels`} label="Ir saules paneļi" />
                                                {hasSolarPanels && (
                                                    <div className="mt-4 space-y-4 pl-6 border-l">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <FormInput
                                                                name={`buildings.${index}.solarPanelsCount`}
                                                                label="Paneļu skaits"
                                                                type="number"
                                                                placeholder="10"
                                                            />
                                                            <FormInput
                                                                name={`buildings.${index}.solarPanelsValue`}
                                                                label="Kopējā vērtība"
                                                                type="number"
                                                                placeholder="8000"
                                                            />
                                                        </div>
                                                        <FormRadioGroup
                                                            name={`buildings.${index}.solarPanelsLocation`}
                                                            label="Atrašanās vieta"
                                                            items={['Uz jumta pamatēkai', 'Uz palīgēkas', 'Uz zemes']}
                                                            gridCols="grid-cols-3"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <Button variant="outline" onClick={handleAddBuilding} className="mt-6">
                    Pievienot vēl vienu objektu
                </Button>
            </CardContent>
        </Card>
    );
}
