'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { lv } from 'date-fns/locale';
import { Calendar as CalendarIcon, Trash, Edit, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TravelerSchema, policyTypes } from '@/lib/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const activityLabels: { [key: string]: string } = {
  winterSports: 'Ziemas sports',
  diving: 'Daivings',
  otherSports: 'Citas sporta aktivitātes',
  competitions: 'Sacensības / treniņi',
  extremeSports: 'Ekstrēmā sporta sacensības / treniņi',
  physicalWork: 'Fizisks darbs',
};

const defaultFormValues = {
  id: '',
  firstName: '',
  lastName: '',
  birthDate: undefined,
  policyType: policyTypes[0],
  winterSports: 'nē',
  diving: 'nē',
  otherSports: 'nē',
  competitions: 'nē',
  extremeSports: 'nē',
  physicalWork: 'nē',
};

export const TravelStep = () => {
  const { state, setState, addTraveler, updateTraveler, removeTraveler, setNextStepDisabled } = useAppContext();
  const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
  const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTravelerIndex, setEditingTravelerIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof TravelerSchema>>({
    resolver: zodResolver(TravelerSchema),
    mode: 'onChange',
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (state.travel.travelers.length === 0) {
      setIsFormVisible(true);
    }
  }, []);

  useEffect(() => {
    setNextStepDisabled(state.travel.travelers.length === 0);
  }, [state.travel.travelers.length, setNextStepDisabled]);

  const onTravelDateChange = (field: 'travelDateFrom' | 'travelDateTo', value: Date | undefined) => {
    setState(prev => ({
      ...prev,
      travel: {
        ...prev.travel,
        [field]: value,
      }
    }));
  };

  useEffect(() => {
    if (state.travel.travelDateFrom && state.travel.travelDateTo && state.travel.travelDateFrom > state.travel.travelDateTo) {
      onTravelDateChange('travelDateTo', undefined);
    }
  }, [state.travel.travelDateFrom, state.travel.travelDateTo]);

  function onSubmit(values: z.infer<typeof TravelerSchema>) {
    if (editingTravelerIndex !== null) {
      updateTraveler(editingTravelerIndex, values);
    } else {
      addTraveler({ ...values, id: uuidv4() });
    }
    form.reset(defaultFormValues);
    setEditingTravelerIndex(null);
    if (state.travel.travelers.length > 0) {
        setIsFormVisible(false);
    }
  }

  const handleAddNew = () => {
    form.reset(defaultFormValues);
    setEditingTravelerIndex(null);
    setIsFormVisible(true);
  };

  const handleEdit = (index: number) => {
    setEditingTravelerIndex(index);
    form.reset(state.travel.travelers[index]);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    form.reset(defaultFormValues);
    setEditingTravelerIndex(null);
    if (state.travel.travelers.length > 0) {
        setIsFormVisible(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
        <Card className="rounded-3xl shadow-lg">
            <CardHeader className="flex-row items-center space-x-4 space-y-0">
                <CardTitle className='text-2xl font-headline'>Apdrošinātās personas:</CardTitle>
                <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-lg font-bold">{state.travel.travelers.length}</div>
                <Button variant="outline" onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Pievienot jaunu
                </Button>
                </div>
            </CardHeader>
        </Card>

      {isFormVisible && (
        <Card className="rounded-3xl shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-3xl lg:text-4xl font-bold font-headline text-primary leading-tight">
              {editingTravelerIndex !== null ? 'Rediģēt personu' : 'Pievienot personu'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vārds<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uzvārds<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2 md:w-1/2">
                      <FormLabel>Dzimšanas datums<span className="text-red-500">*</span></FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(new Date(field.value), 'dd.MM.yyyy')
                              ) : (
                                <span>DD.MM.GGGG</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={{ after: new Date() }}
                            initialFocus
                            locale={lv}
                            captionLayout="dropdown-buttons"
                            fromYear={currentYear - 100}
                            toYear={currentYear}
                            classNames={{
                                caption_dropdowns: 'flex gap-4',
                                caption_label: 'hidden',
                            }}
                            labels={{
                                labelMonthDropdown: () => 'Mēnesis',
                                labelYearDropdown: () => 'Gads',
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                 <p className="text-sm text-red-500">* ir obligāti aizpildāmie lauki</p>

                <FormField
                  control={form.control}
                  name="policyType"
                  render={({ field }) => (
                    <FormItem className="md:w-1/2">
                        <FormLabel className="text-lg font-semibold">
                            Pamata riski jeb ceļojuma adprošināšnas polises tips:
                            <span className="text-red-500">*</span>
                        </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Izvēlieties polises tipu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {policyTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    Paaugstināta riska aktivitātes
                  </Label>
                  <div className="rounded-md border">
                    {Object.keys(activityLabels).map((key, index) => (
                      <div key={key}>
                        {index > 0 && <hr />}
                        <FormField
                          control={form.control}
                          name={key as keyof z.infer<typeof TravelerSchema>}
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-4">
                              <FormLabel className="font-normal">
                                {activityLabels[key]}
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="jā" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Jā</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="nē" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Nē</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                    <Button type="submit" className="w-full">
                        {editingTravelerIndex !== null ? 'Saglabāt izmaiņas' : 'Pievienot'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel} className="w-full">
                        Atcelt
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {state.travel.travelers.length > 0 && (
          <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                  <CardTitle className='text-2xl font-headline'>Apdrošinātās personas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                  {state.travel.travelers.map((traveler, index) => (
                      <div key={traveler.id} className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="font-medium">{traveler.firstName} {traveler.lastName}</div>
                      <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(index)}>
                          <Edit className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => removeTraveler(index)}>
                          <Trash className="h-5 w-5 text-red-500" />
                          </Button>
                      </div>
                      </div>
                  ))}
              </CardContent>
          </Card>
      )}

      <Card className="rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Ceļojuma datumi</CardTitle>
          <CardDescription>Lūdzu, norādiet plānotos ceļojuma datumus.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex flex-col w-full space-y-2">
              <Popover open={isFromDatePickerOpen} onOpenChange={setIsFromDatePickerOpen}>
                <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'justify-start text-left font-normal',
                        !state.travel.travelDateFrom && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {state.travel.travelDateFrom ? (
                        format(state.travel.travelDateFrom, 'dd.MM.yyyy')
                      ) : (
                        <span>Sākuma datums</span>
                      )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={state.travel.travelDateFrom}
                    onSelect={(date) => {
                      onTravelDateChange('travelDateFrom', date);
                      setIsFromDatePickerOpen(false);
                    }}
                    disabled={{ before: new Date(), after: state.travel.travelDateTo }}
                    initialFocus
                    locale={lv}
                    captionLayout="dropdown-buttons"
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 2}
                    classNames={{
                        caption_dropdowns: 'flex gap-4',
                        caption_label: 'hidden',
                    }}
                    labels={{
                        labelMonthDropdown: () => 'Mēnesis',
                        labelYearDropdown: () => 'Gads',
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col w-full space-y-2">
              <Popover open={isToDatePickerOpen} onOpenChange={setIsToDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'justify-start text-left font-normal',
                      !state.travel.travelDateTo && 'text-muted-foreground'
                    )}
                    disabled={!state.travel.travelDateFrom}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {state.travel.travelDateTo ? (
                      format(state.travel.travelDateTo, 'dd.MM.yyyy')
                    ) : (
                      <span>Beigu datums</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={state.travel.travelDateTo}
                    onSelect={(date) => {
                      onTravelDateChange('travelDateTo', date);
                      setIsToDatePickerOpen(false);
                    }}
                    disabled={{ before: state.travel.travelDateFrom || new Date() }}
                    initialFocus
                    locale={lv}
                    captionLayout="dropdown-buttons"
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 2}
                    classNames={{
                        caption_dropdowns: 'flex gap-4',
                        caption_label: 'hidden',
                    }}
                    labels={{
                        labelMonthDropdown: () => 'Mēnesis',
                        labelYearDropdown: () => 'Gads',
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
