'use client'

import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Tools', href: '#tools' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl transition-colors duration-300"
      style={{
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-xl sm:text-2xl font-bold gradient-text flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-accent rounded-xl flex items-center justify-center text-white font-black">
            A
          </div>
          <span className="hidden sm:inline">AI Toolkit</span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              whileHover={{ color: '#0ea5e9' }}
              className="text-gray-300 hover:text-primary-400 transition-smooth text-sm font-medium"
            >
              {item.name}
            </motion.a>
          ))}
        </div>

        {/* CTA Button & Mobile Menu */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2 bg-gradient-accent text-white rounded-lg font-semibold text-sm hover:shadow-glow transition-smooth"
          >
            Join Waitlist
          </motion.button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="md:hidden p-2 rounded-lg glass border border-white/10 text-white"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          id="mobile-menu"
          role="menu"
          aria-hidden={!isOpen}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden glass border-t border-white/10 backdrop-blur-xl"
        >
          <div className="px-4 sm:px-6 py-4 space-y-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block text-gray-300 hover:text-primary-400 transition-smooth font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <button className="w-full px-6 py-2 bg-gradient-accent text-white rounded-lg font-semibold text-sm hover:shadow-glow transition-smooth">
              Join Waitlist
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
