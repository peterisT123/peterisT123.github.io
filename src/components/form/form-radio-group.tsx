'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormRadioGroupProps {
    name: string;
    label: string;
    items: string[];
    gridCols?: string;
}

export function FormRadioGroup({ name, label, items, gridCols = 'grid-cols-2' }: FormRadioGroupProps) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className={`grid ${gridCols} gap-4`}
                        >
                            {items.map((item) => (
                                <FormItem key={item} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={item} />
                                    </FormControl>
                                    <FormLabel className="font-normal">{item}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
