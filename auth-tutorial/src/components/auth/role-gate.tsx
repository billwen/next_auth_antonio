"use client";

import {FC, ReactNode} from "react";
import {UserRole} from "@prisma/client";
import {useCurrentRole} from "@/hooks/use-current-role";
import {FormError} from "@/components/form-error";

interface RoleGateProp {
  children: ReactNode;
  allowedRole: UserRole;
}
export const RoleGate: FC<RoleGateProp> = ({children, allowedRole}) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }
  return (
    <>
      {children}
    </>
  );
};
