import {Navbar} from "@/app/(protected)/_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({children}: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center bg-sky-300 py-6">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
