"use client";

import React, {FC, ReactNode} from "react";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

export const LoginButton: FC<LoginButtonProps> = ({ children, mode = "redirect", asChild = false }) => {

  const router = useRouter();

  const onClick = () => {
    if (mode == "redirect") {
      router.push("/auth/login");
      return;
    }

  };

  if (mode == "modal") {
    return (
      <span>
        <p>TODO: Not implemented yet!</p>
        {children}
      </span>
    );
  }

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};

