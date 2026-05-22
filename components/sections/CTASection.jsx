'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary-500/5 via-transparent to-transparent rounded-full filter blur-3xl"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="rounded-3xl overflow-hidden">
          {/* Glass card with gradient border effect */}
          <div
            className="glass px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 text-center border border-white/10 backdrop-blur-xl relative"
            style={{
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(6, 182, 212, 0.05))',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-40 h-40 bg-primary-500 rounded-full filter blur-3xl opacity-10 -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-cyan-400 rounded-full filter blur-3xl opacity-10 -z-10"></div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4 sm:space-y-6 mb-8 sm:mb-10"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Start Building Your <span className="gradient-text">Academic Advantage</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                Access smart student tools designed for African universities and productivity.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-8 sm:px-12 py-4 sm:py-5 bg-black text-white font-semibold rounded-2xl hover:shadow-glow transition-smooth border border-white/10 hover:border-white/20"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="text-sm text-gray-400 mt-6 sm:mt-8"
            >
              No credit card required • 100% free • 15+ tools available
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
