import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function PasswordInput({ value, onChange, placeholder }: PasswordInputProps) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center bg-gray-200 border-none px-5 rounded-4xl mb-3">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
        className="w-full text-sm py-3 mr-3 rounded outline-none bg-gray-200"
      />

      <div
        onClick={toggleShowPassword}
        className="cursor-pointer flex items-center justify-center w-6 h-6"
      >
        {isShowPassword ? (
          <FaRegEye size={22} className="text-primary" />
        ) : (
          <FaRegEyeSlash size={22} className="text-slate-400" />
        )}
      </div>
    </div>
  );
}

export default PasswordInput;
