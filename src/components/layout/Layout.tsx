import type { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
  showHeader?: boolean;
};

const Layout = ({ children, showHeader = true }: Props) => {
  return (
    <div className="min-h-screen bg-dark-950">
      {showHeader && <Header />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
