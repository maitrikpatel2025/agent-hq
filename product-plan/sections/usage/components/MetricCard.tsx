import { TrendingDown, TrendingUp } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  previousValue?: number
  currentValue?: number
  sparkline?: number[]
  accentColor?: 'violet' | 'emerald' | 'amber' | 'sky'
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 80
  const h = 28
  const pad = 2

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (v - min) / range) * (h - pad * 2)
    return { x, y }
  })

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`

  const colorMap: Record<string, { stroke: string; fill: string }> = {
    violet: { stroke: '#8b5cf6', fill: '#8b5cf620' },
    emerald: { stroke: '#10b981', fill: '#10b98120' },
    amber: { stroke: '#f59e0b', fill: '#f59e0b20' },
    sky: { stroke: '#0ea5e9', fill: '#0ea5e920' },
  }
  const c = colorMap[color] || colorMap.violet

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-7" preserveAspectRatio="none">
      <path d={area} fill={c.fill} />
      <path d={line} fill="none" stroke={c.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MetricCard({
  label,
  value,
  previousValue,
  currentValue,
  sparkline,
  accentColor = 'violet',
}: MetricCardProps) {
  const hasDelta = previousValue !== undefined && currentValue !== undefined && previousValue > 0
  const delta = hasDelta ? currentValue! - previousValue! : 0
  const deltaPercent = hasDelta ? Math.abs((delta / previousValue!) * 100) : 0
  const isDown = delta < 0

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none p-5 flex flex-col gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
        {label}
      </span>

      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <span
            className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 truncate"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            {value}
          </span>
          {hasDelta && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-lg shrink-0 ${
                isDown
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
              }`}
            >
              {isDown ? (
                <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
              ) : (
                <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
              )}
              {deltaPercent.toFixed(1)}%
            </span>
          )}
        </div>
        {sparkline && sparkline.length > 1 && (
          <Sparkline data={sparkline} color={accentColor} />
        )}
      </div>
    </div>
  )
}
