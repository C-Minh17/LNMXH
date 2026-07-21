import axios from "@/utils/axios";
import { ipInstagramBrightdata } from "@/utils/ip";


// 1. Crawl profile theo URL
export async function crawlIgProfiles(
  data: MCrawlIg.IProfileRequest,
  params?: { wait?: boolean },
): Promise<MCrawlIg.IBaseResponse<MCrawlIg.ISnapshotData>> {
  return await axios.post(`${ipInstagramBrightdata}/profiles`, data, { params }).then((res) => res.data);
}

// 2. Discover profile theo username
export async function discoverIgProfilesByUsername(
  data: MCrawlIg.IDiscoverProfileRequest,
  params?: { wait?: boolean },
): Promise<MCrawlIg.IBaseResponse<MCrawlIg.ISnapshotData>> {
  return await axios.post(`${ipInstagramBrightdata}/profiles/discover-by-user-name`, data, { params }).then((res) => res.data);
}


// 3. Crawl bài viết theo URL
export async function crawlIgPosts(
  data: MCrawlIg.IPostRequest,
  params?: { wait?: boolean },
): Promise<MCrawlIg.IBaseResponse<MCrawlIg.ISnapshotData>> {
  return await axios.post(`${ipInstagramBrightdata}/posts`, data, { params }).then((res) => res.data);
}


//4. Lấy kết quả snapshot (async)
export async function getIgSnapshot(
  snapshot_id: string,
  params?: MCrawlIg.ISnapshotParams,
): Promise<MCrawlIg.IBaseResponse<MCrawlIg.ISnapshotData>> {
  return await axios.get(`${ipInstagramBrightdata}/snapshot/${snapshot_id}`, { params }).then((res) => res.data);
}

// 5. Lấy danh sách records đã crawl
export async function getIgRecords(
  params?: MCrawlIg.IRecordParams,
): Promise<MCrawlIg.IBaseResponse<MCrawlIg.IRecord[]>> {
  return await axios.get(`${ipInstagramBrightdata}/records`, { params }).then((res) => res.data);
}

// 6. Lấy chi tiết 1 record đã crawl
export async function getIgRecordDetail(
  record_id: number,
): Promise<MCrawlIg.IBaseResponse<MCrawlIg.IRecord>> {
  return await axios.get(`${ipInstagramBrightdata}/records/${record_id}`).then((res) => res.data);
}
