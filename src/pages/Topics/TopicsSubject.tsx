import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaEdit, FaTimes, FaList } from "react-icons/fa";
interface Topic {
  _id?: string;
  title: string;
  description: string;
}

interface LocationState {
  subjectName: string;
}

function TopicsSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [subjectName, setSubjectName] = useState<string>("");

  useEffect(() => {
    // Si viene en state, úsalo
    const stateName = (location.state as LocationState | undefined)?.subjectName;
    if (stateName) {
      setSubjectName(stateName);
      localStorage.setItem("subjectName", stateName); // guardamos para futuros regresos
    } else {
      // Si no viene en state, intenta recuperar de localStorage
      const savedName = localStorage.getItem("subjectName");
      if (savedName) setSubjectName(savedName);
    }
  }, [location.state]);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [newTopic, setNewTopic] = useState<Topic>({
    title: "",
    description: "",
  });

  useEffect(() => {
    refreshTopics();
  }, [id]);

  const refreshTopics = async () => {
    const token = localStorage.getItem("token");
    try {
      const updated = await axios.get(
        `https://applearncodeapi.onrender.com/api/content/getTopicsBySubject/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTopics(updated.data);
    } catch (err) {
      console.error("Error obteniendo temas:", err);
    }
  };

  const handleCreateTopic = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `https://applearncodeapi.onrender.com/api/admin/topics/${id}`, // 👈 subjectId en la URL
        {
            title: newTopic.title,
            description: newTopic.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
      await refreshTopics();
      setShowModal(false);
      setNewTopic({ title: "", description: "" });
    } catch (err) {
      console.error("Error creando tema:", err);
    }
  };

  const handleDelete = async (topicId: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://applearncodeapi.onrender.com/api/admin/topics/${topicId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

      await refreshTopics();
    } catch (err) {
      console.error("Error eliminando tema:", err);
    }
  };

  const handleUpdateTopic = async () => {
    if (!editTopic?._id) return;
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://applearncodeapi.onrender.com/api/content/updateTopic/${editTopic._id}`,
        {
          title: editTopic.title,
          description: editTopic.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshTopics();
      setEditTopic(null);
    } catch (err) {
      console.error("Error actualizando tema:", err);
    }
  };

  return (
    <>
      <Navbar title={`Temas de: ${subjectName}`} backRoute="/subjects" />

      <div className="p-6 px-30">
        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer mb-4 px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition"
        >
          Agregar Tema
        </button>

        {/* Tabla */}
        <table className="w-full border-collapse rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-secondary text-white">
              <th className="p-3 text-left">No.</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-center">Acciones</th>
              <th className="p-3 text-center">Subtemas</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((t, i) => (
              <tr
                key={t._id}
                className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{t.title}</td>
                <td className="p-3">{t.description}</td>
                <td className="p-3 flex justify-center gap-5">
                  <button
                    className="text-blue-700 text-xl hover:scale-125"
                    onClick={() => setEditTopic(t)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-700 text-xl hover:scale-125"
                    onClick={() => setConfirmDeleteId(t._id!)}
                  >
                    <FaTimes />
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    className="text-green-600 text-xl hover:scale-125"
                    onClick={() =>
                      navigate(`/subtopics/${t._id}`, {
                        state: { subjectId: id, topicTitle: t.title, topicNumber: i + 1 },
                      })
                    }
                  >
                    <FaList />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ... tus modales de creación, edición y eliminación se quedan igual */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Agregar Tema</h2>
            <input
                type="text"
                placeholder="Título"
                value={newTopic.title}
                onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                className="input-box mb-5 border-none bg-gray-200"
            />
            <textarea
                placeholder="Descripción"
                value={newTopic.description}
                onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                rows={4}
                className="input-box mb-5 border-none bg-gray-200 resize-none"
            />

            <div className="flex justify-end gap-3">
                <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-2xl cursor-pointer hover:bg-gray-500 transition"
                >
                Cancelar
                </button>
                <button
                onClick={handleCreateTopic} // 👈 aquí sí se llama
                className="px-4 py-2 bg-green-600 text-white rounded-2xl cursor-pointer hover:bg-green-700 transition"
                >
                Crear
                </button>
            </div>
            </div>
        </div>
        )}

        {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
            <p className="mb-6 text-gray-700">
                ¿Estás seguro de que quieres eliminar este tema?
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
                    await handleDelete(confirmDeleteId); // 👈 aquí sí se llama
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
        {editTopic && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Editar Tema</h2>
                <input
                    type="text"
                    placeholder="Título"
                    value={editTopic.title}
                    onChange={(e) =>
                    setEditTopic({ ...editTopic, title: e.target.value })
                    }
                    className="input-box mb-5 border-none bg-gray-200"
                />
                <textarea
                    placeholder="Descripción"
                    value={editTopic.description}
                    onChange={(e) =>
                    setEditTopic({ ...editTopic, description: e.target.value })
                    }
                    rows={4}
                    className="input-box mb-5 border-none bg-gray-200 resize-none"
                />

                <div className="flex justify-end gap-3">
                    <button
                    onClick={() => setEditTopic(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-2xl cursor-pointer hover:bg-gray-500 transition"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleUpdateTopic} // 👈 aquí sí se llama
                    className="px-4 py-2 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-700 transition"
                    >
                    Guardar cambios
                    </button>
                </div>
                </div>
            </div>
        )}

    </>
  );
}

export default TopicsSubject;
