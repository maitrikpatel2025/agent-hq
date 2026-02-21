export interface Agent {
  id: string;
  emoji: string;
  name: string;
  role: string;
  model: string;
}

export interface CouncilMessage {
  id: string;
  agentId: string;
  content: string;
  timestamp: string;
}

export interface CouncilSynthesis {
  summary: string;
  agreements: string[];
  disagreements: string[];
  recommendation: string;
}

export type SessionStatus = "in-progress" | "completed";

export interface CouncilSession {
  id: string;
  topic: string;
  format: string;
  status: SessionStatus;
  createdAt: string;
  completedAt: string | null;
  participantIds: string[];
  messages: CouncilMessage[];
  synthesis: CouncilSynthesis | null;
}

export interface DebateFormat {
  id: string;
  label: string;
  description: string;
}

export interface AICouncilProps {
  agents: Agent[];
  sessions: CouncilSession[];
  debateFormats: DebateFormat[];
  /** Called when the user submits a new council session */
  onCreateSession?: (topic: string, participantIds: string[], formatId: string) => void;
  /** Called when the user selects a session to view */
  onSelectSession?: (sessionId: string) => void;
}
