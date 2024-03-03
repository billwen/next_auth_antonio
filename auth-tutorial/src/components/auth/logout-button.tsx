"use client";

import {FC, ReactNode} from "react";
import {logout} from "@/actions/logout";

interface LogoutButtonProps {
  children: ReactNode
}

export const LogoutButton: FC<LogoutButtonProps> = ({children}) => {

  const onclick = async () => {
    await logout();
  }
  return (
    <span onClick={onclick} className="cursor-pointer">
      {children}
    </span>
  );
};
