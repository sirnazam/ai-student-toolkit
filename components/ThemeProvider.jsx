'use client'

import { useEffect, useState } from 'react'

export default function ThemeProvider({ children }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Initialize theme on mount
    const savedTheme = localStorage.getItem('toolkit-theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
    setIsMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
