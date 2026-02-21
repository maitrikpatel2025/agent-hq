import { useState, useRef, useEffect } from 'react'
import { ChevronDown, LogOut } from 'lucide-react'

export function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const name = user?.name || 'User'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      >
        <div className="relative">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={name}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
              <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
                {initials}
              </span>
            </div>
          )}
          {/* Online status dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full" />
        </div>

        <span className="hidden sm:block text-stone-700 dark:text-stone-300 font-medium">
          {name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{name}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Operator</p>
          </div>
          <button
            onClick={() => {
              setOpen(false)
              onLogout?.()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
