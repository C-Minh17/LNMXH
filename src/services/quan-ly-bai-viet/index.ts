import axios from "@/utils/axios";
import { ipPost_v1, ipPost_v2 } from "@/utils/ip";

export async function getAllPostV2(params?: MManagePostV2.IParamPost) {
  return await axios.get(`${ipPost_v2}/all`, { params }).then(res => res.data)
}

export async function getPostV2Detail(post_id: number) {
  return await axios.get(`${ipPost_v2}/${post_id}`).then(res => res.data)
}

export async function getPostFilterDocumentTypeV2(document_type: string, params?: MManagePostV2.IParamPost) {
  return await axios.get(`${ipPost_v2}/by-document-type/${document_type}`, { params }).then(res => res.data)
}

export async function getDataTypePostV2() {
  return await axios.get(`${ipPost_v2}/data-types`).then(res => res.data)
}

export async function getPostFilterDataTypeV2(data_type: string, params?: MManagePostV2.IParamPost) {
  return await axios.get(`${ipPost_v2}/by-type/${data_type}`, { params }).then(res => res.data)
}

export async function createPostV2(data: MManagePostV2.IRecord) {
  return await axios.post(`${ipPost_v2}`, data)
}

export async function editPostV2(post_id: number, data: MManagePostV2.IRecord) {
  return await axios.put(`${ipPost_v2}/${post_id}`, data)
}

export async function deletePostV2(post_id: number) {
  return await axios.delete(`${ipPost_v2}/${post_id}`)
}

// export async function createCrawlV2(data: MManagePostV2.ICrawlInput) {
//   return await axios.post(`${ipPost_v2}/crawl`, data)
// }

export async function searchCrawlV2(data: MManagePostV2.ICrawlInput) {
  return await axios.post(`${ipPost_v2}/search`, data)
}

export async function createPostCrawlV2(data: MManagePostV2.ICreateFromSearch) {
  return await axios.post(`${ipPost_v2}/create-from-search`, data)
}

// v1

export async function getSourcePostV1() {
  return await axios.get(`${ipPost_v1}/data-types`).then(res => res.data)
}