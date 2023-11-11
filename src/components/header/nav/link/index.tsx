import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: ReactNode;
  onClick: () => void;
}

export function NavLink({ to, children, onClick }: NavLinkProps) {
  return (
    <div>
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center justify-center gap-2  rounded-lg border-t-[1px] border-gray-300 px-2 py-4 font-medium transition-colors hover:bg-red-500 hover:text-white"
      >
        {children}
      </Link>
    </div>
  );
}
