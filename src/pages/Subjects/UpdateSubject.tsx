import React from "react";

interface UpdateSubjectProps {
  name: string;
  description: string;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function UpdateSubject({ name, description, onChange, onSubmit, onCancel }: UpdateSubjectProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => onChange("name", e.target.value)}
        className="input-box mb-5 border-none bg-gray-200"
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => onChange("description", e.target.value)}
        rows={4}
        className="input-box mb-5 border-none bg-gray-200 resize-none"
      />
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

export default UpdateSubject;
