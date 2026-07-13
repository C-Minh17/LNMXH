import axios from "@/utils/axios";
import { ipFacebookBrightdata } from "@/utils/ip";

export async function crawlFacebookPagePosts(data: MCrawlFacebook.IPagePostRequest): Promise<MCrawlFacebook.IBaseResponse> {
  return await axios.post(`${ipFacebookBrightdata}/page-posts`, data).then((res) => res.data);
}

export async function crawlFacebookGroupPosts(data: MCrawlFacebook.IGroupPostRequest): Promise<MCrawlFacebook.IBaseResponse> {
  return await axios.post(`${ipFacebookBrightdata}/group-posts`, data).then((res) => res.data);
}

export async function crawlFacebookProfiles(data: MCrawlFacebook.IProfileRequest): Promise<MCrawlFacebook.IBaseResponse> {
  return await axios.post(`${ipFacebookBrightdata}/profiles`, data).then((res) => res.data);
}

export async function crawlFacebookPagesProfiles(data: MCrawlFacebook.IPageProfileRequest): Promise<MCrawlFacebook.IBaseResponse> {
  return await axios.post(`${ipFacebookBrightdata}/pages-profiles`, data).then((res) => res.data);
}

export async function crawlFacebookReels(data: MCrawlFacebook.IReelRequest): Promise<MCrawlFacebook.IBaseResponse> {
  return await axios.post(`${ipFacebookBrightdata}/reels`, data).then((res) => res.data);
}

export async function getFacebookSnapshot(snapshot_id: string, params?: MCrawlFacebook.ISnapshotParams): Promise<MCrawlFacebook.IBaseResponse> {
  return await axios.get(`${ipFacebookBrightdata}/snapshot/${snapshot_id}`, { params }).then((res) => res.data);
}
