'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Calculator, ChevronDown, BookOpen,
  Target, Save, RotateCcw, Share2, TrendingUp,
  GraduationCap, ArrowLeft, CheckCircle, AlertCircle, Info
} from 'lucide-react'
import Link from 'next/link'
import {
  SCHOOLS, GRADING_SYSTEMS, getClassification,
  calculateGPA, calculateCGPA, predictTargetGPA
} from '@/lib/schools'

const STORAGE_KEY = 'cgpa_calculator_data'

const emptyRow = () => ({
  id: Date.now() + Math.random(),
  name: '',
  units: '',
  grade: '',
})

const emptySemester = (name = '') => ({
  id: Date.now() + Math.random(),
  name,
  courses: Array.from({ length: 5 }, emptyRow),
})

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch { return initial }
  })

  const set = useCallback((v) => {
    setValue(v)
    try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }, [key])

  return [value, set]
}

export default function CGPACalculatorPage() {
  const [selectedSchool, setSelectedSchool] = useLocalStorage('cgpa_school', SCHOOLS[0].abbr)
  const [semesters, setSemesters] = useLocalStorage('cgpa_semesters', [emptySemester('100L First Semester')])
  const [activeSemIdx, setActiveSemIdx] = useState(0)
  const [targetGPA, setTargetGPA] = useState('')
  const [remainingUnits, setRemainingUnits] = useState('')
  const [showSchoolPicker, setShowSchoolPicker] = useState(false)
  const [showTargetPredictor, setShowTargetPredictor] = useState(false)
  const [saved, setSaved] = useState(false)
  const [schoolSearch, setSchoolSearch] = useState('')
  const [activeTab, setActiveTab] = useState('calculator') // calculator | semesters | predictor
  const [customSchoolName, setCustomSchoolName] = useState('')
  const [customSystem, setCustomSystem] = useState('five_point')
  const [showScaleOverride, setShowScaleOverride] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.grade-dropdown-container')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const school = selectedSchool === 'CUSTOM'
    ? {
      name: customSchoolName || 'Custom Institution',
      abbr: 'CUSTOM',
      system: customSystem || 'five_point',
      state: '',
    }
    : SCHOOLS.find(s => s.abbr === selectedSchool) || SCHOOLS[0]
  const system = school.system
  const gradingSystem = GRADING_SYSTEMS[system]
  const activeSemester = semesters[activeSemIdx] || semesters[0]

  const semesterResult = calculateGPA(activeSemester?.courses || [], system)
  const allSemesterResults = semesters.map(s => calculateGPA(s.courses, system))
  const cgpa = calculateCGPA(semesters, system)
  const classification = getClassification(cgpa, system)
  const semClassification = getClassification(semesterResult.gpa, system)
  const detectedSystem = (() => {
    const name = customSchoolName.toLowerCase()
    if (name.includes('covenant') || name.includes('babcock') || name.includes('american university') || name.includes('pan-atlantic')) {
      return 'four_point'
    }
    if (name.includes('polytechnic') || name.includes('poly') || name.includes('college of education') || name.includes('coe') || name.includes('monotechnic')) {
      return 'five_point'
    }
    return 'five_point'
  })()
  const hasGradedCourse = semesters.some(sem => sem.courses.some(course => course.grade))
  const nextClassification = gradingSystem.classifications.find(cls => cls.min > cgpa)
  const aiStanding = cgpa > 0
    ? `You are on ${classification.label} standing (${cgpa.toFixed(2)}/${gradingSystem.maxGPA.toFixed(1)})`
    : ''
  const aiTarget = cgpa > 0
    ? `Maintain ${classification.min.toFixed(2)}+ each semester to keep ${classification.label}`
    : ''
  const aiGap = nextClassification ? Math.max(0, nextClassification.min - cgpa) : 0
  const aiTip = cgpa > 0
    ? nextClassification
      ? `You are ${aiGap.toFixed(2)} points away from ${nextClassification.label}. Push harder!`
      : 'You are at the top classification — keep your strong consistency and review weekly.'
    : ''

  const filteredSchools = SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.abbr.toLowerCase().includes(schoolSearch.toLowerCase())
  )

  // Course operations
  const updateCourse = (semIdx, courseId, field, value) => {
    setSemesters(prev => prev.map((sem, si) =>
      si !== semIdx ? sem : {
        ...sem,
        courses: sem.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c)
      }
    ))
  }

  const addCourse = (semIdx) => {
    setSemesters(prev => prev.map((sem, si) =>
      si !== semIdx ? sem : { ...sem, courses: [...sem.courses, emptyRow()] }
    ))
  }

  const removeCourse = (semIdx, courseId) => {
    setSemesters(prev => prev.map((sem, si) =>
      si !== semIdx ? sem : {
        ...sem,
        courses: sem.courses.filter(c => c.id !== courseId)
      }
    ))
  }

  const addSemester = () => {
    const names = ['100L First', '100L Second', '200L First', '200L Second',
      '300L First', '300L Second', '400L First', '400L Second',
      '500L First', '500L Second']
    const name = names[semesters.length] || `Semester ${semesters.length + 1}`
    const newSem = emptySemester(`${name} Semester`)
    setSemesters(prev => [...prev, newSem])
    setActiveSemIdx(semesters.length)
  }

  const deleteSemester = (idx) => {
    if (semesters.length === 1) return
    setSemesters(prev => prev.filter((_, i) => i !== idx))
    setActiveSemIdx(Math.max(0, idx - 1))
  }

  const renameSemester = (idx, name) => {
    setSemesters(prev => prev.map((s, i) => i === idx ? { ...s, name } : s))
  }

  const resetSemester = (idx) => {
    setSemesters(prev => prev.map((s, i) =>
      i === idx ? { ...s, courses: Array.from({ length: 5 }, emptyRow) } : s
    ))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleShare = () => {
    const text = `My CGPA: ${cgpa.toFixed(2)} (${classification.label}) — Calculated with AI Student Toolkit`
    if (navigator.share) {
      navigator.share({ title: 'My CGPA Result', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const prediction = targetGPA && remainingUnits
    ? predictTargetGPA(cgpa, semesters.reduce((a, s) => a + calculateGPA(s.courses, system).totalUnits, 0),
        parseFloat(targetGPA), parseFloat(remainingUnits), system)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d1425] to-[#0a0a1a]">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:block">Back</span>
            </Link>
            <div className="w-px h-5 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">CGPA Calculator</h1>
                <p className="text-xs text-gray-400">{school.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-all">
              PDF
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-all">
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Share</span>
            </button>
            <button onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                saved
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
              }`}>
              {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden sm:block">{saved ? 'Saved!' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* School Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <button
            onClick={() => setShowSchoolPicker(!showSchoolPicker)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">Your University</p>
                <p className="text-sm font-semibold text-white">{school.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {gradingSystem.label}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSchoolPicker ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <AnimatePresence>
            {showSchoolPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="absolute top-full mt-2 w-full z-50 rounded-2xl bg-[#0f1628] border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="p-3 border-b border-white/10">
                  <input
                    type="text"
                    placeholder="Search university..."
                    value={schoolSearch}
                    onChange={e => setSchoolSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredSchools.map(s => (
                    <button
                      key={s.abbr}
                      onClick={() => { setSelectedSchool(s.abbr); setShowSchoolPicker(false); setSchoolSearch('') }}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors ${
                        selectedSchool === s.abbr ? 'bg-cyan-500/10' : ''
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{s.abbr}</p>
                        <p className="text-xs text-gray-400">{s.name}</p>
                      </div>
                      <span className="text-xs text-gray-500">{GRADING_SYSTEMS[s.system].label}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/10 px-4 py-4">
                  <p className="text-xs text-gray-400 font-medium mb-1">Can't find your institution?</p>
                  <p className="text-sm text-gray-500 mb-4">Works for all higher institutions — universities, polytechnics, colleges of education, private and government</p>
                  <input
                    type="text"
                    value={customSchoolName}
                    onChange={e => setCustomSchoolName(e.target.value)}
                    placeholder="Type your institution name e.g. Yabatech, Moshood Abiola Polytechnic..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                  <div className="mt-3 flex flex-col gap-2">
                    <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300 border border-cyan-500/20">
                      Detected: {GRADING_SYSTEMS[detectedSystem].label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowScaleOverride(prev => !prev)}
                      className="text-xs text-gray-400 underline underline-offset-2 text-left"
                    >
                      Wrong scale? Change it
                    </button>
                    {showScaleOverride && (
                      <select
                        value={customSystem}
                        onChange={e => setCustomSystem(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                      >
                        <option value="five_point">5.0 Scale</option>
                        <option value="four_point">4.0 Scale</option>
                        <option value="seven_point">7.0 Scale</option>
                      </select>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const scaleToSave = showScaleOverride ? customSystem : detectedSystem
                        setSelectedSchool('CUSTOM')
                        localStorage.setItem('cgpa_custom_school', JSON.stringify(customSchoolName))
                        localStorage.setItem('cgpa_custom_system', JSON.stringify(scaleToSave))
                        setCustomSystem(scaleToSave)
                        setShowSchoolPicker(false)
                        setSchoolSearch('')
                      }}
                      className="w-full px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm font-medium"
                    >
                      Use This Institution
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CGPA Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(14,165,233,0.1) 50%, rgba(99,102,241,0.1) 100%)' }}
        >
          <div className="absolute inset-0 border border-cyan-500/20 rounded-3xl" />
          <div className="relative p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {/* CGPA */}
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cumulative GPA</p>
                <div className="text-5xl sm:text-6xl font-black text-white leading-none">
                  {cgpa > 0 ? cgpa.toFixed(2) : '—'}
                </div>
                <p className="text-xs text-gray-500 mt-1">out of {gradingSystem.maxGPA.toFixed(1)}</p>
              </div>

              {/* Classification */}
              <div className="col-span-2 sm:col-span-1 flex flex-col justify-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Classification</p>
                {cgpa > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold w-fit"
                    style={{ background: `${classification.color}20`, color: classification.color, border: `1px solid ${classification.color}40` }}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    {classification.label}
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">Add courses to see</span>
                )}
              </div>

              {/* Semester GPA */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">This Semester</p>
                <div className="text-3xl font-bold text-cyan-400">
                  {semesterResult.gpa > 0 ? semesterResult.gpa.toFixed(2) : '—'}
                </div>
                <p className="text-xs text-gray-500 mt-1">{semesterResult.totalUnits} units</p>
              </div>

              {/* Total Units */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Units</p>
                <div className="text-3xl font-bold text-white">
                  {semesters.reduce((a, s) => a + calculateGPA(s.courses, system).totalUnits, 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">across {semesters.length} semester{semesters.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* GPA Progress Bar */}
            {cgpa > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>0.0</span>
                  <span style={{ color: classification.color }}>{classification.label}</span>
                  <span>{gradingSystem.maxGPA.toFixed(1)}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cgpa / gradingSystem.maxGPA) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${classification.color}, ${classification.color}80)` }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          {[
            { id: 'calculator', label: 'Calculator', icon: Calculator },
            { id: 'semesters', label: 'Semesters', icon: BookOpen },
            { id: 'predictor', label: 'Predictor', icon: Target },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">

          {/* CALCULATOR TAB */}
          {activeTab === 'calculator' && (
            <motion.div key="calculator"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Semester Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {semesters.map((sem, idx) => (
                  <button
                    key={sem.id}
                    onClick={() => setActiveSemIdx(idx)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      activeSemIdx === idx
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {sem.name || `Semester ${idx + 1}`}
                  </button>
                ))}
                <button
                  onClick={addSemester}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 text-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Semester Name Editor */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={activeSemester?.name || ''}
                  onChange={e => renameSemester(activeSemIdx, e.target.value)}
                  placeholder="Semester name (e.g. 100L First Semester)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={() => resetSemester(activeSemIdx)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                  title="Reset semester"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {semesters.length > 1 && (
                  <button
                    onClick={() => deleteSemester(activeSemIdx)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                    title="Delete semester"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Grade Reference */}
              <div className="flex gap-2 flex-wrap">
                {gradingSystem.grades.map(g => (
                  <span key={g.grade} className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                    <span className="font-bold text-white">{g.grade}</span> = {g.points} pts ({g.range})
                  </span>
                ))}
              </div>

              {/* Course Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-3 px-4 text-xs text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">Course Name</div>
                <div className="col-span-3">Credit Units</div>
                <div className="col-span-3">Grade</div>
                <div className="col-span-1"></div>
              </div>

              {/* Course Rows */}
              <div className="space-y-2">
                <AnimatePresence>
                  {activeSemester?.courses.map((course, cidx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-12 gap-2 sm:gap-3 p-3 sm:p-2 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-all group"
                    >
                      {/* Course name */}
                      <div className="col-span-12 sm:col-span-5">
                        <input
                          type="text"
                          value={course.name}
                          onChange={e => updateCourse(activeSemIdx, course.id, 'name', e.target.value)}
                          placeholder={`Course ${cidx + 1} (e.g. MTH 101)`}
                          className="w-full bg-transparent border-b border-white/10 focus:border-cyan-500/50 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Units */}
                      <div className="col-span-5 sm:col-span-3">
                        <input
                          type="number"
                          value={course.units}
                          onChange={e => updateCourse(activeSemIdx, course.id, 'units', e.target.value)}
                          placeholder="Units"
                          min="1" max="6"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                      </div>

                      {/* Grade */}
                      <div className="col-span-5 sm:col-span-3 relative grade-dropdown-container">
                        <div
                          onClick={() => setOpenDropdown(openDropdown === course.id ? null : course.id)}
                          className="w-full bg-[#1a2035] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white cursor-pointer flex items-center justify-between"
                        >
                          <span>{course.grade || 'Grade'}</span>
                          <span className="text-gray-400">▾</span>
                        </div>
                        {openDropdown === course.id && (
                          <div className="absolute left-0 right-0 mt-2 rounded-xl bg-[#1a2035] border border-white/10 shadow-xl z-50 overflow-hidden">
                            {gradingSystem.grades.map(g => (
                              <div
                                key={g.grade}
                                onClick={() => {
                                  updateCourse(activeSemIdx, course.id, 'grade', g.grade)
                                  setOpenDropdown(null)
                                }}
                                className="px-3 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
                              >
                                {g.grade} ({g.points})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Delete */}
                      <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
                        <button
                          onClick={() => removeCourse(activeSemIdx, course.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add Course */}
              <button
                onClick={() => addCourse(activeSemIdx)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Course
              </button>

              {/* Semester Result */}
              {semesterResult.gpa > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl border flex items-center justify-between"
                  style={{
                    background: `${semClassification.color}10`,
                    borderColor: `${semClassification.color}30`
                  }}
                >
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Semester GPA</p>
                    <p className="text-2xl font-bold text-white">{semesterResult.gpa.toFixed(2)}</p>
                    <p className="text-xs mt-1" style={{ color: semClassification.color }}>
                      {semClassification.label} — {semesterResult.totalUnits} credit units
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-30" style={{ color: semClassification.color }} />
                </motion.div>
              )}

              {hasGradedCourse && (
                <div className="mt-4 p-5 rounded-3xl border border-white/10 bg-[#08101f]">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">AI Insights</p>
                      <p className="text-xs text-gray-500">Real calculated guidance based on your CGPA</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-300">S</span>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Standing</p>
                        <p className="text-sm text-white">{aiStanding}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-300">T</span>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Target</p>
                        <p className="text-sm text-white">{aiTarget}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-300">P</span>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tip</p>
                        <p className="text-sm text-white">{aiTip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SEMESTERS TAB */}
          {activeTab === 'semesters' && (
            <motion.div key="semesters"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">All Semesters</h3>
                <button onClick={addSemester}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add Semester
                </button>
              </div>

              {semesters.map((sem, idx) => {
                const res = allSemesterResults[idx]
                const cls = getClassification(res.gpa, system)
                return (
                  <motion.div
                    key={sem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all"
                    onClick={() => { setActiveSemIdx(idx); setActiveTab('calculator') }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                      style={{ background: `${cls.color}15`, color: cls.color }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{sem.name || `Semester ${idx + 1}`}</p>
                      <p className="text-xs text-gray-400">{res.totalUnits} units · {sem.courses.filter(c => c.grade).length} courses graded</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{res.gpa > 0 ? res.gpa.toFixed(2) : '—'}</p>
                      {res.gpa > 0 && (
                        <p className="text-xs" style={{ color: cls.color }}>{cls.label}</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {/* Overall Summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Cumulative GPA</p>
                    <p className="text-3xl font-black text-white">{cgpa > 0 ? cgpa.toFixed(2) : '—'}</p>
                    {cgpa > 0 && <p className="text-sm mt-1" style={{ color: classification.color }}>{classification.label}</p>}
                  </div>
                  <GraduationCap className="w-12 h-12 text-cyan-400/30" />
                </div>
              </div>
            </motion.div>
          )}

          {/* PREDICTOR TAB */}
          {activeTab === 'predictor' && (
            <motion.div key="predictor"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300 leading-relaxed">
                  Enter your target graduation CGPA and remaining credit units to see what GPA you need going forward.
                  Current CGPA: <strong className="text-white">{cgpa > 0 ? cgpa.toFixed(2) : 'Not calculated yet'}</strong>
                </p>
              </div>

              {/* Target Classification Buttons */}
              <div>
                <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Quick Target</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {gradingSystem.classifications.filter(c => c.min > 0).map(cls => (
                    <button
                      key={cls.label}
                      onClick={() => setTargetGPA(cls.min.toString())}
                      className="p-3 rounded-xl border text-left transition-all hover:scale-105"
                      style={{
                        background: `${cls.color}10`,
                        borderColor: parseFloat(targetGPA) === cls.min ? cls.color : `${cls.color}30`,
                      }}
                    >
                      <p className="text-xs font-semibold" style={{ color: cls.color }}>{cls.label}</p>
                      <p className="text-sm font-bold text-white mt-0.5">{cls.min.toFixed(2)}+</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Target CGPA</label>
                  <input
                    type="number"
                    value={targetGPA}
                    onChange={e => setTargetGPA(e.target.value)}
                    placeholder={`e.g. ${(gradingSystem.maxGPA * 0.9).toFixed(1)}`}
                    min="0" max={gradingSystem.maxGPA} step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Remaining Credit Units</label>
                  <input
                    type="number"
                    value={remainingUnits}
                    onChange={e => setRemainingUnits(e.target.value)}
                    placeholder="e.g. 60"
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Prediction Result */}
              <AnimatePresence>
                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-2xl border"
                    style={{
                      background: prediction.isAlreadyAchieved
                        ? 'rgba(0, 212, 170, 0.1)'
                        : prediction.isAchievable
                          ? 'rgba(14, 165, 233, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                      borderColor: prediction.isAlreadyAchieved
                        ? 'rgba(0, 212, 170, 0.3)'
                        : prediction.isAchievable
                          ? 'rgba(14, 165, 233, 0.3)'
                          : 'rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    {prediction.isAlreadyAchieved ? (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                          <p className="font-semibold text-green-400">Target Already Achieved! 🎉</p>
                          <p className="text-sm text-gray-300 mt-1">Your current CGPA of {cgpa.toFixed(2)} already meets your target. Keep it up!</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          {prediction.isAchievable
                            ? <TrendingUp className="w-6 h-6 text-cyan-400" />
                            : <AlertCircle className="w-6 h-6 text-red-400" />
                          }
                          <p className="font-semibold text-white">
                            {prediction.isAchievable ? 'Target is achievable!' : 'Target may be difficult'}
                          </p>
                        </div>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-4xl font-black text-white">{prediction.requiredGPA.toFixed(2)}</span>
                          <span className="text-gray-400 text-sm mb-1">required GPA per semester</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          You need an average GPA of <strong className="text-white">{prediction.requiredGPA.toFixed(2)}</strong> across your remaining <strong className="text-white">{remainingUnits}</strong> credit units to reach a CGPA of <strong className="text-white">{parseFloat(targetGPA).toFixed(2)}</strong>.
                        </p>
                        {!prediction.isAchievable && (
                          <p className="text-xs text-red-300 mt-2">
                            This exceeds the maximum GPA of {gradingSystem.maxGPA.toFixed(1)}. Consider adjusting your target or speaking with your academic advisor.
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}