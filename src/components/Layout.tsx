
import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t py-6">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Codify&Quiz - Learn by Doing
        </div>
      </footer>
    </div>
  );
};

export default Layout;
