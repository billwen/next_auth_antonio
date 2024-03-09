import Image from "next/image";
import {Button} from "@/components/ui/button";
import {UserButton} from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <UserButton afterSignOutUrl="/" />
      <Button>Click me</Button>
    </main>
  );
}
