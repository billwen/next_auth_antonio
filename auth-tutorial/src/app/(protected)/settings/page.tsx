"use client";

import {useSession, signOut} from "next-auth/react";
import {Button} from "@/components/ui/button";

const SettingsPage = () => {

  const session = useSession();

//  const role = session?.user?.role;
  const onClick = () => {
    console.log('Clicked sign out');
    signOut();
  }

  return (
    <div className="bg-white p-10 rounded-xl">
      {JSON.stringify(session, null, 2)}

      <form>
        <Button type="submit" onClick={onClick} variant="default">
          Logout
        </Button>
      </form>
    </div>
  );
};

export default SettingsPage;

