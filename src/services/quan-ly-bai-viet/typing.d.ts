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

  interface IParamPost {
    sort_by: string | null | undefined,
    order: string | null | undefined,
    page_size: number | null | undefined,
    page: number | null | undefined,
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
  }

  // interface IResults {
  //   url: string,
  //   title: string,
  //   content: string,
  //   raw_content: string,
  //   score: number
  // }

  interface ISearch {
    url: string,
    title: string,
    content: string,
    extracted_data: MManagePostV2.IExtractedData,
    tavily_score: number,
    already_exists: boolean,
    error: string
  }

  interface IExtractedData {
    url: string,
    title: string,
    content: string,
    data_type: string,
    meta_data: any
  }

  interface ICreateFromSearch {
    url: string,
    title: string,
    content: string,
    document_type: "external" | "internal",
    newspaper_type: string,
    source: string,
    meta_data: any,
  }
}