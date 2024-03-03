"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {RoleGate} from "@/components/auth/role-gate";
import {UserRole} from "@prisma/client";
import {FormSuccess} from "@/components/form-sucess";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {admin} from "@/actions/admin";

const AdminPage = () => {

  const onApiRouteClick = () => {
    fetch("/api/admin")
      .then((response) => {
        if (response.ok) {
          toast.success("Allowed API Route");
        } else {
          toast.error("API Access is denied.")
        }
      });
  };

  const onServerActionClick = () => {
    admin().then(value => {
      if (value.error ) {
        toast.error(value.error as string);
        return;
      }

      toast.success(value.success as string);
      return;
    });
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Admin
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin only api route
          </p>
          <Button onClick={onApiRouteClick}>
            Click to test
          </Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin only server actions
          </p>
          <Button onClick={onServerActionClick}>
            Click to test
          </Button>
        </div>

      </CardContent>

    </Card>
  );
};

export default AdminPage;
