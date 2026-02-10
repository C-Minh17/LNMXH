import { axtractDataCadreStatistics, axtractDataCpi, axtractDataCultureLifestyle, axtractDataDigitalTransformation, axtractDataFdi, axtractDataGrdp, axtractDataHealthStatistics, axtractDataHighschoolGraduationDetail, axtractDataIip, axtractDataParIndex, axtractDataPii, axtractDataSecurity, axtractDataSipas, axtractDataTvetEmployment, getBackgroundTask, getStatisticCadreStatistics, getStatisticCpi, getStatisticCultureLifestyle, getStatisticDigitalTransformation, getStatisticFdi, getStatisticGrdp, getStatisticHealthStatistics, getStatisticHighschoolGraduationDetail, getStatisticIip, getStatisticParIndex, getStatisticPii, getStatisticSecurity, getStatisticSipas, getStatisticTvetEmployment } from "@/services/thong-ke"
import { message } from "antd"
import { useState } from "react"

export default () => {
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const triggerReload = () => setRefreshKey(prev => prev + 1)

  const handleBackgroundTask = async (task_id: string) => {
    try {
      const res = await getBackgroundTask(task_id)
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
      return null
    }
  }

  //grdp
  const [statisticGrdpEx, setStatisticGrdpEx] = useState<MStatistic.IGrdp[]>([])
  const [statisticGrdpIn, setStatisticGrdpIn] = useState<MStatistic.IGrdp[]>([])
  const [statisticGrdpLoading, setStatisticGrdpLoading] = useState<boolean>(false)

  const handleStatisticGrdp = async (params: MStatistic.QueryParams1) => {
    setStatisticGrdpLoading(true);
    try {
      const res = await getStatisticGrdp(params)
      const data = res.data as MStatistic.IGrdp[]
      setStatisticGrdpEx(data.filter(item => item.document_type === "external"))
      setStatisticGrdpIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticGrdpLoading(false)
    }
  }

  const handleExtractGrdp = async (params?: MStatistic.IExtract) => {
    setStatisticGrdpLoading(true);
    try {
      const res = await axtractDataGrdp(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticGrdpLoading(false)
    }
  }

  //fdi
  const [statisticFdiEx, setStatisticFdiEx] = useState<MStatistic.IFdi[]>([])
  const [statisticFdiIn, setStatisticFdiIn] = useState<MStatistic.IFdi[]>([])
  const [statisticFdiLoading, setStatisticFdiLoading] = useState<boolean>(false)

  const handleStatisticFdi = async (params: MStatistic.QueryParams2) => {
    setStatisticFdiLoading(true);
    try {
      const res = await getStatisticFdi(params)
      const data = res.data as MStatistic.IFdi[]
      setStatisticFdiEx(data.filter(item => item.document_type === "external"))
      setStatisticFdiIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticFdiLoading(false)
    }
  }

  const handleExtractFdi = async (params?: MStatistic.IExtract) => {
    setStatisticFdiLoading(true);
    try {
      const res = await axtractDataFdi(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticFdiLoading(false)
    }
  }

  //Iip
  const [statisticIipEx, setStatisticIipEx] = useState<MStatistic.IIip[]>([])
  const [statisticIipIn, setStatisticIipIn] = useState<MStatistic.IIip[]>([])
  const [statisticIipLoading, setStatisticIipLoading] = useState<boolean>(false)

  const handleStatisticIip = async (params: MStatistic.QueryParams2) => {
    setStatisticIipLoading(true);
    try {
      const res = await getStatisticIip(params)
      const data = res.data as MStatistic.IIip[]
      setStatisticIipEx(data.filter(item => item.document_type === "external"))
      setStatisticIipIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticIipLoading(false)
    }
  }

  const handleExtractIip = async (params?: MStatistic.IExtract) => {
    setStatisticIipLoading(true);
    try {
      const res = await axtractDataIip(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticIipLoading(false)
    }
  }

  //DigitalTransformation
  const [statisticDigitalTransformationEx, setStatisticDigitalTransformationEx] = useState<MStatistic.IDigitalTransformation[]>([])
  const [statisticDigitalTransformationIn, setStatisticDigitalTransformationIn] = useState<MStatistic.IDigitalTransformation[]>([])
  const [statisticDigitalTransformationLoading, setStatisticDigitalTransformationLoading] = useState<boolean>(false)

  const handleStatisticDigitalTransformation = async (params: MStatistic.QueryParams2) => {
    setStatisticDigitalTransformationLoading(true);
    try {
      const res = await getStatisticDigitalTransformation(params)
      const data = res.data as MStatistic.IDigitalTransformation[]
      setStatisticDigitalTransformationEx(data.filter(item => item.document_type === "external"))
      setStatisticDigitalTransformationIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticDigitalTransformationLoading(false)
    }
  }

  const handleExtractDigitalTransformation = async (params?: MStatistic.IExtract) => {
    setStatisticDigitalTransformationLoading(true);
    try {
      const res = await axtractDataDigitalTransformation(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticDigitalTransformationLoading(false)
    }
  }

  //Pii
  const [statisticPiiEx, setStatisticPiiEx] = useState<MStatistic.IPii[]>([])
  const [statisticPiiIn, setStatisticPiiIn] = useState<MStatistic.IPii[]>([])
  const [statisticPiiLoading, setStatisticPiiLoading] = useState<boolean>(false)

  const handleStatisticPii = async (params: MStatistic.QueryParams2) => {
    setStatisticPiiLoading(true);
    try {
      const res = await getStatisticPii(params)
      const data = res.data as MStatistic.IPii[]
      setStatisticPiiEx(data.filter(item => item.document_type === "external"))
      setStatisticPiiIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticPiiLoading(false)
    }
  }

  const handleExtractPii = async (params?: MStatistic.IExtract) => {
    setStatisticPiiLoading(true);
    try {
      const res = await axtractDataPii(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticPiiLoading(false)
    }
  }

  //Cpi
  const [statisticCpiEx, setStatisticCpiEx] = useState<MStatistic.ICpi[]>([])
  const [statisticCpiIn, setStatisticCpiIn] = useState<MStatistic.ICpi[]>([])
  const [statisticCpiLoading, setStatisticCpiLoading] = useState<boolean>(false)

  const handleStatisticCpi = async (params: MStatistic.QueryParams3) => {
    setStatisticCpiLoading(true);
    try {
      const res = await getStatisticCpi(params)
      const data = res.data as MStatistic.ICpi[]
      setStatisticCpiEx(data.filter(item => item.document_type === "external"))
      setStatisticCpiIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticCpiLoading(false)
    }
  }

  const handleExtractCpi = async (params?: MStatistic.IExtract) => {
    setStatisticCpiLoading(true);
    try {
      const res = await axtractDataCpi(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticCpiLoading(false)
    }
  }

  //HighschoolGraduationDetail
  const [statisticHighschoolGraduationDetailEx, setStatisticHighschoolGraduationDetailEx] = useState<MStatistic.IHighschoolGraduationDetail[]>([])
  const [statisticHighschoolGraduationDetailIn, setStatisticHighschoolGraduationDetailIn] = useState<MStatistic.IHighschoolGraduationDetail[]>([])
  const [statisticHighschoolGraduationDetailLoading, setStatisticHighschoolGraduationDetailLoading] = useState<boolean>(false)

  const handleStatisticHighschoolGraduationDetail = async (params: MStatistic.QueryParams4) => {
    setStatisticHighschoolGraduationDetailLoading(true);
    try {
      const res = await getStatisticHighschoolGraduationDetail(params)
      const data = res.data as MStatistic.IHighschoolGraduationDetail[]
      setStatisticHighschoolGraduationDetailEx(data.filter(item => item.document_type === "external"))
      setStatisticHighschoolGraduationDetailIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticHighschoolGraduationDetailLoading(false)
    }
  }

  const handleExtractHighschoolGraduationDetail = async (params?: MStatistic.IExtract) => {
    setStatisticHighschoolGraduationDetailLoading(true);
    try {
      const res = await axtractDataHighschoolGraduationDetail(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticHighschoolGraduationDetailLoading(false)
    }
  }

  //TvetEmployment
  const [statisticTvetEmploymentEx, setStatisticTvetEmploymentEx] = useState<MStatistic.ITvetEmployment[]>([])
  const [statisticTvetEmploymentIn, setStatisticTvetEmploymentIn] = useState<MStatistic.ITvetEmployment[]>([])
  const [statisticTvetEmploymentLoading, setStatisticTvetEmploymentLoading] = useState<boolean>(false)

  const handleStatisticTvetEmployment = async (params: MStatistic.QueryParams4) => {
    setStatisticTvetEmploymentLoading(true);
    try {
      const res = await getStatisticTvetEmployment(params)
      const data = res.data as MStatistic.ITvetEmployment[]
      setStatisticTvetEmploymentEx(data.filter(item => item.document_type === "external"))
      setStatisticTvetEmploymentIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticTvetEmploymentLoading(false)
    }
  }

  const handleExtractTvetEmployment = async (params?: MStatistic.IExtract) => {
    setStatisticTvetEmploymentLoading(true);
    try {
      const res = await axtractDataTvetEmployment(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticTvetEmploymentLoading(false)
    }
  }

  // CadreStatistics
  const [statisticCadreStatisticsEx, setStatisticCadreStatisticsEx] = useState<MStatistic.ICadreStatistics[]>([])
  const [statisticCadreStatisticsIn, setStatisticCadreStatisticsIn] = useState<MStatistic.ICadreStatistics[]>([])
  const [statisticCadreStatisticsLoading, setStatisticCadreStatisticsLoading] = useState<boolean>(false)

  const handleStatisticCadreStatistics = async (params: MStatistic.QueryParams4) => {
    setStatisticCadreStatisticsLoading(true);
    try {
      const res = await getStatisticCadreStatistics(params)
      const data = res.data as MStatistic.ICadreStatistics[]
      setStatisticCadreStatisticsEx(data.filter(item => item.document_type === "external"))
      setStatisticCadreStatisticsIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticCadreStatisticsLoading(false)
    }
  }

  const handleExtractCadreStatistics = async (params?: MStatistic.IExtract) => {
    setStatisticCadreStatisticsLoading(true);
    try {
      const res = await axtractDataCadreStatistics(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticCadreStatisticsLoading(false)
    }
  }
  // HealthStatistics
  const [statisticHealthStatisticsEx, setStatisticHealthStatisticsEx] = useState<MStatistic.IHealthStatistics[]>([])
  const [statisticHealthStatisticsIn, setStatisticHealthStatisticsIn] = useState<MStatistic.IHealthStatistics[]>([])
  const [statisticHealthStatisticsLoading, setStatisticHealthStatisticsLoading] = useState<boolean>(false)

  const handleStatisticHealthStatistics = async (params: MStatistic.QueryParams4) => {
    setStatisticHealthStatisticsLoading(true);
    try {
      const res = await getStatisticHealthStatistics(params)
      const data = res.data as MStatistic.IHealthStatistics[]
      setStatisticHealthStatisticsEx(data.filter(item => item.document_type === "external"))
      setStatisticHealthStatisticsIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticHealthStatisticsLoading(false)
    }
  }

  const handleExtractHealthStatistics = async (params?: MStatistic.IExtract) => {
    setStatisticHealthStatisticsLoading(true);
    try {
      const res = await axtractDataHealthStatistics(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticHealthStatisticsLoading(false)
    }
  }

  // CultureLifestyle
  const [statisticCultureLifestyleEx, setStatisticCultureLifestyleEx] = useState<MStatistic.ICultureLifestyle[]>([])
  const [statisticCultureLifestyleIn, setStatisticCultureLifestyleIn] = useState<MStatistic.ICultureLifestyle[]>([])
  const [statisticCultureLifestyleLoading, setStatisticCultureLifestyleLoading] = useState<boolean>(false)

  const handleStatisticCultureLifestyle = async (params: MStatistic.QueryParams4) => {
    setStatisticCultureLifestyleLoading(true);
    try {
      const res = await getStatisticCultureLifestyle(params)
      const data = res.data as MStatistic.ICultureLifestyle[]
      setStatisticCultureLifestyleEx(data.filter(item => item.document_type === "external"))
      setStatisticCultureLifestyleIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticCultureLifestyleLoading(false)
    }
  }

  const handleExtractCultureLifestyle = async (params?: MStatistic.IExtract) => {
    setStatisticCultureLifestyleLoading(true);
    try {
      const res = await axtractDataCultureLifestyle(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticCultureLifestyleLoading(false)
    }
  }

  // Security
  const [statisticSecurityEx, setStatisticSecurityEx] = useState<MStatistic.ISecurity[]>([])
  const [statisticSecurityIn, setStatisticSecurityIn] = useState<MStatistic.ISecurity[]>([])
  const [statisticSecurityLoading, setStatisticSecurityLoading] = useState<boolean>(false)

  const handleStatisticSecurity = async (params: MStatistic.QueryParams4) => {
    setStatisticSecurityLoading(true);
    try {
      const res = await getStatisticSecurity(params)
      const data = res.data as MStatistic.ISecurity[]
      setStatisticSecurityEx(data.filter(item => item.document_type === "external"))
      setStatisticSecurityIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticSecurityLoading(false)
    }
  }

  const handleExtractSecurity = async (params?: MStatistic.IExtract) => {
    setStatisticSecurityLoading(true);
    try {
      const res = await axtractDataSecurity(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticSecurityLoading(false)
    }
  }

  // ParIndex
  const [statisticParIndexEx, setStatisticParIndexEx] = useState<MStatistic.IParIndex[]>([])
  const [statisticParIndexIn, setStatisticParIndexIn] = useState<MStatistic.IParIndex[]>([])
  const [statisticParIndexLoading, setStatisticParIndexLoading] = useState<boolean>(false)

  const handleStatisticParIndex = async (params: MStatistic.QueryParams4) => {
    setStatisticParIndexLoading(true);
    try {
      const res = await getStatisticParIndex(params)
      const data = res.data as MStatistic.IParIndex[]
      setStatisticParIndexEx(data.filter(item => item.document_type === "external"))
      setStatisticParIndexIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticParIndexLoading(false)
    }
  }

  const handleExtractParIndex = async (params?: MStatistic.IExtract) => {
    setStatisticParIndexLoading(true);
    try {
      const res = await axtractDataParIndex(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticParIndexLoading(false)
    }
  }

  // Sipas 
  const [statisticSipasEx, setStatisticSipasEx] = useState<MStatistic.ISipas[]>([])
  const [statisticSipasIn, setStatisticSipasIn] = useState<MStatistic.ISipas[]>([])
  const [statisticSipasLoading, setStatisticSipasLoading] = useState<boolean>(false)

  const handleStatisticSipas = async (params: MStatistic.QueryParams4) => {
    setStatisticSipasLoading(true);
    try {
      const res = await getStatisticSipas(params)
      const data = res.data as MStatistic.ISipas[]
      setStatisticSipasEx(data.filter(item => item.document_type === "external"))
      setStatisticSipasIn(data.filter(item => item.document_type === "internal"))
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu")
    } finally {
      setStatisticSipasLoading(false)
    }
  }

  const handleExtractSipas = async (params?: MStatistic.IExtract) => {
    setStatisticSipasLoading(true);
    try {
      const res = await axtractDataSipas(params)
      triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("lỗi lấy dữ liệu ")
    } finally {
      setStatisticSipasLoading(false)
    }
  }

  return {
    refreshKey,
    handleBackgroundTask,

    statisticGrdpEx,
    statisticGrdpIn,
    statisticGrdpLoading,
    handleStatisticGrdp,
    handleExtractGrdp,

    statisticFdiEx,
    statisticFdiIn,
    statisticFdiLoading,
    handleStatisticFdi,
    handleExtractFdi,

    statisticIipEx,
    statisticIipIn,
    statisticIipLoading,
    handleStatisticIip,
    handleExtractIip,

    statisticDigitalTransformationEx,
    statisticDigitalTransformationIn,
    statisticDigitalTransformationLoading,
    handleStatisticDigitalTransformation,
    handleExtractDigitalTransformation,

    statisticPiiEx,
    statisticPiiIn,
    statisticPiiLoading,
    handleStatisticPii,
    handleExtractPii,

    statisticCpiEx,
    statisticCpiIn,
    statisticCpiLoading,
    handleStatisticCpi,
    handleExtractCpi,

    statisticHighschoolGraduationDetailEx,
    statisticHighschoolGraduationDetailIn,
    statisticHighschoolGraduationDetailLoading,
    handleStatisticHighschoolGraduationDetail,
    handleExtractHighschoolGraduationDetail,

    statisticTvetEmploymentEx,
    statisticTvetEmploymentIn,
    statisticTvetEmploymentLoading,
    handleStatisticTvetEmployment,
    handleExtractTvetEmployment,

    statisticCadreStatisticsEx,
    statisticCadreStatisticsIn,
    statisticCadreStatisticsLoading,
    handleStatisticCadreStatistics,
    handleExtractCadreStatistics,

    statisticHealthStatisticsEx,
    statisticHealthStatisticsIn,
    statisticHealthStatisticsLoading,
    handleStatisticHealthStatistics,
    handleExtractHealthStatistics,

    statisticCultureLifestyleEx,
    statisticCultureLifestyleIn,
    statisticCultureLifestyleLoading,
    handleStatisticCultureLifestyle,
    handleExtractCultureLifestyle,

    statisticSecurityEx,
    statisticSecurityIn,
    statisticSecurityLoading,
    handleStatisticSecurity,
    handleExtractSecurity,

    statisticParIndexEx,
    statisticParIndexIn,
    statisticParIndexLoading,
    handleStatisticParIndex,
    handleExtractParIndex,

    statisticSipasEx,
    statisticSipasIn,
    statisticSipasLoading,
    handleStatisticSipas,
    handleExtractSipas,
  }
}