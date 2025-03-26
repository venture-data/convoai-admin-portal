import { Input } from "@/components/ui/input";
import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface FormFieldProps<TFieldValues extends FieldValues> {
  id: Path<TFieldValues>;
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
}

export function FormField<TFieldValues extends FieldValues>({ 
  id, 
  label, 
  type, 
  placeholder, 
  register, 
  error 
}: FormFieldProps<TFieldValues>) {
  return (
    <div>
      <label className="block text-sm mb-2 text-gray-200">{label}</label>
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
        {...register(id)}
        className="w-full px-4 py-3 bg-[#2A2D36] rounded-lg border border-gray-700 text-white focus:outline-none focus:border-[#FF5C00] [&:-webkit-autofill]:bg-[#2A2D36] [&:-webkit-autofill]:!text-white [&:-webkit-autofill_selected]:bg-[#2A2D36] [&:-webkit-autofill]:!appearance-none [&:-webkit-autofill]:![background-color:#2A2D36] [&:-webkit-autofill]:!box-shadow-[0_0_0_30px_#2A2D36_inset]"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
} 