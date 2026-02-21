export type JobRunStatus = "success" | "failed" | "running";

export interface Job {
  id: string;
  name: string;
  agentId: string;
  agentEmoji: string;
  agentName: string;
  schedule: string;
  scheduleHuman: string;
  timezone: string;
  enabled: boolean;
  lastRunAt: string | null;
  lastRunStatus: JobRunStatus | null;
  nextRunAt: string | null;
  instructions: string;
}

export interface JobRun {
  id: string;
  jobId: string;
  startedAt: string;
  status: JobRunStatus;
  durationMs: number | null;
}

export interface JobsProps {
  jobs: Job[];
  jobRuns: Record<string, JobRun[]>;

  /** Called when a job's enabled toggle is switched */
  onToggleEnabled?: (jobId: string, enabled: boolean) => void;
}
