import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { FaEdit, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";

interface Subtopic {
  _id?: string;
  title: string;
  content: string;
  examples: string[];
}
interface LocationState {
  subjectId: string;
  topicTitle: string;
  topicNumber: number;
}

function Subtopics() {
  const { topicId } = useParams(); // viene de la ruta /subtopics/:topicId
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editSubtopic, setEditSubtopic] = useState<Subtopic | null>(null);
  const location = useLocation();
  const subjectId = (location.state as LocationState | undefined)?.subjectId;
  const topicTitle = (location.state as LocationState | undefined)?.topicTitle || "";
  const topicNumber = (location.state as LocationState | undefined)?.topicNumber || 0;
  const [newSubtopic, setNewSubtopic] = useState<Subtopic>({
  title: "",
  content: "",
  examples: [""],
});


  useEffect(() => {
    refreshSubtopics();
  }, [topicId]);

  const refreshSubtopics = async () => {
    const token = localStorage.getItem("token");
    try {
      const updated = await axios.get(
        `https://applearncodeapi.onrender.com/api/content/getSubtopicsByTopic/${topicId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubtopics(updated.data);
    } catch (err) {
      console.error("Error obteniendo subtemas:", err);
    }
  };

    const handleCreateSubtopic = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
            `https://applearncodeapi.onrender.com/api/admin/subtopics/${topicId}`,
            {
                title: newSubtopic.title,
                content: newSubtopic.content,
                examples: newSubtopic.examples,
                requiresExercise: false,
            },
            { headers: { Authorization: `Bearer ${token}` } }
            );

            await refreshSubtopics();
            setShowModal(false);
            setNewSubtopic({ title: "", content: "", examples: [""] });
        } catch (err: any) {
            console.error("Error creando subtema:", err?.response?.data || err);
        }
    };



  const handleDelete = async (subtopicId: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:4000/api/content/deleteSubtopic/${subtopicId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshSubtopics();
    } catch (err) {
      console.error("Error eliminando subtema:", err);
    }
  };

    const handleUpdateSubtopic = async () => {
    if (!editSubtopic?._id) return;
    const token = localStorage.getItem("token");
    try {
        await axios.put(
        `http://localhost:4000/api/admin/subtopics/${editSubtopic._id}`,
        {
            title: editSubtopic.title,
            content: editSubtopic.content,
            examples: editSubtopic.examples,
            requiresExercise: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
        );

        await refreshSubtopics();
        setEditSubtopic(null);
    } catch (err: any) {
        console.error("Error actualizando subtema:", err?.response?.data || err);
    }
    };



  return (
    <>
      <Navbar
        title={`Subtemas de: ${topicTitle}`}
        backRoute={subjectId ? `/topics/${subjectId}` : "/topics"}
      />

      <div className="p-6 px-30">
        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer mb-4 px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition"
        >
          Agregar Subtema
        </button>

        {/* Tabla */}
        <table className="w-full border-collapse rounded-2xl overflow-hidden">
            <thead>
                <tr className="bg-secondary text-white">
                  <th className="p-3 text-left">No.</th>
                <th className="p-3 text-left">Título</th>
                <th className="p-3 text-left">Contenido</th>
                <th className="p-3 text-left">Ejemplo</th>
                <th className="p-3 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
              {subtopics.map((s, i) => (
                <tr key={s._id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors">
                  <td className="p-3">{`${topicNumber}.${i + 1}`}</td>
                  <td className="p-3">{s.title}</td>
                  <td className="p-3">{s.content}</td>
                  <td className="p-3 whitespace-pre-wrap">{s.examples[0]}</td>
                  <td className="p-3 flex justify-center gap-5">
                    <button
                      className="text-blue-700 text-xl hover:scale-125"
                      onClick={() => setEditSubtopic(s)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-700 text-xl hover:scale-125"
                      onClick={() => setConfirmDeleteId(s._id!)}
                    >
                      <FaTimes />
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
            <h2 className="text-xl font-bold mb-4">Agregar Subtema</h2>
            <input
                type="text"
                placeholder="Título"
                value={newSubtopic.title}
                onChange={(e) =>
                    setNewSubtopic({ ...newSubtopic, title: e.target.value })
                }
                className="input-box mb-5 border-none bg-gray-200"
            />
            <textarea
                placeholder="Contenido"
                value={newSubtopic.content}
                onChange={(e) =>
                    setNewSubtopic({ ...newSubtopic, content: e.target.value })
                }
                rows={4}
                className="input-box mb-5 border-none bg-gray-200 resize-none"
            />
            <textarea
                placeholder="Ejemplo"
                value={newSubtopic.examples[0]}
                onChange={(e) =>
                    setNewSubtopic({ ...newSubtopic, examples: [e.target.value] })
                }
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
                onClick={handleCreateSubtopic}
                className="px-4 py-2 bg-green-600 text-white rounded-2xl cursor-pointer hover:bg-green-700 transition"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que quieres eliminar este subtema?
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
      {editSubtopic && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Editar Subtema</h2>
            <div>
              <input
                type="text"
                placeholder="Título"
                value={editSubtopic.title}
                onChange={(e) =>
                    setEditSubtopic({ ...editSubtopic, title: e.target.value })
                }
                className="input-box mb-5 border-none bg-gray-200"
            />
             <textarea
                placeholder="Contenido"
                value={editSubtopic.content}
                onChange={(e) =>
                    setEditSubtopic({ ...editSubtopic, content: e.target.value })
                }
                rows={4}
                className="input-box mb-5 border-none bg-gray-200 resize-none"
            />
            <textarea
                placeholder="Ejemplo"
                value={editSubtopic.examples[0]}
                onChange={(e) =>
                    setEditSubtopic({ ...editSubtopic, examples: [e.target.value] })
                }
                rows={4}
                className="input-box mb-5 border-none bg-gray-200 resize-none"
            />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditSubtopic(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-2xl cursor-pointer hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateSubtopic}
                  className="px-4 py-2 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-700 transition"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Subtopics;