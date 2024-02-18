"use client";

import React, {FC} from "react";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import {Button} from "@/components/ui/button";

export const SocialLoginFooter: FC = () => {
  const onClickGoogleLogin = () => {
  };
  const onClickGithubLogin = () => {
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="outline" onClick={onClickGoogleLogin}>
        <FcGoogle className="h-5 w-5"/>
      </Button>

      <Button size="lg" className="w-full" variant="outline" onClick={onClickGithubLogin}>
        <FaGithub className="h-5 w-5"/>
      </Button>
    </div>
  );
};
