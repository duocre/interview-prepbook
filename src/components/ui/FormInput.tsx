import Input from './Input';
import Label from './Label';

type Props = {
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
};

export default function FormInput({
  label,
  className,
  error,
  name,
  onChange,
  placeholder,
  type,
  value,
  hint,
}: Props) {
  return (
    <div>
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className="mt-2">
        <Input
          type={type}
          name={name}
          id={name}
          value={value}
          className={className}
          placeholder={placeholder}
          onChange={onChange}
          error={error}
        />
      </div>
      {hint && (
        <p className="mt-2 text-sm text-gray-500" id="email-description">
          {hint}
        </p>
      )}
    </div>
  );
}
