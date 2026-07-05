export default function AuthInput({
  label,
  type = "text",
  placeholder,
  ...props
}) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="
        w-full
        rounded-2xl
        border
        border-slate-300
        px-4
        py-3
        outline-none
        transition
        focus:border-blue-600
        focus:ring-4
        focus:ring-blue-100"
        {...props}
      />

    </div>
  );
}
