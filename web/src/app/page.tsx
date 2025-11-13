"use client";

import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react";

const HomePage = () => {
  const { isLoading, login } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-8 p-8 animate-fade-in">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 animate-slide-up">
            NetPilot
          </h1>
          <p className="text-xl text-gray-600 animate-slide-up animation-delay-100">
            Deine intelligente Netzwerk-Management-Plattform
          </p>
        </div>

        {/* Login Button */}
        <div className="animate-slide-up animation-delay-200">
          <button
            onClick={login}
            disabled={isLoading}
            className="group relative px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center gap-3">
              {isLoading ? (
                <>
                  <Icon icon="svg-spinners:ring-resize" className="w-5 h-5" />
                  Wird geladen...
                </>
              ) : (
                <>
                  <Icon
                    icon="logos:microsoft-icon"
                    className="w-6 h-6 transform group-hover:rotate-12 transition-transform"
                  />
                  Mit Microsoft anmelden
                </>
              )}
            </span>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in animation-delay-300">
          <div className="p-6 bg-white shadow-2xl rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Icon icon="lucide:zap" className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Schnell</h3>
            <p className="text-sm text-gray-600">Blitzschnelle Performance</p>
          </div>

          <div className="p-6 bg-white shadow-2xl rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Icon
                icon="lucide:shield-check"
                className="w-6 h-6 text-purple-600"
              />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Sicher</h3>
            <p className="text-sm text-gray-600">Enterprise-Grade Security</p>
          </div>

          <div className="p-6 bg-white shadow-2xl rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Icon icon="lucide:sparkles" className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Einfach</h3>
            <p className="text-sm text-gray-600">Intuitives Interface</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
