import { useEffect, useRef, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../../contexts/AuthContext";

import { signOut } from "firebase/auth";
import { auth } from "../../../services/firebaseConnection";

import { NavLink } from "./link";

import { FiUser, FiLogOut } from "react-icons/fi";
import { FaHouse } from "react-icons/fa6";
import { AiFillDashboard, AiOutlinePlus } from "react-icons/ai";

export function Navbar() {
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();

  const menuRef = useRef<HTMLDivElement | null>(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [isActive]);

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  function handleActive() {
    setIsActive((prev) => !prev);
  }

  function handleMouseEnter() {
    setIsActive(true);
  }

  function handleMouseLeave() {
    setIsActive(false);
  }

  return (
    <nav className="relative inline-block hover:block" ref={menuRef}>
      <div
        onClick={handleActive}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex cursor-pointer items-center gap-2 min-[376px]:gap-3"
      >
        <span className="font-medium min-[376px]:text-base hidden min-[376px]:block">
          {user?.name}
        </span>
        <button className="rounded-full border-2 border-gray-900 p-1 duration-100 active:scale-105">
          <FiUser size={22} color="#000" />
        </button>
      </div>

      <ul
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`absolute right-[0px] flex min-w-[160px] flex-col rounded-lg bg-gray-100 shadow-md ${
          isActive
            ? "visible translate-y-[0] opacity-[1] transition-all ease-linear"
            : "invisible translate-y-[-20px] opacity-[0] transition-all ease-linear"
        }`}
      >
        <NavLink to="/" onClick={handleActive}>
          <FaHouse size={22} />
          Home
        </NavLink>

        <NavLink to="/dashboard" onClick={handleActive}>
          <AiFillDashboard size={22} />
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/new" onClick={handleActive}>
          <AiOutlinePlus size={22} />
          Cadastrar carro
        </NavLink>

        <button
          className="flex items-center justify-center gap-2 rounded-lg border-t-[1px] border-gray-300 px-2 py-4 font-medium transition-colors hover:bg-red-500 hover:text-white"
          onClick={handleLogout}
        >
          <FiLogOut size={22} />
          Sair
        </button>
      </ul>
    </nav>
  );
}
