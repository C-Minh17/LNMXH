import axios from "@/utils/axios";
import { ipTiktokBrightdata } from "@/utils/ip";

// --- I. CRAWL PROFILE ---

// 1. Crawl profile theo URL
export async function crawlTiktokProfiles(
  data: MCrawlTiktok.IProfileRequest,
): Promise<MCrawlTiktok.IBaseResponse<MCrawlTiktok.ISnapshotData>> {
  return await axios.post(`${ipTiktokBrightdata}/profiles`, data).then((res) => res.data);
}

// 2. Discover profile theo search URL
export async function discoverTiktokProfilesBySearchUrl(
  data: MCrawlTiktok.ISearchProfileRequest,
): Promise<MCrawlTiktok.IBaseResponse<MCrawlTiktok.ISnapshotData>> {
  return await axios.post(`${ipTiktokBrightdata}/profiles/discover-by-search-url`, data).then((res) => res.data);
}

// --- II. CRAWL POSTS / VIDEOS ---

// 1. Crawl video theo URL
export async function crawlTiktokPosts(
  data: MCrawlTiktok.IPostRequest,
): Promise<MCrawlTiktok.IBaseResponse<MCrawlTiktok.ISnapshotData>> {
  return await axios.post(`${ipTiktokBrightdata}/posts`, data).then((res) => res.data);
}

// 2. Discover video theo Keyword / Hashtag
export async function discoverTiktokPostsByKeyword(
  data: MCrawlTiktok.IKeywordPostRequest,
): Promise<MCrawlTiktok.IBaseResponse<MCrawlTiktok.ISnapshotData>> {
  return await axios.post(`${ipTiktokBrightdata}/posts/discover-by-keyword`, data).then((res) => res.data);
}

// 3. Discover video theo Profile URL
export async function discoverTiktokPostsByProfileUrl(
  data: MCrawlTiktok.IProfilePostRequest,
): Promise<MCrawlTiktok.IBaseResponse<MCrawlTiktok.ISnapshotData>> {
  return await axios.post(`${ipTiktokBrightdata}/posts/discover-by-profile-url`, data).then((res) => res.data);
}

// 4. Discover video theo trang Discover
export async function discoverTiktokPostsByUrl(
  data: MCrawlTiktok.IDiscoverPostRequest,
): Promise<MCrawlTiktok.IBaseResponse<MCrawlTiktok.ISnapshotData>> {
  return await axios.post(`${ipTiktokBrightdata}/posts/discover-by-url`, data).then((res) => res.data);
}

// --- III. XỬ LÝ TRANSCRIPT (STT) & LẤY KẾT QUẢ ASYNC ---

// 1. Lấy script cho các video đã crawl còn thiếu
export async function processTiktokScripts(
  params?: MCrawlTiktok.IProcessScriptsParams,
): Promise<MCrawlTiktok.IBaseResponse> {
  return await axios.post(`${ipTiktokBrightdata}/posts/process-scripts`, {}, { params }).then((res) => res.data);
}

// 2. Lấy script cho 1 record cụ thể
export async function processTiktokScriptByRecordId(
  record_id: number,
): Promise<MCrawlTiktok.IBaseResponse> {
  return await axios.post(`${ipTiktokBrightdata}/records/${record_id}/process-script`, {}).then((res) => res.data);
}

// 3. Lấy kết quả snapshot (async)
export async function getTiktokSnapshot(
  snapshot_id: string,
  params?: MCrawlTiktok.ISnapshotParams,
): Promise<MCrawlTiktok.IBaseResponse<MCrawlTiktok.ISnapshotData>> {
  return await axios.get(`${ipTiktokBrightdata}/snapshot/${snapshot_id}`, { params }).then((res) => res.data);
}
