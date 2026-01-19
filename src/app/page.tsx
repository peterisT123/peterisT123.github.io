'use client';

import { Check, Home, Landmark, Mail, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Stepper } from '@/components/stepper';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import type { AppState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { IntroStep } from '@/components/steps/intro-step';
import { PropertyDetailsStep } from '@/components/steps/property-details-step';
import { SummaryStep } from '@/components/steps/summary-step';
import { ContactStep } from '@/components/steps/contact-step';

function formatDataForEmail(data: AppState): string {
  let emailBody = `Jauns apdrošināšanas pieteikums\n`;
  emailBody += `=================================\n\n`;
  
  emailBody += `KLIENTA INFORMĀCIJA\n`;
  emailBody += `-------------------\n`;
  emailBody += `Personas statuss: ${data.legalStatus}\n`;
  emailBody += `Vārds, uzvārds: ${data.contact.name}\n`;
  emailBody += `E-pasts: ${data.contact.email}\n`;
  emailBody += `Tālrunis: ${data.contact.phone}\n\n`;

  emailBody += `APDROŠINĀMIE OBJEKTI\n`;
  emailBody += `---------------------\n`;

  data.buildings.forEach((building, index) => {
    emailBody += `\nNr.${index + 1} - ${building.objectType}\n`;
    emailBody += `Īpašnieka vārds: ${building.ownerName}\n`;
    emailBody += `Platība: ${building.propertyArea} m²\n`;
    emailBody += `Būvniecības gads: ${building.buildYear}\n`;

    if (building.objectType === 'Dzīvoklis') {
      emailBody += `Stāvs: ${building.currentFloor} no ${building.totalFloors}\n`;
    }
    if (building.objectType === 'Māja') {
        emailBody += `Stāvu skaits: ${building.totalFloors}\n`;
    }

    emailBody += `Statuss: ${building.isConstantlyInhabited ? 'Pastāvīgi apdzīvots' : 'Nav pastāvīgi apdzīvots'}\n`;
    emailBody += `Zaudējumi pēdējos 3 gados: ${building.lossesInLast3Years ? 'Ir bijuši' : 'Nav bijuši'}\n`;
    emailBody += `Kustamā manta: ${building.movablePropertyIncluded ? 'Iekļauta' : 'Nav iekļauta'}\n`;
    if (building.movablePropertyIncluded) {
      emailBody += `   - Vērtīga manta: ${building.valuableMovablePropertyIncluded ? 'Iekļauta' : 'Nav iekļauta'}\n`;
    }
  });

  emailBody += `\n\n--- E-pasta beigas ---\n`;

  return emailBody;
}

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
    title: 'Kontakti',
    icon: Mail,
    component: <ContactStep />,
  },
  {
    id: 4,
    title: 'Apstiprinājums',
    icon: Check,
    component: <SummaryStep />,
  },
];

export default function InsuranceWizard() {
  const { state, handleBack, handleNext, setSubmitted } = useAppContext();
  const { step } = state;
  const { toast } = useToast();

  const currentStepData = steps.find((s) => s.id === step);

  const handleSend = () => {
    const emailBody = formatDataForEmail(state);
    const mailtoLink = `mailto:brokeris@example.com?subject=${encodeURIComponent('Jauns apdrošināšanas pieteikums')}&body=${encodeURIComponent(emailBody)}`;
    
    toast({
      title: "Pieteikums sagatavots!",
      description: "Jūsu e-pasta klients tiks atvērts, lai nosūtītu pieteikumu.",
      variant: 'default',
      className: 'bg-primary text-primary-foreground border-primary'
    });

    setSubmitted(true);
    window.location.href = mailtoLink;
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
