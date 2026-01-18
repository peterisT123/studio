'use client';

import { Check, Home, Landmark, Mail, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Stepper } from '@/components/stepper';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';

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
  const { state, handleBack, handleNext } = useAppContext();
  const { step } = state;

  const currentStepData = steps.find((s) => s.id === step);

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
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Atpakaļ
              </Button>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <span className="text-sm text-muted-foreground">
                Solis {step} no {steps.length}
            </span>
            {step < steps.length && (
              <Button onClick={handleNext}>Tālāk</Button>
            )}
            {step === steps.length && (
              <Button form="contact-form" type="submit">
                Sūtīt brokerim
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
