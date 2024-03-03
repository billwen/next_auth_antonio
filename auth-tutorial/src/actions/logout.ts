"use server";

import {signOut} from "@/auth";

export const logout = async () => {
  // Some serve actions
  
  await signOut();
};
