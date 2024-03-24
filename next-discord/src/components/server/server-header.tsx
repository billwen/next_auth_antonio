"use client";

import {FC} from "react";
import {ServerWithMembersAndProfiles} from "@/types";
import {MemberRole} from "@prisma/client";


interface ServerHeaderProps {
  server: ServerWithMembersAndProfiles;
  role?: MemberRole;
}

export const ServerHeader: FC<ServerHeaderProps> = ({server, role}) => {
  return (
    <div>
      Server Header
    </div>
  );
};