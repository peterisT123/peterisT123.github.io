'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAppContext } from "@/context/app-context";
import { ContactSchema } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function ContactStep() {
  const { state, setState } = useAppContext();

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: state.contact,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setState(prevState => ({
        ...prevState,
        contact: {
            ...prevState.contact,
            [name]: type === 'checkbox' ? checked : value
        }
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">Jūsu kontaktinformācija</CardTitle>
        <CardDescription>Solis 4 no 4. Gandrīz pabeigts!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vārds, uzvārds</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => { field.onChange(e); handleInputChange(e); }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-pasts</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} onChange={(e) => { field.onChange(e); handleInputChange(e); }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tālrunis</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => { field.onChange(e); handleInputChange(e); }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(checked) => { field.onChange(checked); handleInputChange({ target: { name: 'consent', checked } } as any); }} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                        Piekrītu, ka mani dati tiek apstrādāti saskaņā ar privātuma politiku.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
