"use client";

import React, {FC, ReactNode} from "react";
import {useRouter} from "next/navigation";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {LoginForm} from "@/components/auth/login-form";

interface LoginButtonProps {
  children: ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

export const LoginButton: FC<LoginButtonProps> = ({ children, mode = "redirect", asChild = false }) => {

  const router = useRouter();

  const onClick = () => {
    console.log(`Click login`);
    if (mode == "redirect") {
      router.push("/auth/login");
      return;
    }

  };

  if (mode == "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>
          {children}
        </DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm/>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span className="cursor-pointer" onClick={() => {
      onClick();
    }}>
      {children}
    </span>
  );
};

