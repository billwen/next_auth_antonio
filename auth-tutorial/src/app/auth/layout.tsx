import {FC, ReactNode} from "react";

interface AuthLayoutProps {
  children: ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({children}) => {
  return (
    <div
      className="h-full flex items-center justify-center bg-sky-500 bg-[radial-gradient(ellipse_at_top, _var(--tw-gradient-stops))] bg-sky-500 from-sky-400 to-blue-800">
      {children}
    </div>
  );
};

export default AuthLayout;
