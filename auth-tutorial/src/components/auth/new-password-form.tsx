"use client";

import {useState, useTransition} from "react";
import {useSearchParams} from "next/navigation";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {NewPasswordSchema} from "@/schemas";
import {CardWrapper} from "@/components/auth/card-wrapper";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-sucess";
import {newPassword} from "@/actions/new-password";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ""
    }
  });

  const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    console.log(`Reset email ${JSON.stringify(data)}`);
    startTransition(async () => {
      const result = await newPassword(data, token);
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
    <CardWrapper headerLabel="Enter a new password" backButtonLabel="Back to login" backButtonHref="/auth/login"
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
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

          </div>

          <FormError message={error}/>

          <FormSuccess message={success}/>

          <Button type="submit" className="w-full" disabled={isPending}>
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
