"use client";

import {FC, ReactNode} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {AuthCardHeader} from "@/components/auth/auth-card-header";
import {SocialLoginFooter} from "@/components/auth/social-login-footer";
import {BackButton} from "@/components/auth/back-button";

interface CardWrapperProps {
  children: ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocials?: boolean;
};

export const CardWrapper: FC<CardWrapperProps> = ({
                                                    children,
                                                    headerLabel,
                                                    backButtonLabel,
                                                    backButtonHref,
                                                    showSocials
                                                  }) => {
  return (
    <Card className="w-[400px] shadow-card">
      <CardHeader>
        <AuthCardHeader label={headerLabel}/>
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>

      {/* Show social button */}
      {showSocials && (
        <CardFooter>
          <SocialLoginFooter/>
        </CardFooter>
      )}

      <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>

  );
};