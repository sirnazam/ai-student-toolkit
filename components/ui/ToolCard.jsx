'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
  hover: {
    y: -10,
    transition: { duration: 0.3 },
  },
}

export default function ToolCard({ icon: Icon, title, description, color, delay = 0 }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: delay * 0.1 }}
      className="group"
    >
      <div className="glass rounded-2xl p-8 h-full backdrop-blur-xl border border-white/10 hover:border-white/20 transition-smooth relative overflow-hidden">
        {/* Gradient background effect on hover */}
        <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-smooth`}>
            <Icon className={`w-8 h-8 text-${color}-400`} />
          </div>

          {/* Title and description */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white group-hover:gradient-text transition-smooth">
              {title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* CTA Link */}
          <div className="pt-4 flex items-center gap-2 text-primary-400 group-hover:text-primary-300 transition-smooth opacity-0 group-hover:opacity-100">
            <span className="text-sm font-medium">Explore</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Decorative element */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500 rounded-full filter blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-0`}></div>
      </div>
    </motion.div>
  )
}
