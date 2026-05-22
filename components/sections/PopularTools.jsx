'use client'

import { motion } from 'framer-motion'
import { Calculator, BookOpen, FileText, Lightbulb } from 'lucide-react'
import ToolCard from '../ui/ToolCard'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
}

const tools = [
  {
    icon: Calculator,
    title: 'CGPA Calculator',
    description: 'Calculate your Cumulative Grade Point Average instantly. Track your academic performance across all courses.',
    color: 'primary',
    href: '/tools/cgpa-calculator',
  },
  {
    icon: BookOpen,
    title: 'AI Note Summarizer',
    description: 'Transform lengthy notes into concise summaries. Save time and improve retention with AI-powered summarization.',
    color: 'cyan',
    href: '/tools/note-summarizer',
  },
  {
    icon: FileText,
    title: 'CV Builder',
    description: 'Create professional CVs in minutes. Choose from premium templates designed for African students.',
    color: 'green',
    href: '/tools/cv-builder',
  },
  {
    icon: Lightbulb,
    title: 'Assignment Helper',
    description: 'Get smart suggestions and guidance for your assignments. Improve quality and meet deadlines easily.',
    color: 'amber',
    href: '/tools/assignment-helper',
  },
]

export default function PopularTools() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.h2
            variants={titleVariants}
            className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6"
          >
            Popular Tools
          </motion.h2>
          <motion.p
            variants={titleVariants}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Everything students need in one place.
          </motion.p>
        </motion.div>

        {/* Tool Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              color={tool.color}
              href={tool.href}
              delay={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
