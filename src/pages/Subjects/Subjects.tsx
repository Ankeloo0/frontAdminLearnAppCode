import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { FaEdit, FaTimes, FaBook } from "react-icons/fa";
import CreateSubject from "./CreateSubject";
import UpdateSubject from "./UpdateSubject";
import { useNavigate } from "react-router-dom";

interface Subject {
  _id?: string;
  name: string;
  description: string;
}


function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [newSubject, setNewSubject] = useState<Subject>({
    name: "",
    description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://applearncodeapi.onrender.com/api/admin/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Error obteniendo materias:", err));
  }, []);

  const refreshSubjects = async () => {
    const token = localStorage.getItem("token");
    const updated = await axios.get("https://applearncodeapi.onrender.com/api/admin/subjects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSubjects(updated.data);
  };

  const handleCreateSubject = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("https://applearncodeapi.onrender.com/api/admin/subjects", newSubject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshSubjects();
      setShowModal(false);
      setNewSubject({ name: "", description: "" });
    } catch (err) {
      console.error("Error creando materia:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://applearncodeapi.onrender.com/api/admin/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshSubjects();
    } catch (err) {
      console.error("Error eliminando materia:", err);
    }
  };

  const handleUpdateSubject = async () => {
    if (!editSubject?._id) return;
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://applearncodeapi.onrender.com/api/admin/subjects/${editSubject._id}`,
        {
          name: editSubject.name,
          description: editSubject.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshSubjects();
      setEditSubject(null);
    } catch (err) {
      console.error("Error actualizando materia:", err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setNewSubject({ ...newSubject, [field]: value });
  };

  return (
    <>
      <Navbar title="Materias" backRoute="/home"/>

      <div className="p-6 px-30">
        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer mb-4 px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition"
        >
          Agregar Materia
        </button>

        {/* Tabla */}
        <table className="w-full border-collapse rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-secondary text-white">
              <th className="p-3 text-left">No.</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-center">Acciones</th>
              <th className="p-3 text-center">Temas</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, i) => (
              <tr
                key={s._id}
                className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.description}</td>

                {/* Acciones */}
                <td className="p-3">
                  <div className="flex justify-center gap-5">
                    <button
                      className="text-blue-700 text-xl hover:scale-125"
                      onClick={() => setEditSubject(s)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-700 text-xl hover:scale-125"
                      onClick={() => setConfirmDeleteId(s._id!)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </td>

                {/* Temas */}
                <td className="p-3 text-center">
                  <button
                    className="text-green-600 text-xl hover:scale-125"
                    onClick={() => navigate(`/topics/${s._id}`, { state: { subjectName: s.name } })}
                  >
                    <FaBook />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de creación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Agregar Materia</h2>
            <CreateSubject
              name={newSubject.name}
              description={newSubject.description}
              onChange={handleChange}
              onSubmit={handleCreateSubject}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que quieres eliminar esta materia?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-2xl cursor-pointer hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (confirmDeleteId) {
                    await handleDelete(confirmDeleteId);
                  }
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-2xl cursor-pointer hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editSubject && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Editar Materia</h2>
            <UpdateSubject
              name={editSubject.name}
              description={editSubject.description}
              onChange={(field, value) =>
                setEditSubject({ ...editSubject, [field]: value } as Subject)
              }
              onSubmit={handleUpdateSubject}
              onCancel={() => setEditSubject(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Subjects;
