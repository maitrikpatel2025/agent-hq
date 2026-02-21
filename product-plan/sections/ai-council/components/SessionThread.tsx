import type { CouncilSession, Agent } from '../types'
import { ArrowLeft, Clock, Users, MessageSquare } from 'lucide-react'
import { SynthesisPanel } from './SynthesisPanel'

interface SessionThreadProps {
  session: CouncilSession
  agents: Agent[]
  onBack?: () => void
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function formatFullDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatDuration(start: string, end: string | null): string {
  if (!end) return 'Ongoing'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  const mins = Math.round(ms / 60000)
  if (mins < 1) return 'Less than a minute'
  return `${mins} min`
}

export function SessionThread({ session, agents, onBack }: SessionThreadProps) {
  const participants = agents.filter((a) => session.participantIds.includes(a.id))
  const agentMap = new Map(agents.map((a) => [a.id, a]))
  const isActive = session.status === 'in-progress'

  return (
    <div
      className="min-h-screen bg-stone-50 dark:bg-stone-950"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          All Sessions
        </button>

        {/* Session header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
              }`}
            >
              {isActive && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
              )}
              {isActive ? 'In Progress' : 'Completed'}
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500 capitalize" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
              {session.format.replace('-', ' ')}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-4">
            {session.topic}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-400 dark:text-stone-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
                {formatFullDate(session.createdAt)} &middot; {formatDuration(session.createdAt, session.completedAt)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Participant strip */}
          <div className="flex flex-wrap gap-2 mt-4">
            {participants.map((agent) => (
              <div
                key={agent.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs"
              >
                <span>{agent.emoji}</span>
                <span className="font-medium text-stone-700 dark:text-stone-300">{agent.name}</span>
                <span className="text-stone-400 dark:text-stone-500">{agent.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-200 dark:border-stone-800 mb-8" />

        {/* Message thread */}
        <div className="space-y-6">
          {session.messages.map((msg, idx) => {
            const agent = agentMap.get(msg.agentId)
            if (!agent) return null

            return (
              <div key={msg.id} className="group">
                {/* Agent header */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 ring-2 ring-white dark:ring-stone-950">
                    <span className="text-sm">{agent.emoji}</span>
                  </div>
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {agent.name}
                    </span>
                    <span className="text-xs text-stone-400 dark:text-stone-500 truncate">
                      {agent.role}
                    </span>
                  </div>
                  <span
                    className="ml-auto text-xs text-stone-300 dark:text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>

                {/* Message body */}
                <div className="ml-[42px]">
                  <div className="rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-3">
                    <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>

                {/* Thread connector line (except last) */}
                {idx < session.messages.length - 1 && !session.synthesis && (
                  <div className="ml-[18px] mt-2 h-4 border-l-2 border-stone-200 dark:border-stone-800" />
                )}
                {idx < session.messages.length - 1 && session.synthesis && (
                  <div className="ml-[18px] mt-2 h-4 border-l-2 border-stone-200 dark:border-stone-800" />
                )}
              </div>
            )
          })}

          {/* In-progress indicator */}
          {isActive && (
            <div className="flex items-center gap-3 ml-[42px] py-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-stone-400 dark:text-stone-500">
                Waiting for more responses...
              </span>
            </div>
          )}
        </div>

        {/* Synthesis */}
        {session.synthesis && (
          <div className="mt-8">
            <SynthesisPanel synthesis={session.synthesis} />
          </div>
        )}
      </div>
    </div>
  )
}
