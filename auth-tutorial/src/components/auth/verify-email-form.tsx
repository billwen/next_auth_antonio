"use client";

import {BeatLoader} from "react-spinners";
import {useSearchParams} from "next/navigation";

import {CardWrapper} from "@/components/auth/card-wrapper";
import {useCallback, useEffect, useState} from "react";
import {verifyEmail} from "@/actions/verify-email";
import {FormSuccess} from "@/components/form-sucess";
import {FormError} from "@/components/form-error";

export const VerifyEmailForm = () => {

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError("Missing token");
      return;
    }

    try {
      const result = await verifyEmail(token || '');
      if (result.error) {
        setError(result.error);
      }

      if (result.success) {
        setSuccess(result.success);
      }
    } catch (error) {
      // @ts-ignore
      setError(error?.message ?? error);
    }


  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col items-center justify-center w-full gap-y-12">
        {!success && !error && <BeatLoader/>}

        <FormSuccess message={success}/>
        <FormError message={error}/>
      </div>

    </CardWrapper>
  );
};
