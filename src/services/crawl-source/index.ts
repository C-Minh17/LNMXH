import axios from "@/utils/axios";
import { ipCrawlSource } from "@/utils/ip";

export async function getCrawlSourceTypes() {
  return await axios.get(`${ipCrawlSource}/types`).then((res) => res.data);
}

export async function getCrawlSources(params?: MCrawlSource.IParams) {
  return await axios.get(ipCrawlSource, { params }).then((res) => res.data);
}

export async function createCrawlSource(data: MCrawlSource.ICreateSource) {
  return await axios.post(ipCrawlSource, data);
}

export async function getCrawlSourceDetail(source_id: number) {
  return await axios.get(`${ipCrawlSource}/${source_id}`).then((res) => res.data);
}

export async function updateCrawlSource(source_id: number, data: MCrawlSource.ICreateSource) {
  return await axios.put(`${ipCrawlSource}/${source_id}`, data);
}

export async function deleteCrawlSource(source_id: number) {
  return await axios.delete(`${ipCrawlSource}/${source_id}`);
}

export async function runCrawlSource(source_id: number) {
  return await axios.post(`${ipCrawlSource}/${source_id}/run`);
}

export async function getCrawlSourceRecords(source_id: number, params?: any) {
  return await axios.get(`${ipCrawlSource}/${source_id}/records`, { params }).then((res) => res.data);
}

export async function getCrawlSourceDashboard(): Promise<MCrawlSource.IDashboardResponse> {
  return await axios.get(`${ipCrawlSource}/dashboard`).then((res) => res.data);
}
