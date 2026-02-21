import type { TimeSeriesPoint } from '../types'

interface UsageChartProps {
  data: TimeSeriesPoint[]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function UsageChart({ data }: UsageChartProps) {
  if (data.length < 2) return null

  const costs = data.map((d) => d.cost)
  const maxCost = Math.max(...costs)
  const minCost = 0
  const range = maxCost - minCost || 1

  const w = 800
  const h = 220
  const padX = 50
  const padTop = 20
  const padBottom = 30
  const chartW = w - padX
  const chartH = h - padTop - padBottom

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padTop + (1 - (d.cost - minCost) / range) * chartH,
    cost: d.cost,
    date: d.date,
  }))

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${points[points.length - 1].x},${padTop + chartH} L${points[0].x},${padTop + chartH} Z`

  // Y-axis gridlines
  const gridCount = 4
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const val = minCost + (range / gridCount) * i
    const y = padTop + (1 - (val - minCost) / range) * chartH
    return { y, label: `$${val.toFixed(0)}` }
  })

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none p-5">
      <h3 className="text-[13px] font-semibold text-stone-900 dark:text-stone-100 tracking-tight mb-4">
        Cost Over Time
      </h3>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[500px]" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {gridLines.map((g, i) => (
            <g key={i}>
              <line
                x1={padX}
                y1={g.y}
                x2={w}
                y2={g.y}
                stroke="currentColor"
                className="text-stone-100 dark:text-stone-800"
                strokeWidth="1"
              />
              <text
                x={padX - 8}
                y={g.y + 4}
                textAnchor="end"
                className="text-stone-400 dark:text-stone-500"
                fontSize="10"
                fontFamily="'IBM Plex Mono', monospace"
              >
                {g.label}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#costGradient)" />

          {/* Line */}
          <path d={line} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#8b5cf6" stroke="white" strokeWidth="2" className="dark:stroke-stone-900" />
              {/* X-axis label */}
              <text
                x={p.x}
                y={h - 6}
                textAnchor="middle"
                className="text-stone-400 dark:text-stone-500"
                fontSize="10"
                fontFamily="'IBM Plex Mono', monospace"
              >
                {formatShortDate(p.date)}
              </text>
            </g>
          ))}

          {/* Hover tooltip points - visual only, data labels */}
          {points.map((p, i) => (
            <text
              key={`label-${i}`}
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="text-stone-600 dark:text-stone-300"
              fontSize="10"
              fontWeight="600"
              fontFamily="'IBM Plex Mono', monospace"
            >
              ${p.cost.toFixed(2)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}
