import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { FaEdit, FaTimes, FaEye } from "react-icons/fa";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";

interface User {
  _id?: string;
  email: string;
  password?: string;
  username: string;
  role: "user" | "admin";
  level?: number;
  score?: number;          // 👈 AÑADIDO
  createdAt?: string;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    email: "",
    password: "",
    username: "",
    role: "user",
  });

  // ================================================================
  // 🔹 Cargar usuarios con SCORE
  // ================================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://applearncodeapi.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error obteniendo usuarios:", err));
  }, []);

  // ================================================================
  // 🔹 CREAR USUARIO
  // ================================================================
  const handleCreateUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const payload = { ...newUser, confirm: true, level: 1 };

      await axios.post("https://applearncodeapi.onrender.com/api/admin/users", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = await axios.get("https://applearncodeapi.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(updated.data);
      setShowModal(false);
      setNewUser({ email: "", password: "", username: "", role: "user" });
    } catch (err) {
      console.error("Error creando usuario:", err);
    }
  };

  // ================================================================
  // 🔹 ELIMINAR USUARIO
  // ================================================================
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://applearncodeapi.onrender.com/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = await axios.get("https://applearncodeapi.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(updated.data);
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    }
  };

  // ================================================================
  // 🔹 ACTUALIZAR USUARIO
  // ================================================================
  const handleUpdateUser = async () => {
    if (!editUser?._id) return;
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://applearncodeapi.onrender.com/api/admin/users/${editUser._id}`,
        editUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = await axios.get("https://applearncodeapi.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(updated.data);
      setEditUser(null);
    } catch (err) {
      console.error("Error actualizando usuario:", err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };

  // ================================================================
  // 🔹 RENDER
  // ================================================================
  return (
    <>
      <Navbar title="Usuarios" backRoute="/home" />

      <div className="p-6 px-30">
        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer mb-4 px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition"
        >
          Agregar Usuario
        </button>

        <table className="w-full border-collapse rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-secondary text-white">
              <th className="p-3 text-left">No.</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr
                key={u._id}
                className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.score ?? 0}</td>

                <td className="p-3 flex justify-center gap-5">
                  <button
                    className="text-blue-700 text-xl hover:scale-125"
                    onClick={() => setEditUser(u)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="text-red-700 text-xl hover:scale-125"
                    onClick={() => setConfirmDeleteId(u._id!)}
                  >
                    <FaTimes />
                  </button>

                  <button
                    className="text-green-600 text-xl hover:scale-125"
                    onClick={() => setViewUser(u)}
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Crear usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Agregar Usuario</h2>

            <CreateUser
              email={newUser.email}
              username={newUser.username}
              password={newUser.password ?? ""}
              role={newUser.role}
              onChange={handleChange}
              onSubmit={handleCreateUser}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* Confirmar eliminación */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>

            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que quieres eliminar este usuario?
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
                  await handleDelete(confirmDeleteId);
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

      {/* Editar usuario */}
      {editUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>

            <UpdateUser
              email={editUser.email}
              username={editUser.username}
              password={editUser.password ?? ""}
              role={editUser.role}
              onChange={(field, value) =>
                setEditUser({ ...editUser, [field]: value })
              }
              onSubmit={handleUpdateUser}
              onCancel={() => setEditUser(null)}
            />
          </div>
        </div>
      )}

      {/* Ver usuario */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 shadow-lg w-96 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Información del Usuario</h2>

            <p><strong>Email:</strong> {viewUser.email}</p>
            <p><strong>Username:</strong> {viewUser.username}</p>
            <p><strong>Score:</strong> {viewUser.score ?? 0}</p> {/* 👈 AÑADIDO */}
            <p><strong>Role:</strong> {viewUser.role}</p>
            <p><strong>Creado el:</strong> {new Date(viewUser.createdAt!).toLocaleDateString()}</p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setViewUser(null)}
                className="px-4 py-2 bg-green-600 text-white rounded-2xl cursor-pointer hover:bg-green-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
