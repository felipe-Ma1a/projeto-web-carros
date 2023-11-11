import { Link } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { Navbar } from "./nav";

import { FiLogIn } from "react-icons/fi";

import logoImg from "../../assets/logo.svg";

export function Header() {
  const { signed, loadingAuth } = useContext(AuthContext);

  return (
    <div className="relative z-[999] mb-4 flex h-16 w-full items-center justify-center bg-white drop-shadow">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
        <Link to="/">
          <img src={logoImg} alt="Logo do site" />
        </Link>

        {!loadingAuth && signed && <Navbar />}

        {!loadingAuth && !signed && (
          <Link to="/login">
            <div className="flex items-center gap-2 rounded-lg border-gray-900 bg-red-500 px-3 py-2 font-bold text-white transition-colors hover:bg-red-400">
              <FiLogIn size={22} color="#fff" /> <p>Entrar</p>
            </div>
          </Link>
        )}
      </header>
    </div>
  );
}
