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
      <label className="block text-sm mb-2">{label}</label>
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
        {...register(id)}
        className="w-full rounded-lg border-gray-200"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
} 