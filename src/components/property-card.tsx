'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Building, Trash2 } from 'lucide-react';
import type { Building as BuildingType } from '@/lib/types';
import { BuildingSchema } from '@/lib/schema';
import { useAppContext } from '@/context/app-context';
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
  const { updateBuilding, removeBuilding, state: { buildings, legalStatus } } = useAppContext();

  const form = useForm<BuildingType>({
    resolver: zodResolver(BuildingSchema),
    defaultValues: building,
    mode: 'onBlur',
  });

  const objectType = form.watch('objectType');
  const movablePropertyIncluded = form.watch('movablePropertyIncluded');
  const hasSolarPanels = form.watch('hasSolarPanels');
  const isCommercial = form.watch('isCommercial');
  const civilLiabilityInsuranceIncluded = form.watch('civilLiabilityInsuranceIncluded');

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
                          <SelectItem value="Ēka">Ēka</SelectItem>
                          <SelectItem value="Dzīvoklis">Dzīvoklis</SelectItem>
                          <SelectItem value="Palīgēka">Palīgēka</SelectItem>
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
                      <p className="text-xs text-muted-foreground">Kadastra numurs un/vai personas kods tiks precizēts telefoniski</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="constructionMaterial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Būvniecības materiāls</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Izvēlieties materiālu" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mūris">Mūris</SelectItem>
                          <SelectItem value="Koks">Koks</SelectItem>
                          <SelectItem value="Jaukta tipa">Jaukta tipa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="lastRenovationYear"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Kapitālā remonta gads</FormLabel>
                        <FormControl><Input type="number" placeholder="2022" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}/></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="finishingLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apdares darbu līmenis</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Izvēlieties apdares līmeni" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Vienkāršs">Vienkāršs</SelectItem>
                          <SelectItem value="Kvalitatīvs">Kvalitatīvs</SelectItem>
                          <SelectItem value="Ekskluzīvs">Ekskluzīvs</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                 <h3 className="text-lg font-semibold font-headline text-foreground">Papildus informācija</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="propertyArea"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Īpašuma platība (m²)</FormLabel>
                        <FormControl><Input type="number" placeholder="65.5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {objectType === 'Ēka' && (
                        <>
                        <FormField
                        control={form.control}
                        name="currentFloor"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Stāvs</FormLabel>
                            <FormControl><Input type="number" placeholder="3" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}/></FormControl>
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
                            <FormControl><Input type="number" placeholder="5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </>
                    )}
                    {objectType === 'Dzīvoklis' && (
                    <>
                        <FormField
                        control={form.control}
                        name="currentFloor"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Stāvs</FormLabel>
                            <FormControl><Input type="number" placeholder="3" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}/></FormControl>
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
                            <FormControl><Input type="number" placeholder="5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </>
                    )}
                 </div>
                 <FormField
                  control={form.control}
                  name="commissioningYear"
                  render={({ field }) => (
                    <FormItem className="space-y-3 pt-4">
                      <FormLabel>Ekspluatācijā nodošanas gads</FormLabel>
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
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Nav nodots" /></FormControl>
                            <FormLabel className="font-normal">Nav nodots</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="isRented"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Īpašums tiek izīrēts</FormLabel>
                          </div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hasSecurityAlarm"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Signalizācija (apsardzes dienests)</FormLabel>
                          </div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                </div>
              </div>

              {legalStatus === 'Juridiska persona' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-headline text-foreground">Komercdarbība</h3>
                    <FormField
                      control={form.control}
                      name="isCommercial"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Vai notiek komercdarbība</FormLabel>
                          </div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                    {isCommercial && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 ml-8">
                        <FormField
                          control={form.control}
                          name="commercialActivityType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Uzņēmējdarbības veids</FormLabel>
                              <FormControl><Input placeholder="Apraksts" {...field} maxLength={200} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </div>
                </>
              )}

              <Separator />

               <div className="space-y-4">
                <h3 className="text-lg font-semibold font-headline text-foreground">Saules paneļi</h3>
                 <FormField
                  control={form.control}
                  name="hasSolarPanels"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-green-500/10">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ir uzstādīti saules paneļi</FormLabel>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
                {hasSolarPanels && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 ml-8">
                     <FormField
                        control={form.control}
                        name="solarPanelsCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skaits</FormLabel>
                                <FormControl><Input type="number" placeholder="12" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}/></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="solarPanelsValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vērtība (EUR)</FormLabel>
                                <FormControl><Input type="number" placeholder="5000" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}/></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="solarPanelsLocation"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Atrašanās vieta</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger><SelectValue placeholder="Izvēlieties atrašanās vietu" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Uz jumta pamatēkai">Uz jumta pamatēkai</SelectItem>
                                <SelectItem value="Uz palīgēkas">Uz palīgēkas</SelectItem>
                                <SelectItem value="Uz zemes">Uz zemes</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                   </motion.div>
                )}
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
                                <FormLabel className="text-base">Vērtīgāks par 3000 EUR</FormLabel>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                        />
                   </motion.div>
                )}
              </div>

              <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-headline text-foreground">Civiltiesiskās atbildības apdrošināšana</h3>
                    <FormField
                        control={form.control}
                        name="civilLiabilityInsuranceIncluded"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-blue-500/10">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Iekļaut civiltiesiskās atbildības apdrošināšanu</FormLabel>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                    {civilLiabilityInsuranceIncluded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 ml-8">
                            <FormField
                            control={form.control}
                            name="civilLiabilityCoverage"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Apdrošināšanas segums</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col md:flex-row gap-4"
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="Tikai dzīvoklī" /></FormControl>
                                        <FormLabel className="font-normal">Tikai dzīvoklī</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="Visā Latvijā" /></FormControl>
                                        <FormLabel className="font-normal">Visā Latvijā</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="Visā pasaulē" /></FormControl>
                                        <FormLabel className="font-normal">Visā pasaulē</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
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
