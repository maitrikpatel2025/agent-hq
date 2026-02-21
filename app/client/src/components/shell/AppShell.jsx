import { useState, useEffect, useCallback } from 'react'
import { Menu, X, ChevronsLeft, ChevronsRight, Sun, Moon } from 'lucide-react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

const UTILITY_ITEMS = [
  { label: 'Settings', href: '/settings' },
  { label: 'Help', href: '/help' },
]

export default function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('shell-sidebar-collapsed') === 'true'
    }
    return false
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  // Persist collapse state
  useEffect(() => {
    localStorage.setItem('shell-sidebar-collapsed', String(collapsed))
  }, [collapsed])

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavigate = useCallback(
    (href) => {
      setMobileOpen(false)
      onNavigate?.(href)
    },
    [onNavigate],
  )

  return (
    <div className="h-screen flex bg-stone-100 dark:bg-stone-900" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          shrink-0 bg-stone-50 dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800
          flex flex-col transition-[width] duration-200 ease-in-out

          max-md:fixed max-md:top-0 max-md:left-0 max-md:bottom-0 max-md:z-50 max-md:w-60
          max-md:transition-transform max-md:duration-200 max-md:ease-in-out
          ${mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}

          ${collapsed ? 'md:w-16' : 'md:w-60'}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center h-14 px-4 shrink-0 border-b border-stone-200 dark:border-stone-800">
          {collapsed ? (
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center mx-auto">
              <span className="text-white text-xs font-bold tracking-tight">AH</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold tracking-tight">AH</span>
              </div>
              <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Agent HQ
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3">
          <MainNav
            items={navigationItems}
            utilityItems={UTILITY_ITEMS}
            collapsed={collapsed}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden md:flex items-center justify-center py-3 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronsRight className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <ChevronsLeft className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </aside>

      {/* Right side: header + content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          {/* Left: mobile menu toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-md text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>

            {/* Mobile app name */}
            <span className="md:hidden text-sm font-semibold text-stone-900 dark:text-stone-100">
              Agent HQ
            </span>
          </div>

          {/* Right: dark mode toggle + user menu */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-md text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-4.5 h-4.5" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4.5 h-4.5" strokeWidth={1.5} />
              )}
            </button>
            <UserMenu user={user} onLogout={onLogout} />
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
