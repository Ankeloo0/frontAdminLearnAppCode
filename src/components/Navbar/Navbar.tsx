import React from "react";
import { BsBoxSeam } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  title: string;
  backRoute: string; // 👈 nueva prop para la ruta
}

function Navbar({ title, backRoute }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-secondary flex items-center justify-between px-6 py-5">
      {/* Izquierda: icono + título */}
      <div className="flex items-center gap-2">
        <BsBoxSeam
          className="text-green-600 shrink-0"
          size={20}
          style={{ width: 30, height: 30, minWidth: 30, minHeight: 30 }}
        />
        <h1 className="text-2xl text-white font-semibold">{title}</h1>
      </div>

      {/* Derecha: botón regresar */}
      <button
        onClick={() => navigate(backRoute)} // 👈 usa la ruta pasada por props
        className="p-2 text-white cursor-pointer rounded-2xl transition hover:bg-green-600"
      >
        Regresar
      </button>
    </div>
  );
}

export default Navbar;
