declare module MCrawlTiktok {
  // --- I. CRAWL PROFILE ---

  interface IProfileInput {
    country?: string;
    url: string;
  }

  interface IProfileRequest {
    input: IProfileInput[];
  }

  interface ISearchProfileInput {
    country?: string;
    search_url: string;
  }

  interface ISearchProfileRequest {
    input: ISearchProfileInput[];
  }

  // --- II. CRAWL POSTS / VIDEOS ---

  interface IPostInput {
    country?: string;
    url: string;
  }

  interface IPostRequest {
    input: IPostInput[];
    with_script?: boolean;
  }

  interface IKeywordPostInput {
    country?: string;
    search_keyword: string;
  }

  interface IKeywordPostRequest {
    input: IKeywordPostInput[];
    with_script?: boolean;
  }

  interface IProfilePostInput {
    num_of_posts?: number;
    url: string;
    what_to_collect?: string;
  }

  interface IProfilePostRequest {
    input: IProfilePostInput[];
    with_script?: boolean;
  }

  interface IDiscoverPostInput {
    URL: string;
  }

  interface IDiscoverPostRequest {
    input: IDiscoverPostInput[];
    with_script?: boolean;
  }

  // --- III. XỬ LÝ TRANSCRIPT (STT) & LẤY KẾT QUẢ ASYNC ---

  interface IProcessScriptsParams {
    limit?: number;
  }

  interface ISnapshotParams {
    scraper_type?: string;
  }

  interface IRecordParams {
    scraper_type?: string;
    snapshot_id?: string;
    only_errors?: boolean;
    has_script?: boolean;
    sort_by?: string;
    order?: 'asc' | 'desc';
    page_size?: number;
    page?: number;
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
    has_script?: boolean;
    script?: string;
  }

  // --- COMMON RESPONSES ---

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
    total_records?: number;
    saved_count?: number;
    records?: R[];
  }
}
