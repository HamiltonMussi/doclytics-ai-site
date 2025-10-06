import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  label: string;
  icon?: ReactNode;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  helperText?: string;
  register?: UseFormRegisterReturn;
  value?: string;
};

export const FormInput = ({
  label,
  icon,
  type = "text",
  placeholder,
  error,
  disabled = false,
  helperText,
  register,
  value,
}: FormInputProps) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#263743] mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...register}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          className={`block w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-[#263743] placeholder:text-[#88A0B0] ${
            disabled
              ? 'border-[#88A0B0]/30 bg-[#88A0B0]/10 text-[#88A0B0] cursor-not-allowed'
              : 'border-[#88A0B0]/40 focus:border-[#0F555A]'
          }`}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-[#88A0B0]">{helperText}</p>
      )}
    </div>
  );
};
