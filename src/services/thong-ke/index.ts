import axios from "@/utils/axios";
import { ipStatistic } from "@/utils/ip";

//extraction
export async function getBackgroundTask(task_id: string) {
  return await axios.get(`${ipStatistic}/tasks/${task_id}`).then(res => res.data)
}

//grdp
export async function getStatisticGrdp(params: MStatistic.QueryParams1) {
  return await axios.get(`${ipStatistic}/grdp`, { params }).then(res => res.data)
}
export async function axtractDataGrdp(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/grdp/extract-from-db`, { params }).then(res => res.data)
}

//fdi
export async function getStatisticFdi(params: MStatistic.QueryParams2) {
  return await axios.get(`${ipStatistic}/fdi`, { params }).then(res => res.data)
}
export async function axtractDataFdi(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/fdi/extract-from-db`, { params }).then(res => res.data)
}

//iip
export async function getStatisticIip(params: MStatistic.QueryParams2) {
  return await axios.get(`${ipStatistic}/iip`, { params }).then(res => res.data)
}
export async function axtractDataIip(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/iip/extract-from-db`, { params }).then(res => res.data)
}

//digital trantion
export async function getStatisticDigitalTransformation(params: MStatistic.QueryParams2) {
  return await axios.get(`${ipStatistic}/digital-transformation`, { params }).then(res => res.data)
}
export async function axtractDataDigitalTransformation(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/digital-transformation/extract-from-db`, { params }).then(res => res.data)
}

//iip
export async function getStatisticPii(params: MStatistic.QueryParams2) {
  return await axios.get(`${ipStatistic}/pii`, { params }).then(res => res.data)
}
export async function axtractDataPii(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/pii/extract-from-db`, { params }).then(res => res.data)
}

//cpi
export async function getStatisticCpi(params: MStatistic.QueryParams3) {
  return await axios.get(`${ipStatistic}/cpi`, { params }).then(res => res.data)
}
export async function axtractDataCpi(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/cpi/extract-from-db`, { params }).then(res => res.data)
}

//HighschoolGraduationDetail
export async function getStatisticHighschoolGraduationDetail(params: MStatistic.QueryParams4) {
  return await axios.get(`${ipStatistic}/highschool-graduation`, { params }).then(res => res.data)
}
export async function axtractDataHighschoolGraduationDetail(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/highschool-graduation/extract-from-db`, { params }).then(res => res.data)
}

// TvetEmployment
export async function getStatisticTvetEmployment(params: MStatistic.QueryParams4) {
  return await axios.get(`${ipStatistic}/tvet-employment`, { params }).then(res => res.data)
}
export async function axtractDataTvetEmployment(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/tvet-employment/extract-from-db`, { params }).then(res => res.data)
}

// CadreStatistics
export async function getStatisticCadreStatistics(params: MStatistic.QueryParams4) {
  return await axios.get(`${ipStatistic}/cadre-statistics`, { params }).then(res => res.data)
}
export async function axtractDataCadreStatistics(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/cadre-statistics/extract-from-db`, { params }).then(res => res.data)
}

// HealthStatistics
export async function getStatisticHealthStatistics(params: MStatistic.QueryParams4) {
  return await axios.get(`${ipStatistic}/health-statistics`, { params }).then(res => res.data)
}
export async function axtractDataHealthStatistics(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/health-statistics/extract-from-db`, { params }).then(res => res.data)
}

// CultureLifestyle 
export async function getStatisticCultureLifestyle(params: MStatistic.QueryParams4) {
  return await axios.get(`${ipStatistic}/culture-lifestyle`, { params }).then(res => res.data)
}
export async function axtractDataCultureLifestyle(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/culture-lifestyle/extract-from-db`, { params }).then(res => res.data)
}

// Security
export async function getStatisticSecurity(params: MStatistic.QueryParams4) {
  return await axios.get(`${ipStatistic}/security`, { params }).then(res => res.data)
}
export async function axtractDataSecurity(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/security/extract-from-db`, { params }).then(res => res.data)
}

// ParIndex
export async function getStatisticParIndex(params: MStatistic.QueryParams4) {
  return await axios.get(`${ipStatistic}/par-index`, { params }).then(res => res.data)
}
export async function axtractDataParIndex(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/par-index/extract-from-db`, { params }).then(res => res.data)
}

// Sipas
export async function getStatisticSipas(params: MStatistic.QueryParams4) {
  return await axios.get(`${ipStatistic}/sipas`, { params }).then(res => res.data)
}
export async function axtractDataSipas(params?: MStatistic.IExtract) {
  return await axios.post(`${ipStatistic}/sipas/extract-from-db`, { params }).then(res => res.data)
}
