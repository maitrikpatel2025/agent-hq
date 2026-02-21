import type { CouncilSynthesis } from '../types'
import { Sparkles, Check, X, ArrowRight } from 'lucide-react'

interface SynthesisPanelProps {
  synthesis: CouncilSynthesis
}

export function SynthesisPanel({ synthesis }: SynthesisPanelProps) {
  return (
    <div className="mt-2 rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-gradient-to-b from-violet-50/80 to-white dark:from-violet-950/30 dark:to-stone-900 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-violet-100 dark:border-violet-900/40 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/60 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-sm font-semibold text-violet-900 dark:text-violet-200">
          Council Synthesis
        </h3>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Summary */}
        <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
          {synthesis.summary}
        </p>

        {/* Agreements */}
        {synthesis.agreements.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Areas of Agreement
            </h4>
            <ul className="space-y-2">
              {synthesis.agreements.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500 shrink-0" />
                  <span className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disagreements */}
        {synthesis.disagreements.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2.5 flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" />
              Areas of Disagreement
            </h4>
            <ul className="space-y-2">
              {synthesis.disagreements.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0" />
                  <span className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        <div className="rounded-xl bg-violet-100/60 dark:bg-violet-900/30 border border-violet-200/60 dark:border-violet-800/40 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300 mb-2 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5" />
            Recommendation
          </h4>
          <p className="text-sm leading-relaxed text-violet-900 dark:text-violet-200">
            {synthesis.recommendation}
          </p>
        </div>
      </div>
    </div>
  )
}
