import Link from "next/link";

interface AuthToggleProps {
  mode: "signin" | "signup";
}

export function AuthToggle({ mode }: AuthToggleProps) {
  return (
    <div className="flex w-full border rounded-lg mb-6 p-1 bg-gray-50 h-[44px]">
      {mode === "signin" ? (
        <>
          <button className="flex-1 text-teal-500 rounded-md font-medium bg-white shadow-sm">
            Sign in
          </button>
          <Link href="/signup" className="flex-1 text-gray-500 py-1 text-center hover:text-gray-600">
            Sign up
          </Link>
        </>
      ) : (
        <>
          <Link href="/" className="flex-1 text-gray-500 py-1 text-center hover:text-gray-600">
            Sign in
          </Link>
          <button className="flex-1 text-teal-500 rounded-md font-medium bg-white shadow-sm">
            Sign up
          </button>
        </>
      )}
    </div>
  );
} 