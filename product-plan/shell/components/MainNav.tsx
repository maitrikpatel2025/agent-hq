import {
  LayoutDashboard,
  Bot,
  Activity,
  BarChart3,
  Clock,
  CheckSquare,
  Zap,
  MessageSquare,
  Settings,
  HelpCircle,
  Circle,
} from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

export interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string; strokeWidth?: number }>

const iconMap: Record<string, IconComponent> = {
  Dashboard: LayoutDashboard,
  Agents: Bot,
  Activity: Activity,
  Usage: BarChart3,
  Jobs: Clock,
  Tasks: CheckSquare,
  Skills: Zap,
  'AI Council': MessageSquare,
  Settings: Settings,
  Help: HelpCircle,
}

interface MainNavProps {
  items: NavigationItem[]
  utilityItems?: NavigationItem[]
  collapsed?: boolean
  onNavigate?: (href: string) => void
}

export function MainNav({ items, utilityItems, collapsed = false, onNavigate }: MainNavProps) {
  const getIcon = (label: string): IconComponent => iconMap[label] || Circle

  const renderItem = (item: NavigationItem) => {
    const Icon = getIcon(item.label)

    return (
      <button
        key={item.href}
        onClick={() => onNavigate?.(item.href)}
        className={`
          w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors
          ${collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2'}
          ${
            item.isActive
              ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
          }
        `}
        title={collapsed ? item.label : undefined}
      >
        <Icon
          className={`w-[18px] h-[18px] shrink-0 ${
            item.isActive ? 'text-violet-600 dark:text-violet-400' : ''
          }`}
          strokeWidth={1.75}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>
    )
  }

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 px-2 space-y-0.5">
        {items.map(renderItem)}
      </div>

      {utilityItems && utilityItems.length > 0 && (
        <div className="px-2 pt-2 mt-2 border-t border-stone-200 dark:border-stone-800 space-y-0.5 pb-1">
          {utilityItems.map(renderItem)}
        </div>
      )}
    </nav>
  )
}
