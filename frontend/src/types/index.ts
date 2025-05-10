export interface Joke {
  id?: number;
  joke_id?: string;
  type: string;
  setup: string;
  punchline: string;
  rating?: number;
  votes?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export type SortField = "setup" | "type" | "rating";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}
