'use client';

import { useState, useEffect, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevBuildingsLength = useRef(state.buildings.length);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      if (state.buildings.length === 0) {
        addBuilding();
      }
    }

    return () => {
      effectRan.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // When a building is added, automatically switch to it.
    if (state.buildings.length > prevBuildingsLength.current) {
        setCurrentIndex(state.buildings.length - 1);
    } 
    // Handle active index becoming invalid after deletion
    else if (currentIndex >= state.buildings.length && state.buildings.length > 0) {
        setCurrentIndex(state.buildings.length - 1);
    }
    // Update the previous length for the next render cycle.
    prevBuildingsLength.current = state.buildings.length;
  }, [state.buildings.length, currentIndex]);

  const currentBuilding = state.buildings[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Īpašuma detaļas</CardTitle>
          <CardDescription className="text-lg">
            Pārvaldiet savus apdrošināmos objektus.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="p-4 bg-card border rounded-2xl flex flex-wrap items-center justify-center gap-2 shadow-sm">
          <p className='text-sm font-medium text-muted-foreground mr-2'>Apdrošināmie objekti:</p>
          {state.buildings.map((building, index) => (
              <Button
                  key={building.id}
                  variant={index === currentIndex ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentIndex(index)}
                  className="rounded-full transition-all"
              >
                  Nr. {index + 1}
              </Button>
          ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addBuilding}
              className="rounded-full transition-all"
          >
              <PlusCircle className="mr-2 h-4 w-4" />
              Pievienot jaunu
          </Button>
      </div>
      
      {currentBuilding && (
        <motion.div
            key={currentBuilding.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <PropertyCard building={currentBuilding} index={currentIndex} />
        </motion.div>
      )}
    </div>
  );
}
