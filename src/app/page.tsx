'use client';

import { useState } from 'react';
import { Check, Home, Landmark, Mail, ShieldCheck, Plane, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Stepper } from '@/components/stepper';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

import { IntroStep } from '@/components/steps/intro-step';
import { PropertyDetailsStep } from '@/components/steps/property-details-step';
import { SummaryStep } from '@/components/steps/summary-step';
import { ContactStep } from '@/components/steps/contact-step';
import { SubmittedStep } from '@/components/steps/submitted-step';
import { TravelStep } from '@/components/steps/travel-step';
import { ProductSelectionStep } from '@/components/steps/product-selection-step';
import { ContactSchema } from '@/lib/schema';

const propertySteps = [
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

const travelSteps = [
  {
    id: 1,
    title: 'Ceļojums',
    icon: Plane,
    component: <TravelStep />,
  },
  {
    id: 2,
    title: 'Kopsavilkums',
    icon: Check,
    component: <SummaryStep />,
  },
  {
    id: 3,
    title: 'Kontakti',
    icon: Mail,
    component: <ContactStep />,
  },
];

export default function InsuranceWizard() {
  const { state, handleBack, handleNext, setSubmitted, handleReset } = useAppContext();
  const { step, submitted, product } = state;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = product === 'Īpašums' ? propertySteps : travelSteps;

  const currentStepData = steps.find((s) => s.id === step);
  const validationResult = ContactSchema.safeParse(state.contact);
  const isContactFormValid = validationResult.success;

  const handleSend = async () => {
    console.log('--- FORM SUBMISSION ATTEMPT ---');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData.error || new Error('Failed to send email');
      }

      console.log('SUCCESS: Emails sent.');

      toast({
        title: "Pieteikums nosūtīts!",
        description: "Jūsu pieteikums ir veiksmīgi nosūtīts.",
        variant: 'default',
        className: 'bg-primary text-primary-foreground border-primary'
      });

      setSubmitted(true);

    } catch (error: any) {
      console.error('---!!! IMPORTANT: FORM SUBMISSION FAILED !!!---');
      const errorMessage = error.message || JSON.stringify(error);
      console.error('ERROR DETAILS:', errorMessage);
      toast({
        title: "Kļūda!",
        description: `Notikusi kļūda: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return <ProductSelectionStep />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
            <button onClick={handleReset} className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                <Landmark className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-headline font-bold text-foreground">
                  Apdrošinātājs Pro
                </h1>
              </button>
            </div>
            {!submitted && (
                <Stepper
                    currentStep={step}
                    steps={steps.map((s) => ({ title: s.title, icon: s.icon }))}
                />
            )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={submitted ? 'submitted' : step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {submitted ? <SubmittedStep /> : currentStepData?.component}
          </motion.div>
        </AnimatePresence>
      </main>

      {!submitted && (
          <footer className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t py-4" style={{ transform: 'translateZ(0)' }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <div>
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                    Atpakaļ
                  </Button>
                )}
              </div>
              <div className='flex items-center space-x-2'>
                <span className="text-sm text-muted-foreground">
                    Solis {step} no {steps.length}
                </span>
                {step < steps.length && (
                  <Button onClick={handleNext} disabled={isSubmitting}>Tālāk</Button>
                )}
                {step === steps.length && (
                  <Button onClick={handleSend} disabled={!isContactFormValid || isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSubmitting ? 'Sūta...' : 'Sūtīt'}
                  </Button>
                )}
              </div>
            </div>
          </footer>
      )}
    </div>
  );
}
