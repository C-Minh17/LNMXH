declare module MCrawlSource {
  interface IRecord {
    id: number;
    name: string;
    platform: string;
    scraper_type: string;
    config: Record<string, any>;
    limit_per_input: number;
    frequency_minutes: number;
    is_active: boolean;
    description: string;
    last_run_at: number;
    next_run_at: number;
    created_at: number;
    updated_at: number;
  }

  interface ICreateSource {
    config: Record<string, any>;
    description: string;
    frequency_minutes: number;
    is_active: boolean;
    name: string;
    platform: string;
    scraper_type: string;
  }

  interface IParams {
    sort_by?: string;
    order?: 'asc' | 'desc';
    page_size?: number;
    page?: number;
  }

  interface ISourceField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    description: string;
  }

  interface ISourceType {
    platform: string;
    scraper_type: string;
    label: string;
    dataset_id: string;
    fields: ISourceField[];
  }
}