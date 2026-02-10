declare module MManagePostV2 {
  interface IRecord {
    id: number,
    created_at: number,
    updated_at: number,
    title: string,
    content: string,
    data_type: string,
    url: string,
    document_type: string,
    meta_data: any
  }

  interface ICrawl {
    query: string,
    total_results: number,
    created_count: number,
    skipped_count: number,
    errors_count: number,
    created_post_ids: number[],
    errors: any,
    tavily_results: MManagePostV2.IResults[]
  }

  interface ICrawlInput {
    query: string,
    max_results: number,
    search_depth: advanced,
    start_date: string,
    end_date: string,
    skip_existing: boolean,
  }

  interface IResults {
    url: string,
    title: string,
    content: string,
    raw_content: string,
    score: number
  }
}