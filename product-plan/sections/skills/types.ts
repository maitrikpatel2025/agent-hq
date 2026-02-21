/** A minimal agent reference for skill assignment UI */
export interface AgentRef {
  id: string;
  emoji: string;
  name: string;
  role: string;
}

/** A capability that can be assigned to agents */
export interface Skill {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  agentIds: string[];
}

export interface SkillsProps {
  skills: Skill[];
  agents: AgentRef[];

  /** Called when a skill's global enabled state is toggled */
  onToggleSkill?: (skillId: string, enabled: boolean) => void;

  /** Called when a skill is selected to open the detail modal */
  onSelectSkill?: (skillId: string) => void;

  /** Called when a skill's per-agent assignment is toggled */
  onToggleAgentSkill?: (skillId: string, agentId: string, enabled: boolean) => void;
}
