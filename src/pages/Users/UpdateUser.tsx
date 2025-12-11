import React from "react";
import PasswordInput from "../../components/Input/PasswordInput";

interface UpdateUserProps {
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function UpdateUser({
  email,
  username,
  password,
  role,
  onChange,
  onSubmit,
  onCancel,
}: UpdateUserProps) {
  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => onChange("email", e.target.value)}
        className="input-box mb-5 border-none bg-gray-200"
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => onChange("username", e.target.value)}
        className="input-box mb-5 border-none bg-gray-200"
      />
      <PasswordInput
        value={password}
        onChange={(e) => onChange("password", e.target.value)}
        placeholder="Password"
      />

      <div className="input-box mb-5 bg-gray-200 border-none rounded-lg px-4 py-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rol:</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={(e) => onChange("role", e.target.value)}
              className="accent-green-600"
            />
            <span className="text-gray-800 text-sm">User</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={(e) => onChange("role", e.target.value)}
              className="accent-green-600"
            />
            <span className="text-gray-800 text-sm">Admin</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded-2xl cursor-pointer hover:bg-gray-500 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-700 transition"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

export default UpdateUser;
