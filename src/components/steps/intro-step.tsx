'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const IntroStep = () => {
  const { state, setState, setFormId } = useAppContext();

  useEffect(() => {
    setFormId(null);
  }, [setFormId]);

  const handleStatusChange = (value: string) => {
    setState(prevState => ({ ...prevState, legalStatus: value as 'Fiziska persona' | 'Juridiska persona' }));
  };

  return (
    <Card className="rounded-3xl shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-3xl lg:text-4xl font-bold font-headline text-primary leading-tight">
          Izvēlies statusu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={state.legalStatus} 
          onValueChange={handleStatusChange} 
          className="grid grid-cols-2 gap-4"
        >
          <Label htmlFor="fiziska">
            <div className={`border-2 ${state.legalStatus === 'Fiziska persona' ? 'border-primary' : 'border-muted'} rounded-xl p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer`}>
              <RadioGroupItem value="Fiziska persona" id="fiziska" className="sr-only" />
              <span className="text-2xl">&#128100;</span>
              <span className="font-semibold">Fiziska persona</span>
            </div>
          </Label>
          <Label htmlFor="juridiska">
            <div className={`border-2 ${state.legalStatus === 'Juridiska persona' ? 'border-primary' : 'border-muted'} rounded-xl p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer`}>
              <RadioGroupItem value="Juridiska persona" id="juridiska" className="sr-only" />
              <span className="text-2xl">&#127970;</span>
              <span className="font-semibold">Juridiska persona</span>
            </div>
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
