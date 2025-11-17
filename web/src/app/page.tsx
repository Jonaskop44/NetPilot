"use client";

import useAuth from "@/hooks/useAuth";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const HomePage = () => {
  const { isLoading, login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background Gradient Orbs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-12 p-8 max-w-6xl mx-auto">
        {/* Logo/Brand with 3D Effect */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% auto",
            }}
          >
            NetPilot
          </motion.h1>

          <div className="flex items-center justify-center gap-3">
            <p className="text-2xl md:text-3xl text-gray-700 font-semibold">
              Deine intelligente Netzwerk-Management-Plattform
            </p>
          </div>
        </motion.div>

        {/* Login Button with Crazy Effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
        >
          <motion.button
            onClick={login}
            disabled={isLoading}
            className="group relative px-12 py-6 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative flex items-center gap-4">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Icon icon="svg-spinners:ring-resize" className="w-7 h-7" />
                  </motion.div>
                  Wird geladen...
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ rotate: [0, -20, 20, 0], scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon icon="logos:microsoft-icon" className="w-8 h-8" />
                  </motion.div>
                  Mit Microsoft anmelden
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Icon icon="solar:arrow-right-bold" className="w-6 h-6" />
                  </motion.div>
                </>
              )}
            </span>
          </motion.button>
        </motion.div>

        {/* Features with Glassmorphism */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {[
            {
              icon: "solar:bolt-bold-duotone",
              title: "Blitzschnell",
              description: "Next.js 15 Performance",
              color: "from-blue-500 to-cyan-500",
              delay: 0,
            },
            {
              icon: "solar:shield-check-bold-duotone",
              title: "Ultra-Sicher",
              description: "Enterprise Security",
              color: "from-purple-500 to-pink-500",
              delay: 0.1,
            },
            {
              icon: "solar:magic-stick-3-bold-duotone",
              title: "Magisch Einfach",
              description: "Intuitive Bedienung",
              color: "from-pink-500 to-orange-500",
              delay: 0.2,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="group relative p-8 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/50 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + feature.delay, duration: 0.6 }}
              whileHover={{
                y: -10,
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Animated Background on Hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20`}
                initial={false}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              />

              {/* Rotating Icon Container */}
              <motion.div
                className={`relative w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <Icon icon={feature.icon} className="w-10 h-10 text-white" />

                {/* Pulse Effect */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color}`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <motion.h3
                className="relative font-bold text-2xl text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + feature.delay }}
              >
                {feature.title}
              </motion.h3>
              <motion.p
                className="relative text-gray-700 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + feature.delay }}
              >
                {feature.description}
              </motion.p>

              {/* Sparkle Effect on Hover */}
              <motion.div
                className="absolute top-4 right-4"
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon
                  icon="solar:star-bold-duotone"
                  className="w-6 h-6 text-yellow-400"
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className="flex justify-center gap-12 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            {
              icon: "solar:users-group-rounded-bold-duotone",
              value: "1000+",
              label: "Nutzer",
            },
            {
              icon: "solar:server-bold-duotone",
              value: "99.9%",
              label: "Uptime",
            },
            {
              icon: "solar:fire-bold-duotone",
              value: "24/7",
              label: "Support",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <Icon
                  icon={stat.icon}
                  className="w-10 h-10 text-purple-600 mx-auto mb-2"
                />
              </motion.div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
