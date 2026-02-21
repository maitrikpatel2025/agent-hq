export interface ActivityEntry {
  id: string;
  agentId: string;
  agentName: string;
  agentEmoji: string;
  timestamp: string;
  message: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  channel: string;
  skill: string | null;
  sessionId: string;
  responseTimeMs: number;
}

export interface AgentFilterOption {
  id: string;
  name: string;
  emoji: string;
}

export interface ActivityFilters {
  agents: AgentFilterOption[];
  models: string[];
  channels: string[];
  skills: string[];
}

export interface ActiveFilters {
  agentId: string | null;
  model: string | null;
  channel: string | null;
  skill: string | null;
  dateRange: { start: string; end: string } | null;
  search: string;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SortField =
  | "timestamp"
  | "agentName"
  | "model"
  | "totalTokens"
  | "cost"
  | "responseTimeMs";

export type SortDirection = "asc" | "desc";

export interface ActivityProps {
  activities: ActivityEntry[];
  filters: ActivityFilters;
  activeFilters: ActiveFilters;
  pagination: Pagination;
  sortField: SortField;
  sortDirection: SortDirection;
  expandedRowId: string | null;
  isLive: boolean;

  /** Called when a filter value changes */
  onFilterChange: (filters: Partial<ActiveFilters>) => void;

  /** Called when all filters are cleared */
  onClearFilters: () => void;

  /** Called when a column header is clicked to change sort */
  onSort: (field: SortField) => void;

  /** Called when a row is clicked to expand or collapse it */
  onToggleRow: (activityId: string) => void;

  /** Called when the page changes */
  onPageChange: (page: number) => void;
}
