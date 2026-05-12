export interface PaginationMeta {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
}

export interface ApiMeta {
  pagination?: PaginationMeta | null;
  search?: any | null;
  filters?: any[] | null;
  sorting?: any[] | null;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string[];
  data?: T | null;
  meta?: ApiMeta | null;
  errors: string[] | null;
}
