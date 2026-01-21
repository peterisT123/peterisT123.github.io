'use client';

import { Check, Home, Landmark, Mail, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Stepper } from '@/components/stepper';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

import { IntroStep } from '@/components/steps/intro-step';
import { PropertyDetailsStep } from '@/components/steps/property-details-step';
import { SummaryStep } from '@/components/steps/summary-step';
import { ContactStep } from '@/components/steps/contact-step';

const steps = [
  {
    id: 1,
    title: 'Riski',
    icon: ShieldCheck,
    component: <IntroStep />,
  },
  {
    id: 2,
    title: 'Īpašums',
    icon: Home,
    component: <PropertyDetailsStep />,
  },
  {
    id: 3,
    title: 'Kopsavilkums',
    icon: Check,
    component: <SummaryStep />,
  },
  {
    id: 4,
    title: 'Kontakti',
    icon: Mail,
    component: <ContactStep />,
  },
];

export default function InsuranceWizard() {
  const { state, handleBack, handleNext, setSubmitted } = useAppContext();
  const { step } = state;
  const { toast } = useToast();

  const currentStepData = steps.find((s) => s.id === step);

  const handleSend = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        throw new Error(`Server error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      toast({
        title: "Pieteikums nosūtīts!",
        description: "Jūsu pieteikums ir veiksmīgi nosūtīts mūsu brokerim.",
        variant: 'default',
        className: 'bg-primary text-primary-foreground border-primary'
      });

      setSubmitted(true);

    } catch (error) {
      console.error('Failed to send data:', error);
      toast({
        title: "Kļūda!",
        description: "Notikusi kļūda, sūtot pieteikumu. Lūdzu, mēģiniet vēlāk.",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-2">
                <Landmark className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-headline font-bold text-foreground">
                  Apdrošinātājs Pro
                </h1>
              </div>
            </div>
            <Stepper
                currentStep={step}
                steps={steps.map((s) => ({ title: s.title, icon: s.icon }))}
            />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStepData?.component}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            {step > 1 && !state.submitted && (
              <Button variant="outline" onClick={handleBack}>
                Atpakaļ
              </Button>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            {!state.submitted && (
                <span className="text-sm text-muted-foreground">
                    Solis {step} no {steps.length}
                </span>
            )}
            {step < steps.length && !state.submitted && (
              <Button onClick={handleNext}>Tālāk</Button>
            )}
            {step === steps.length && !state.submitted && (
              <Button onClick={handleSend}>
                Sūtīt brokerim
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
