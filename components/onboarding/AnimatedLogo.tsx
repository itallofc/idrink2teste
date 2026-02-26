"use client";

import { motion } from "framer-motion";

export function AnimatedLogo() {
  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Animated Beer Glass */}
      <motion.div
        className="relative"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 100 120"
          fill="none"
          className="h-32 w-32 md:h-40 md:w-40"
          aria-hidden="true"
        >
          {/* Glow effect */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="#ea1d2c" />
            </linearGradient>
            <linearGradient id="foamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0f0f0" />
            </linearGradient>
          </defs>

          {/* Glass body */}
          <motion.path
            d="M25 30 L30 105 C30 110 35 115 50 115 C65 115 70 110 70 105 L75 30"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3"
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* Liquid */}
          <motion.path
            d="M30 45 L33 100 C33 103 38 108 50 108 C62 108 67 103 67 100 L70 45"
            fill="url(#liquidGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />

          {/* Foam */}
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <ellipse cx="50" cy="45" rx="22" ry="8" fill="url(#foamGradient)" />
            <circle cx="35" cy="42" r="5" fill="white" opacity="0.9" />
            <circle cx="50" cy="40" r="6" fill="white" opacity="0.95" />
            <circle cx="62" cy="43" r="4" fill="white" opacity="0.85" />
            <circle cx="42" cy="38" r="3" fill="white" opacity="0.8" />
            <circle cx="58" cy="39" r="3" fill="white" opacity="0.85" />
          </motion.g>

          {/* Glass rim */}
          <motion.path
            d="M20 30 L80 30"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Handle */}
          <motion.path
            d="M75 40 C90 40 90 75 75 75"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />

          {/* Bubbles */}
          <motion.circle
            cx="40"
            cy="80"
            r="2"
            fill="rgba(255,255,255,0.3)"
            animate={{ y: [-0, -30], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          />
          <motion.circle
            cx="55"
            cy="90"
            r="1.5"
            fill="rgba(255,255,255,0.3)"
            animate={{ y: [-0, -40], opacity: [0.3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
          <motion.circle
            cx="48"
            cy="85"
            r="2"
            fill="rgba(255,255,255,0.3)"
            animate={{ y: [-0, -35], opacity: [0.3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
          />
        </svg>

        {/* Red glow behind glass */}
        <div className="absolute inset-0 -z-10 blur-3xl">
          <div className="h-full w-full rounded-full bg-[#ea1d2c]/30" />
        </div>
      </motion.div>

      {/* Logo Text */}
      <motion.div
        className="flex items-baseline gap-0.5 text-5xl font-bold tracking-tight md:text-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <span className="text-foreground">I</span>
        <span className="bg-gradient-to-r from-[#ea1d2c] to-[#ff6b6b] bg-clip-text text-transparent">
          drink
        </span>
      </motion.div>
    </motion.div>
  );
}
