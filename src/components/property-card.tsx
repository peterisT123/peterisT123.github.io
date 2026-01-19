'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Building, Building2, MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import type { Building as BuildingType } from '@/lib/types';
import { BuildingSchema } from '@/lib/schema';
import { useAppContext } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from './ui/separator';

interface PropertyCardProps {
  building: BuildingType;
  index: number;
}

export function PropertyCard({ building, index }: PropertyCardProps) {
  const { updateBuilding, removeBuilding, state: { buildings } } = useAppContext();

  const form = useForm<BuildingType>({
    resolver: zodResolver(BuildingSchema),
    defaultValues: building,
    mode: 'onBlur',
  });

  const objectType = form.watch('objectType');
  const movablePropertyIncluded = form.watch('movablePropertyIncluded');

  useEffect(() => {
    const subscription = form.watch((value) => {
        updateBuilding(index, value as BuildingType);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, index, updateBuilding]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="rounded-3xl shadow-lg overflow-hidden border-2 border-transparent focus-within:border-primary transition-colors duration-300">
        <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-xl text-foreground flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Nr.{index + 1} - {objectType}
          </CardTitle>
          {buildings.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeBuilding(index)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label={`Remove property #${index + 1}`}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="objectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objekta tips</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Izvēlieties objekta tipu" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dzīvoklis">Dzīvoklis</SelectItem>
                          <SelectItem value="Māja">Māja</SelectItem>
                          <SelectItem value="Ēka">Ēka</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Īpašnieka vārds, uzvārds</FormLabel>
                      <FormControl><Input placeholder="Jānis Bērziņš" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {objectType === 'Dzīvoklis' && (
                  <>
                    <FormField
                      control={form.control}
                      name="currentFloor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stāvs</FormLabel>
                          <FormControl><Input type="number" placeholder="3" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="totalFloors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kopējais stāvu skaits ēkā</FormLabel>
                          <FormControl><Input type="number" placeholder="5" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)}/></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {objectType === 'Māja' && (
                    <FormField
                      control={form.control}
                      name="totalFloors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stāvu skaits</FormLabel>
                          <FormControl><Input type="number" placeholder="2" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)}/></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
                
                <FormField
                  control={form.control}
                  name="propertyArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Īpašuma platība (m²)</FormLabel>
                      <FormControl><Input type="number" placeholder="65.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                 <h3 className="text-lg font-semibold font-headline text-foreground">Papildus informācija</h3>
                 <FormField
                  control={form.control}
                  name="buildYear"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Būvniecības gads</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col md:flex-row gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Pirms 1971" /></FormControl>
                            <FormLabel className="font-normal">Pirms 1971</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="No 1972 - 1999" /></FormControl>
                            <FormLabel className="font-normal">No 1972 - 1999</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Pēc 2000" /></FormControl>
                            <FormLabel className="font-normal">Pēc 2000</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <FormField
                      control={form.control}
                      name="isConstantlyInhabited"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Ir pastāvīgi apdzīvots</FormLabel>
                          </div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lossesInLast3Years"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Zaudējumi pēdējos 3 gados</FormLabel>
                          </div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-headline text-foreground">Kustamā manta</h3>
                 <FormField
                  control={form.control}
                  name="movablePropertyIncluded"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-accent/10">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Iekļaut kustamo mantu</FormLabel>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
                {movablePropertyIncluded && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <FormField
                        control={form.control}
                        name="valuableMovablePropertyIncluded"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 ml-8 bg-accent/20">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Iekļaut vērtīgu mantu</FormLabel>
                                <p className="text-sm text-muted-foreground">Māksla, dārglietas, u.c.</p>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                        />
                   </motion.div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
