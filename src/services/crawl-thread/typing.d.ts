declare module MCrawlThreads {
  interface IProfileInput {
    url: string;
  }

  interface IProfileRequest {
    input: IProfileInput[];
  }


  interface IPostInput {
    url: string;
  }

  interface IPostRequest {
    input: IPostInput[];
  }

  interface IDiscoverProfilePostInput {
    profile_url: string;
    start_date: string; // ISO 8601 string
    end_date: string; // ISO 8601 string
  }

  interface IDiscoverProfilePostRequest {
    input: IDiscoverProfilePostInput[];
  }


  interface ISnapshotParams {
    scraper_type?: string;
  }

  interface IRecordParams {
    scraper_type?: string;
    snapshot_id?: string;
    only_errors?: boolean;
    sort_by?: string;
    order?: 'asc' | 'desc';
    page_size?: number;
    page?: number;
    source_id?: number;
  }

  interface IRecord {
    id: number;
    created_at: number;
    updated_at: number;
    scraper_type: string;
    dataset_id: string;
    snapshot_id: string;
    record_id: string;
    record_url: string;
    error?: string;
    raw_data?: any;
  }


  interface IBaseResponse<T = any> {
    http_code: number;
    success: boolean;
    message: string;
    metadata?: {
      page?: number;
      page_size?: number;
      total?: number;
    };
    data?: T;
  }

  interface ISnapshotData<R = any> {
    dataset_id?: string;
    scraper_type?: string;
    snapshot_id?: string;
    status?: string;
    total_records?: number;
    saved_count?: number;
    records?: R[];
  }
}
