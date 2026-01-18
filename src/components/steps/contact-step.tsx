'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { sendToBrokerAction } from '@/app/actions';
import { useAppContext } from '@/context/app-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactSchema } from '@/lib/schema';
import type { Contact } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { MailCheck } from 'lucide-react';

const initialState = {
  message: '',
};

export function ContactStep() {
  const { state, setState } = useAppContext();
  const [formState, formAction] = useFormState(sendToBrokerAction.bind(null, state), initialState);
  const { toast } = useToast();

  const form = useForm<Contact>({
    resolver: zodResolver(ContactSchema),
    defaultValues: state.contact,
  });

  useEffect(() => {
    if (formState.message && !formState.errors) {
      toast({
        title: "Pieteikums nosūtīts!",
        description: formState.message,
        variant: 'default',
        className: 'bg-primary text-primary-foreground border-primary'
      });
    } else if (formState.message && formState.errors) {
        toast({
            title: "Kļūda",
            description: formState.message,
            variant: 'destructive',
          });
    }
  }, [formState, toast]);

  useEffect(() => {
    const subscription = form.watch((value) => {
        setState(prev => ({...prev, contact: value as Contact}));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setState]);


  if (formState.message && !formState.errors) {
    return (
        <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg">
        <CardHeader className="text-center">
            <MailCheck className="mx-auto h-16 w-16 text-primary" />
          <CardTitle className="text-3xl font-headline">Paldies!</CardTitle>
          <CardDescription className='text-base'>{formState.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }


  return (
    <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Gandrīz pabeigts!</CardTitle>
        <CardDescription>Lūdzu, ievadiet savu kontaktinformāciju, lai mēs varētu sagatavot Jums piedāvājumu.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} id="contact-form" className='space-y-6'>
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vārds, uzvārds</FormLabel>
                            <FormControl>
                                <Input placeholder="Jānis Bērziņš" {...field} />
                            </FormControl>
                            <FormMessage>{formState.errors?.name}</FormMessage>
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
                                <Input type="email" placeholder="janis.berzins@example.com" {...field} />
                            </FormControl>
                            <FormMessage>{formState.errors?.email}</FormMessage>
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
                                <Input placeholder="+371 20000000" {...field} />
                            </FormControl>
                            <FormMessage>{formState.errors?.phone}</FormMessage>
                        </FormItem>
                    )}
                />
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
