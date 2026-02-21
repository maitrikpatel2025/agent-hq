import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/shell'
import Dashboard from './pages/Dashboard'
import Agents from './pages/Agents'
import Activity from './pages/Activity'
import Usage from './pages/Usage'
import Jobs from './pages/Jobs'
import Tasks from './pages/Tasks'
import Skills from './pages/Skills'
import AiCouncil from './pages/AiCouncil'
import SettingsPage from './pages/Settings'
import Help from './pages/Help'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/' },
  { label: 'Agents', href: '/agents' },
  { label: 'Activity', href: '/activity' },
  { label: 'Usage', href: '/usage' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Tasks', href: '/tasks' },
  { label: 'Skills', href: '/skills' },
  { label: 'AI Council', href: '/ai-council' },
]

const user = { name: 'Operator' }

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      if (stored) return stored === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev)
  }, [])

  const handleNavigate = useCallback(
    (href) => {
      navigate(href)
    },
    [navigate],
  )

  const navigationItems = NAV_ITEMS.map((item) => ({
    ...item,
    isActive:
      item.href === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.href),
  }))

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={handleNavigate}
      onLogout={() => {}}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/usage" element={<Usage />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/ai-council" element={<AiCouncil />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
