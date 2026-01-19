'use client';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Building, User } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export function IntroStep() {
  const { state, setState } = useAppContext();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-insurance');


  const handleLegalStatusChange = (value: 'Fiziska persona' | 'Juridiska persona') => {
    setState(prev => ({ ...prev, legalStatus: value }));
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className='p-8 sm:p-12 flex flex-col justify-center'>
                 <h3 className="text-3xl lg:text-4xl font-bold font-headline text-primary leading-tight">
                    Aptauja
                </h3>
                <p className="mt-4 text-lg font-bold text-foreground">
                    Sāciet savu ceļu uz pilnīgu sirdsmieru. Pielāgojiet savu apdrošināšanas plānu, kas atbilst tieši Jūsu vajadzībām.
                </p>
            </div>
            {heroImage && 
                <div className="relative h-64 md:h-full min-h-[250px]">
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={heroImage.imageHint}
                        priority
                    />
                </div>
            }
        </div>
      </Card>
      
      <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold mb-4 text-center font-headline">Izvēlies statusu</h3>
          <RadioGroup
            defaultValue={state.legalStatus}
            onValueChange={handleLegalStatusChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Label htmlFor="fiziska" className="cursor-pointer">
              <Card className={`rounded-2xl p-6 text-center transition-all duration-300 ${state.legalStatus === 'Fiziska persona' ? 'border-primary ring-2 ring-primary shadow-2xl' : 'hover:shadow-md'}`}>
                <User className="mx-auto h-10 w-10 mb-2 text-primary" />
                <h4 className="text-lg font-semibold">Fiziska persona</h4>
                <RadioGroupItem value="Fiziska persona" id="fiziska" className="sr-only" />
              </Card>
            </Label>
            <Label htmlFor="juridiska" className="cursor-pointer">
              <Card className={`rounded-2xl p-6 text-center transition-all duration-300 ${state.legalStatus === 'Juridiska persona' ? 'border-primary ring-2 ring-primary shadow-2xl' : 'hover:shadow-md'}`}>
                <Building className="mx-auto h-10 w-10 mb-2 text-primary" />
                <h4 className="text-lg font-semibold">Juridiska persona</h4>
                <RadioGroupItem value="Juridiska persona" id="juridiska" className="sr-only" />
              </Card>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
