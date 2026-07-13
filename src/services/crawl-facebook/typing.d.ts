declare module MCrawlFacebook {
  interface IPagePostInput {
    url: string;
    num_of_posts?: number;
    posts_to_not_include?: string[];
    start_date?: string; // MM-DD-YYYY
    end_date?: string; // MM-DD-YYYY
  }

  interface IPagePostRequest {
    input: IPagePostInput[];
  }

  interface IGroupPostInput {
    url: string;
    user_to_not_include?: string;
    start_date?: string;
    end_date?: string;
  }

  interface IGroupPostRequest {
    input: IGroupPostInput[];
  }

  interface IProfileInput {
    url: string;
  }

  interface IProfileRequest {
    input: IProfileInput[];
  }

  interface IPageProfileInput {
    url: string;
  }

  interface IPageProfileRequest {
    input: IPageProfileInput[];
  }

  interface IReelInput {
    url: string;
    start_date?: string;
    end_date?: string;
  }

  interface IReelRequest {
    input: IReelInput[];
  }

  interface ISnapshotParams {
    scraper_type?: string;
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
}
