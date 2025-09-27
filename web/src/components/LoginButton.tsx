"use client";

interface LoginButtonProps {
  onLogin: () => void;
  isLoading?: boolean;
}

export default function LoginButton({
  onLogin,
  isLoading = false,
}: LoginButtonProps) {
  return (
    <button
      onClick={onLogin}
      disabled={isLoading}
      className="rounded-full bg-blue-600 text-white font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Anmelden...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.4 12c0-.8-.1-1.6-.2-2.4H12v4.5h6.4c-.3 1.5-1.1 2.8-2.3 3.7v3.1h3.7c2.2-2 3.5-4.9 3.6-8.9z" />
            <path d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-3.1c-1.1.7-2.5 1.1-4.2 1.1-3.2 0-5.9-2.2-6.9-5.1H1.4v3.2C3.4 21.4 7.4 24 12 24z" />
            <path d="M5.1 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V6.7H1.4C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.3l3.7-3.2z" />
            <path d="M12 4.8c1.8 0 3.4.6 4.7 1.8l3.5-3.5C18 1.1 15.3 0 12 0 7.4 0 3.4 2.6 1.4 6.7l3.7 3.2c1-2.9 3.7-5.1 6.9-5.1z" />
          </svg>
          Mit Microsoft anmelden
        </>
      )}
    </button>
  );
}
