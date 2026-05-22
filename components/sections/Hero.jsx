'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

const statsVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8 },
  },
}

export default function Hero({ onExplore, onJoinWaitlist }) {
  const stats = [
    { number: '20k+', label: 'Monthly Users' },
    { number: '15+', label: 'Free Tools' },
    { number: '100%', label: 'Mobile Friendly' },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute -bottom-8 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <motion.div
        className="max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left content */}
        <div className="w-full max-w-2xl space-y-8">
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full w-fit"
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">Built For African Students</span>
          </motion.div>

          {/* Main headline with gradient */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Study Smarter With{' '}
              <span className="gradient-text font-black">AI-Powered Tools</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-300 leading-relaxed"
          >
            Free student utilities for calculating CGPA, generating CVs, summarizing notes, and boosting academic productivity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              onClick={onExplore}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-accent rounded-2xl font-semibold text-white hover:shadow-glow transition-smooth hover:scale-105 active:scale-95"
            >
              Explore Tools
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onJoinWaitlist}
              className="flex items-center justify-center gap-2 px-8 py-4 glass rounded-2xl font-semibold text-white hover:bg-white/20 transition-smooth border border-white/20"
            >
              Join Waitlist
            </button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-6 pt-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={statsVariants}
                className="glass rounded-2xl p-6 text-center border border-white/20 bg-white/10 flex flex-col justify-center items-center gap-2"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none tracking-tight">
                  {stat.number}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider leading-snug">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}