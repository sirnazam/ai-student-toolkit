'use client'

import { motion } from 'framer-motion'
import { Mail, Twitter, Linkedin, Github } from 'lucide-react'

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: 'mailto:support@aistudentkit.com', label: 'Email' },
  ]

  const footerLinks = [
    { name: 'Home', href: '#' },
    { name: 'Tools', href: '#tools' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass border-t border-white/10 backdrop-blur-xl"
      style={{
        background: 'rgba(15, 15, 15, 0.5)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="col-span-1 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center text-white font-black">
                A
              </div>
              <span className="text-xl font-bold gradient-text">AI Toolkit</span>
            </div>
            <p className="text-gray-400 text-sm">
              Smart tools for African students to boost productivity and academic success.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#tools" className="text-gray-400 hover:text-primary-400 transition-smooth text-sm">Tools</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-smooth text-sm">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-smooth text-sm">Updates</a></li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-smooth text-sm">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-smooth text-sm">Blog</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-primary-400 transition-smooth text-sm">Contact</a></li>
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-500/50 border border-white/10 transition-smooth"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} AI Student Toolkit. All rights reserved.
            </p>
            <div className="flex gap-6">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-primary-400 transition-smooth text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
