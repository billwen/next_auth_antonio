"use client";

import {useSession, signOut} from "next-auth/react";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {settings} from "@/actions/settings";
import {useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {SettingsSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-sucess";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UserRole} from "@prisma/client";
import {Switch} from "@/components/ui/switch";

const SettingsPage = () => {

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const {update, data} = useSession();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: data?.user?.name || undefined,
      email: data?.user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: data?.user?.role || undefined,
      isTwoFactorEnabled: data?.user?.isTwoFactorEnabled || false
    }
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      setError(undefined);
      setSuccess(undefined);

      settings(values)
        .then((data) => {
          console.log({submitResult: data});
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            setSuccess(data.success);
            update();
          }
          return;
        })
        .catch(() => {
          setError('Something went wrong');
        });
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Settings
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField control={form.control} name="name" render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your name" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {!data?.user?.isOAuth && (
                <>
                  <FormField control={form.control} name="email" render={({field}) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="john.doe@example.com" disabled={isPending} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="password" render={({field}) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="******" disabled={isPending} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="newPassword" render={({field}) => (
                    <FormItem>
                      <FormLabel htmlFor="name">New password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="******" disabled={isPending} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </>

              )}

              <FormField control={form.control} name="role" render={({field}) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>
                        Admin
                      </SelectItem>
                      <SelectItem value={UserRole.USER}>
                        User
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {!data?.user?.isOAuth && (
                <FormField control={form.control} name="isTwoFactorEnabled" render={({field}) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel htmlFor="isTwoFactorEnabled">Enable 2FA</FormLabel>
                      <FormDescription>
                        Enable two factor authentication for your account
                      </FormDescription>
                    </div>

                    <FormControl>
                      <Switch disabled={isPending} checked={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button type="submit">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;

