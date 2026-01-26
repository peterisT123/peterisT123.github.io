'use client';

import { useState } from 'react';
import { Home, Plane, Landmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export const ProductSelectionStep = () => {
  const { setProduct } = useAppContext();
  const [selection, setSelection] = useState<Product | null>(null);

  const handleApply = () => {
    if (selection) {
      setProduct(selection);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
       <header className="absolute top-0 left-0 right-0 flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
            <Landmark className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-foreground">
              Apdrošinātājs Pro
            </h1>
        </div>
      </header>
      <div className="w-full max-w-4xl px-4">
        <Card className="w-full p-8 rounded-3xl shadow-lg border-none bg-transparent">
            <CardHeader className="text-center">
            <CardTitle className="text-3xl lg:text-4xl font-bold font-headline text-primary leading-tight">
                Izvēlieties apdrošināšanas veidu
            </CardTitle>
            <CardDescription className="text-lg pt-2">Lai sāktu, izvēlieties vienu no produktiem un nospiediet "Pieteikties".</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8 mt-6">
            <div
                onClick={() => setSelection('Īpašums')}
                className={cn(
                'w-full md:w-80 h-80 rounded-2xl transition-all transform hover:scale-105 cursor-pointer flex flex-col justify-center items-center p-6 text-center border-4',
                selection === 'Īpašums' ? 'border-primary bg-primary/10' : 'border-border bg-card'
                )}
            >
                <Home className="w-20 h-20 mb-4 text-primary" />
                <h3 className="text-2xl font-bold font-headline">Īpašums</h3>
                <p className="text-muted-foreground mt-2">Apdrošiniet savu māju, dzīvokli un iedzīvi pret neparedzētiem riskiem.</p>
            </div>

            <div
                onClick={() => setSelection('Ceļojums')}
                className={cn(
                'w-full md:w-80 h-80 rounded-2xl transition-all transform hover:scale-105 cursor-pointer flex flex-col justify-center items-center p-6 text-center border-4',
                selection === 'Ceļojums' ? 'border-primary bg-primary/10' : 'border-border bg-card'
                )}
            >
                <Plane className="w-20 h-20 mb-4 text-primary" />
                <h3 className="text-2xl font-bold font-headline">Ceļojums</h3>
                <p className="text-muted-foreground mt-2">Ceļojiet droši, zinot, ka esat pasargāts no neparedzētām medicīniskām izmaksām.</p>
            </div>
            </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
            <Button
            onClick={handleApply}
            disabled={!selection}
            size="lg"
            className="w-full max-w-xs h-16 text-xl font-bold rounded-xl"
            >
            Pieteikties
            </Button>
        </div>
      </div>
    </div>
  );
};
