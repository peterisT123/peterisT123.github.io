'use client';

import { cn } from '@/lib/utils';
import { Check, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

type Step = {
  title: string;
  icon: LucideIcon;
};

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.title}
            className={cn('relative', { 'flex-1': stepIdx < steps.length - 1 })}
          >
            <div className="flex items-center">
              {/* Connector line */}
              {stepIdx > 0 && (
                <div className="flex-1 h-0.5 bg-border relative">
                   <motion.div
                    className="absolute top-0 left-0 h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: currentStep > stepIdx ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                </div>
              )}

              <motion.div
                className="relative flex h-10 w-10 items-center justify-center rounded-full"
                animate={currentStep > stepIdx ? 'completed' : currentStep === stepIdx + 1 ? 'active' : 'inactive'}
                variants={{
                    completed: { scale: 1, backgroundColor: 'hsl(var(--primary))' },
                    active: { scale: 1.1, backgroundColor: 'hsl(var(--primary))' },
                    inactive: { scale: 1, backgroundColor: 'hsl(var(--card))' },
                }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn("absolute inset-0 rounded-full border-2",
                    currentStep > stepIdx ? 'border-primary' :
                    currentStep === stepIdx + 1 ? 'border-primary' : 'border-border'
                )}></div>
                {currentStep > stepIdx ? (
                  <Check className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                ) : (
                  <step.icon
                    className={cn(
                      'h-6 w-6',
                      currentStep === stepIdx + 1 ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                )}
              </motion.div>

              <div className="absolute top-12 w-max text-center left-1/2 -translate-x-1/2">
                <p className={cn(
                  "text-sm font-medium",
                  currentStep >= stepIdx + 1 ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
              </div>
            </div>

            {/* Final connector line */}
            {stepIdx === steps.length - 1 && (
                 <div className="flex-1 h-0.5 bg-transparent"></div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
