'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Vārdam jābūt vismaz 2 rakstzīmes garam' })
    .max(120, { message: 'Vārds nedrīkst būt garāks par 120 rakstzīmēm' }),
  lastName: z
    .string()
    .min(2, { message: 'Uzvārdam jābūt vismaz 2 rakstzīmes garam' })
    .max(120, { message: 'Uzvārds nedrīkst būt garāks par 120 rakstzīmēm' }),
  birthDate: z.date({ required_error: 'Dzimšanas datums ir obligāts lauks' }),
  winterSports: z.enum(['jā', 'nē'], {
    required_error: ' ',
  }),
  diving: z.enum(['jā', 'nē'], { required_error: ' ' }),
  otherSports: z.enum(['jā', 'nē'], {
    required_error: ' ',
  }),
  competitions: z.enum(['jā', 'nē'], {
    required_error: ' ',
  }),
  extremeSports: z.enum(['jā', 'nē'], {
    required_error: ' ',
  }),
  physicalWork: z.enum(['jā', 'nē'], {
    required_error: ' ',
  }),
  propertyInsurance: z.enum(['jā', 'nē'], {
    required_error: ' ',
  }),
  travelDateFrom: z.date().optional(),
  travelDateTo: z.date().optional(),
}).refine(data => {
  if (data.propertyInsurance === 'nē') {
    return !!data.travelDateFrom && !!data.travelDateTo;
  }
  return true;
}, { message: 'Ceļojuma periodam jābūt norādītam, ja nav izvēlēta īpašuma apdrošināšana', path: ['travelDateFrom'] });

const activityLabels = {
  winterSports: 'Ziemas sports',
  diving: 'Daivings',
  otherSports: 'Citas sporta aktivitātes',
  competitions: 'Sacensības / treniņi',
  extremeSports: 'Ekstrēmā sporta sacensības / treniņi',
  physicalWork: 'Fizisks darbs',
  propertyInsurance: 'Īpašuma apdrošināšana Latvijā',
};

export const TravelStep = () => {
  const { state, handleNext, setNextStepDisabled, setState } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: state.travel.firstName || '',
      lastName: state.travel.lastName || '',
      birthDate: state.travel.birthDate ? new Date(state.travel.birthDate) : undefined,
      winterSports: state.travel.winterSports || 'nē',
      diving: state.travel.diving || 'nē',
      otherSports: state.travel.otherSports || 'nē',
      competitions: state.travel.competitions || 'nē',
      extremeSports: state.travel.extremeSports || 'nē',
      physicalWork: state.travel.physicalWork || 'nē',
      propertyInsurance: state.travel.propertyInsurance || 'nē',
      travelDateFrom: state.travel.travelDateFrom ? new Date(state.travel.travelDateFrom) : undefined,
      travelDateTo: state.travel.travelDateTo ? new Date(state.travel.travelDateTo) : undefined,
    }
  });

  const { isValid } = form.formState;

  useEffect(() => {
    setNextStepDisabled(!isValid);
  }, [isValid, setNextStepDisabled]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setState((prev) => ({
       ...prev,
       travel: {
         ...prev.travel,
         ...values,
       }
      }));
    handleNext();
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl shadow-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl lg:text-4xl font-bold font-headline text-primary leading-tight">
            Apdrošinātās personas
          </CardTitle>
          <Button variant="link">Nākamā persona</Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="travel-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vārds</FormLabel>
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
                      <FormLabel>Uzvārds</FormLabel>
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
                    <FormLabel>Dzimšanas datums</FormLabel>
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
                              format(field.value, 'dd.MM.yyyy')
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                        name={key as keyof typeof activityLabels}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4">
                            <FormLabel className="font-normal">
                              {activityLabels[key as keyof typeof activityLabels]}
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
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
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ceļošanas laiks</Label>
                <div className="flex items-start gap-4">
                  <FormField
                    control={form.control}
                    name="travelDateFrom"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-1/2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, 'dd.MM.yyyy')
                                ) : (
                                  <span>No</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="travelDateTo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-1/2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, 'dd.MM.yyyy')
                                ) : (
                                  <span>Līdz</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
