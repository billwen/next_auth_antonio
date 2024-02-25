"use client";

import {useState, useTransition} from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {useSearchParams} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";

import {LoginSchema} from "@/schemas";
import {CardWrapper} from "@/components/auth/card-wrapper";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-sucess";
import {login} from "@/actions/login";


export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Your account is not linked with any social account." : undefined;

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      const result = await login(data);
      if ("error" in result) {
        setError(result.error);
        setSuccess(undefined);
      } else {
        setError(undefined);
        setSuccess(result.success);
      }
    });

  };

  return (
    <CardWrapper headerLabel="Welcome back" backButtonLabel="Don't have an account?" backButtonHref="/auth/register"
                 showSocials>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="john.doe@example.com" type="email"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="******" type="password"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          <FormError message={error || urlError}/>

          <FormSuccess message={success}/>

          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
