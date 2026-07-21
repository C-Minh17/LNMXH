import axios from "@/utils/axios";
import { ipThreadsBrightdata } from "@/utils/ip";

// 1. Crawl profile theo URL
export async function crawlThreadsProfiles(
  data: MCrawlThreads.IProfileRequest,
  params?: { wait?: boolean },
): Promise<MCrawlThreads.IBaseResponse<MCrawlThreads.ISnapshotData>> {
  return await axios.post(`${ipThreadsBrightdata}/profiles`, data, { params }).then((res) => res.data);
}

// 2. Crawl bài viết theo URL
export async function crawlThreadsPosts(
  data: MCrawlThreads.IPostRequest,
  params?: { wait?: boolean },
): Promise<MCrawlThreads.IBaseResponse<MCrawlThreads.ISnapshotData>> {
  return await axios.post(`${ipThreadsBrightdata}/posts`, data, { params }).then((res) => res.data);
}

// 3. Discover bài viết theo Profile (Kèm Khoảng Thời Gian)
export async function discoverThreadsPostsByProfile(
  data: MCrawlThreads.IDiscoverProfilePostRequest,
  params?: { wait?: boolean },
): Promise<MCrawlThreads.IBaseResponse<MCrawlThreads.ISnapshotData>> {
  return await axios.post(`${ipThreadsBrightdata}/posts/discover-by-profile`, data, { params }).then((res) => res.data);
}

// 4. Lấy kết quả snapshot (async)
export async function getThreadsSnapshot(
  snapshot_id: string,
  params?: MCrawlThreads.ISnapshotParams,
): Promise<MCrawlThreads.IBaseResponse<MCrawlThreads.ISnapshotData>> {
  return await axios.get(`${ipThreadsBrightdata}/snapshot/${snapshot_id}`, { params }).then((res) => res.data);
}

// 5. Danh sách data đã crawl
export async function getThreadsRecords(
  params?: MCrawlThreads.IRecordParams,
): Promise<MCrawlThreads.IBaseResponse<MCrawlThreads.IRecord[]>> {
  return await axios.get(`${ipThreadsBrightdata}/records`, { params }).then((res) => res.data);
}

// 6. Chi tiết 1 record đã crawl
export async function getThreadsRecordDetail(
  record_id: number,
): Promise<MCrawlThreads.IBaseResponse<MCrawlThreads.IRecord>> {
  return await axios.get(`${ipThreadsBrightdata}/records/${record_id}`).then((res) => res.data);
}
