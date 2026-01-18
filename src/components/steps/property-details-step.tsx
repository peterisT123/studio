'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property-card';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function PropertyDetailsStep() {
  const { state, addBuilding } = useAppContext();

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Īpašuma detaļas</CardTitle>
          <CardDescription className="text-lg">
            Pievienojiet vienu vai vairākus apdrošināmos objektus.
          </CardDescription>
        </CardHeader>
      </Card>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <AnimatePresence>
          {state.buildings.map((building, index) => (
             <motion.div
                key={building.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, type: 'spring' }}
                layout
             >
                <PropertyCard building={building} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={addBuilding}
          className="rounded-full py-6 px-8 text-lg border-2 border-dashed border-primary text-primary hover:text-primary hover:border-primary hover:bg-primary/10"
        >
          <PlusCircle className="mr-2 h-6 w-6" />
          Pievienot vēl vienu īpašumu
        </Button>
      </div>
    </div>
  );
}
