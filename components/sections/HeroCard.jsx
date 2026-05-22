'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, ChevronRight, Zap } from 'lucide-react'
import Link from 'next/link'

const QUICK_GRADES = ['A', 'B', 'C', 'D', 'F']
const GRADE_POINTS = { A: 5, B: 4, C: 3, D: 2, F: 0 }

const defaultCourses = [
  { id: 1, name: 'MTH', code: '101', units: '3', grade: '' },
  { id: 2, name: 'ENG', code: '102', units: '2', grade: '' },
  { id: 3, name: 'CSC', code: '103', units: '3', grade: '' },
]

const calculateGPAValue = (courseList) => {
  let totalPoints = 0
  let totalUnits = 0

  for (const c of courseList) {
    if (!c.grade || !c.units) continue
    const units = parseFloat(c.units)
    if (Number.isNaN(units)) continue
    totalPoints += units * GRADE_POINTS[c.grade]
    totalUnits += units
  }

  return totalUnits > 0 ? totalPoints / totalUnits : null
}

export default function HeroCard() {
  const [courses, setCourses] = useState(defaultCourses)
  const [result, setResult] = useState(null)
  const [calculating, setCalculating] = useState(false)

  const updateGrade = (id, grade) => {
    const updated = courses.map(c => c.id === id ? { ...c, grade } : c)
    setCourses(updated)
    setResult(calculateGPAValue(updated))
  }

  const updateCourseField = (id, field, value) => {
    const updated = courses.map(c => c.id === id ? { ...c, [field]: value } : c)
    setCourses(updated)
    setResult(calculateGPAValue(updated))
  }

  const calculate = async () => {
    setCalculating(true)
    await new Promise(r => setTimeout(r, 600))
    setResult(calculateGPAValue(courses))
    setCalculating(false)
  }

  const getClassLabel = (gpa) => {
    if (gpa >= 4.5) return { label: 'First Class 🏆', color: '#00d4aa' }
    if (gpa >= 3.5) return { label: '2nd Class Upper', color: '#0ea5e9' }
    if (gpa >= 2.4) return { label: '2nd Class Lower', color: '#f59e0b' }
    return { label: 'Keep pushing 💪', color: '#f97316' }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative"
    >
      {/* Glow */}
      <div className="absolute -inset-4 bg-cyan-500/10 rounded-3xl blur-2xl" />

      <div className="relative rounded-3xl border border-white/10 bg-[#0a0f1e]/90 backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">CGPA Calculator</p>
              <p className="text-xs text-gray-500">Live Preview</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Live
          </span>
        </div>

        {/* Course rows */}
        <div className="p-4 space-y-2">
          {courses.map(course => (
            <div key={course.id} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/8">
                <input
                  type="text"
                  value={course.name}
                  placeholder="MTH"
                  onChange={e => updateCourseField(course.id, 'name', e.target.value)}
                  onFocus={e => e.target.select()}
                  className="w-16 bg-transparent border border-white/10 rounded-lg px-2 py-1 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-xs text-gray-500">/</span>
                <input
                  type="text"
                  value={course.code}
                  placeholder="101"
                  onChange={e => updateCourseField(course.id, 'code', e.target.value)}
                  onFocus={e => e.target.select()}
                  className="w-16 bg-transparent border border-white/10 rounded-lg px-2 py-1 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
                />
                <div className="ml-auto flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={course.units}
                    placeholder="3"
                    onChange={e => updateCourseField(course.id, 'units', e.target.value)}
                    onFocus={e => e.target.select()}
                    className="w-14 bg-transparent border border-white/10 rounded-lg px-2 py-1 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-xs text-gray-500">units</span>
                </div>
              </div>
              <div className="flex gap-1">
                {QUICK_GRADES.map(g => (
                  <button
                    key={g}
                    onClick={() => updateGrade(course.id, g)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      course.grade === g
                        ? 'bg-cyan-500 text-white scale-110'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        <AnimatePresence>
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-2"
            >
              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: `${getClassLabel(result).color}15`, border: `1px solid ${getClassLabel(result).color}30` }}>
                <div>
                  <p className="text-xs text-gray-400">Semester GPA</p>
                  <p className="text-2xl font-black text-white">{result.toFixed(2)}</p>
                </div>
                <p className="text-xs font-semibold" style={{ color: getClassLabel(result).color }}>
                  {getClassLabel(result).label}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="p-4 pt-2 space-y-2">
          <button
            onClick={calculate}
            disabled={calculating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-60"
          >
            {calculating ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.6 }}>
                <Zap className="w-4 h-4" />
              </motion.div>
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {calculating ? 'Calculating...' : 'Calculate GPA'}
          </button>

          <Link href="/tools/cgpa-calculator"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-gray-300 text-xs hover:bg-white/5 hover:text-white transition-all">
            Open Full Calculator
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-center text-xs text-gray-600 pb-4">Try the full calculator with semester tracking</p>
      </div>
    </motion.div>
  )
}
