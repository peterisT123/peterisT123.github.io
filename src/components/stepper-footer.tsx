'use client';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';

export const StepperFooter = () => {
  const { step, totalSteps, isNextStepDisabled }
     = useAppContext();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-background border-t z-10">
      <div className="container flex items-center justify-end h-20">
        <div className="flex items-center gap-4">
          <span>Solis {step} no {totalSteps}</span>
          <Button type="submit" form="travel-form" disabled={isNextStepDisabled}>
            Tālāk
          </Button>
        </div>
      </div>
    </footer>
  );
};
