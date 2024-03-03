"use client";

import {useState, useTransition} from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
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
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Your account is not linked with any social account." : undefined;

  const [showTwoFactor, setShowTwoFactor] = useState(false);
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
    setShowTwoFactor(false);

    startTransition(async () => {
      try {
        const result = await login(data, callbackUrl);
        if ("error" in result) {
          form.reset();
          setError(result.error);
          setSuccess(undefined);
          return;
        }

        if ("success" in result) {
          form.reset();
          setError(undefined);
          setSuccess(result.success);
          return;
        }

        if (result?.twoFactor) {
          setShowTwoFactor(true);
        }
      } catch (error) {
        console.log({error});
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
            { !showTwoFactor && (
              <>
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
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Button variant="link" size="sm" asChild className="px-0 font-normal">
                          <Link href="/auth/reset">forgot password?</Link>
                        </Button>
                      </div>

                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="******" type="password"/>
                      </FormControl>

                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </>
            )}

            { showTwoFactor && (
              <FormField
              control={form.control}
            name="code"
            render={({field}) => (
              <FormItem>
                <FormLabel htmlFor="code">Two Factor Code</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="123456" type="text"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
            )}
          </div>

          <FormError message={error || urlError}/>

          <FormSuccess message={success}/>

          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
