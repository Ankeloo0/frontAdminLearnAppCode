import { BsBoxSeam } from "react-icons/bs";
import { FaUsers, FaBookOpen, FaListAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="bg-secondary flex items-center justify-between px-6 py-5">
        {/* Izquierda: icono + texto */}
        <div className="flex items-center gap-2">
          <BsBoxSeam
            className="text-green-600 shrink-0"
            size={20}
            style={{ width: 30, height: 30, minWidth: 30, minHeight: 30 }}
          />
          <h1 className="text-2xl text-white font-semibold">Administrador</h1>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-white cursor-pointer rounded-2xl transition hover:bg-green-600"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Contenido centrado */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="flex gap-6">
          {/* Usuarios */}
          <div
            onClick={() => navigate("/users")}
            className="cursor-pointer w-80 h-50 flex flex-col items-center justify-center 
                      bg-secondary text-white font-bold rounded-xl shadow-md 
                      transition transform hover:scale-105 hover:text-green-500"
          >
            <FaUsers
              size={40}
              className="mb-2 transition-transform duration-300 hover:scale-110"
            />
            <span className="transition-transform duration-300 hover:scale-110">
              Usuarios
            </span>
          </div>

          {/* Materias */}
          <div
            onClick={() => navigate("/subjects")}
            className="cursor-pointer w-80 h-50 flex flex-col items-center justify-center 
                        bg-secondary text-white font-bold rounded-xl shadow-md 
                        transition transform hover:scale-105 hover:text-green-500"
          >
            <FaBookOpen
              size={40}
              className="mb-2 transition-transform duration-300 hover:scale-110"
            />
            <span className="transition-transform duration-300 hover:scale-110">
              Materias
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
