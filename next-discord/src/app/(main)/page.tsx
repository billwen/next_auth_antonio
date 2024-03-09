import {Button} from "@/components/ui/button";
import {UserButton} from "@clerk/nextjs";
import {ModeToggle} from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col space-y-6 items-center justify-center">
      <UserButton afterSignOutUrl="/" />
      <Button>Click me</Button>
      <ModeToggle />
    </main>
  );
}
