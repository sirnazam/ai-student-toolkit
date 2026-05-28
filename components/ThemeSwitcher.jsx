'use client'

import { useState, useEffect } from 'react'
import { Palette } from 'lucide-react'

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  const themes = [
    { name: 'Dark', id: 'dark', color: '#070912' },
    { name: 'Navy', id: 'navy', color: '#0a0f2e' },
    { name: 'Forest', id: 'forest', color: '#071a12' },
    { name: 'Light', id: 'light', color: '#f0f4f8' },
  ]

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('toolkit-theme') || 'dark'
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId)
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem('toolkit-theme', themeId)
    setIsOpen(false)
  }

  // Prevent render on server
  if (!mounted) return null

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 text-white"
        aria-label="Toggle theme"
        title="Change theme"
      >
        <Palette size={24} />
      </button>

      {/* Theme Popover */}
      {isOpen && (
        <div className="fixed bottom-32 md:bottom-20 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <p className="text-white text-sm font-semibold mb-4">Select Theme</p>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                    currentTheme === theme.id
                      ? 'ring-2 ring-cyan-400 scale-105'
                      : 'hover:scale-105'
                  }`}
                  title={`Switch to ${theme.name} theme`}
                >
                  {/* Color Circle */}
                  <div
                    className="w-12 h-12 rounded-full shadow-md border-2 border-white/30 transition-transform duration-200 hover:scale-110"
                    style={{ backgroundColor: theme.color }}
                  />
                  {/* Theme Name */}
                  <span className="text-white text-xs font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Close popover when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Tailwind animation utilities */}
      <style jsx>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slideInFromBottom 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
