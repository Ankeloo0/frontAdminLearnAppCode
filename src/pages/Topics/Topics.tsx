import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Subject {
  _id?: string;
  name: string;
  description: string;
}

function Topics() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://applearncodeapi.onrender.com/api/admin/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Error obteniendo materias:", err));
  }, []);

  return (
    <>
      <Navbar title="Temas" backRoute="/home" />

      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Materias disponibles</h2>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subjects.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/topics/${s._id}`)} // 👈 redirige al detalle
              className="cursor-pointer w-full h-48 flex flex-col items-center justify-center 
                         border-5 border-gray-400 rounded-xl shadow-sm 
                         bg-gray-100 text-gray-600 font-semibold 
                         transition transform hover:scale-105 hover:border-green-500 hover:text-green-600"
            >
              <FaBookOpen
                size={40}
                className="mb-2 transition-transform duration-300 hover:scale-110"
              />
              <span className="text-lg transition-transform duration-300 hover:scale-110">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Topics;
