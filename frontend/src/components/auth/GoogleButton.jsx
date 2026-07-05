import { FcGoogle } from "react-icons/fc";

export default function GoogleButton() {
  return (
    <button
      className="
      w-full
      rounded-2xl
      border
      border-slate-300
      bg-white
      py-3
      flex
      items-center
      justify-center
      gap-3
      font-semibold
      transition
      hover:border-blue-600
      hover:shadow-lg"
    >
      <FcGoogle size={24} />

      Continue with Google
    </button>
  );
}
