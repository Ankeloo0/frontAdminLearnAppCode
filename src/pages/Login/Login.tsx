import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validEmail } from "../../utils/helper";
import { BsBoxSeam } from "react-icons/bs";

interface LoginResponse {
  token: string;
  role: string;
  error?: string;
}

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validEmail(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }
    if (!password) {
      setError("Por favor ingresa una contraseña");
      return;
    }

    setError(null);

    try {
      // 🚨 Usamos la ruta exclusiva para admins
      const response = await fetch("https://applearncodeapi.onrender.com/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setError(data.error || "Error en el login");
        return;
      }

      // El backend ya valida el rol, así que no necesitas checarlo aquí
      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-110 border rounded-2xl bg-secondary px-25 py-20 border-none shadow-2xl">
        <form onSubmit={handleLogin}>
          <div className="flex items-center justify-center gap-3 pb-10">
            <BsBoxSeam
              className="text-green-600 shrink-0"
              size={40}
              style={{ width: 40, height: 40, minWidth: 40, minHeight: 40 }}
            />
            <h1 className="text-3xl text-white font-semibold">Administrador</h1>
          </div>
          <div className="flex justify-center mb-10">
            <h2 className="text-center text-white font-semibold border-b-2 border-green-600 inline-block">
              SIGN IN
            </h2>
          </div>

          <input
            type="text"
            placeholder="Email"
            className="input-box mb-5 border-none bg-gray-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

          <button
            type="submit"
            className="btn-primary mt-10 font-semibold text-base"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
