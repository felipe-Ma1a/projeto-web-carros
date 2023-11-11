import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  error?: string;
  register: UseFormRegister<any>;
  rules?: RegisterOptions;
}

export function Input({
  type,
  placeholder,
  name,
  error,
  register,
  rules,
}: InputProps) {
  return (
    <div>
      <input
        className={`h-11 w-full rounded-md border-2 px-2 ${
          error ? "border-red-500 outline-red-500" : ""
        }`}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="my-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
