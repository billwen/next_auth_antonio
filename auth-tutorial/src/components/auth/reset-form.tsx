"use client";

import {useState, useTransition} from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {ResetSchema} from "@/schemas";
import {CardWrapper} from "@/components/auth/card-wrapper";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-sucess";
import {reset} from "@/actions/reset";



export const ResetForm = () => {

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = (data: z.infer<typeof ResetSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    console.log(`Reset email ${JSON.stringify(data)}`);
    startTransition(async () => {
      const result = await reset(data);
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
    <CardWrapper headerLabel="Forgot your password" backButtonLabel="Back to login" backButtonHref="/auth/login"
                 >
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

          </div>

          <FormError message={error}/>

          <FormSuccess message={success}/>

          <Button type="submit" className="w-full" disabled={isPending}>
            Sent reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
