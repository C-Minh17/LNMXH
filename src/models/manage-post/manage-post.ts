import { createCrawlV2, createPostV2, deletePostV2, editPostV2, getAllPostV2, getDataTypePostV2, getPostFilterDataTypeV1, getPostFilterDocumentTypeV2, getPostV2Detail, getSourcePostV1 } from "@/services/quan-ly-bai-viet"
import { message } from "antd"
import { useState } from "react"

export default () => {
  // const objInit = useInitModel<MManagePostV2.IRecord>('manage-post');
  const [allPostv2, setAllPostV2] = useState<MManagePostV2.IRecord[]>()
  const [allPostv2Loading, setAllPostV2Loading] = useState<boolean>(false)

  const [postFilterDocumentType, setPostFilterDocumentType] = useState<MManagePostV2.IRecord[]>()
  const [postFilterDocumentTypeLoading, setPostFilterDocumentTypeLoading] = useState<boolean>(false)

  const [postv2Detail, setPostV2Detail] = useState<MManagePostV2.IRecord>()
  const [postv2DetailLoading, setPostV2DetailLoading] = useState<boolean>(false)

  // const [postv2Crawl, setPostV2Crawl] = useState<MManagePostV2.ICrawl>()
  const [postv2CrawlLoading, setPostV2CrawlLoading] = useState<boolean>(false)

  const [dataType, setDataType] = useState<string[]>([])
  const [dataTypeLoading, setDataTypeLoading] = useState<boolean>(false)

  //v1
  const [postFilterDataTypeV1, setPostFilterDataTypeV1] = useState<MManagePostV2.IRecord[]>()
  const [postFilterDataTypeV1Loading, setPostFilterDataTypeV1Loading] = useState<boolean>(false)

  const [dataSource, setDataSource] = useState<string[]>([])
  const [dataSourceLoading, setDataSourceLoading] = useState<boolean>(false)
  //

  const [loadingPostV2, setLoadingPostV2] = useState<boolean>(false)

  const [refreshKey, setRefreshKey] = useState<number>(0)

  const triggerReload = () => setRefreshKey(prev => prev + 1)

  const handleGetAllPostV2 = async (page_size?: number, sort_by?: string, order?: string, page?: number) => {
    setAllPostV2Loading(true);
    try {
      const res = await getAllPostV2(page_size, sort_by, order, page)
      setAllPostV2(res.data)
    } catch (error) {
      console.log(error)
      message.error("Lỗi lấy bài viết")
    } finally {
      setAllPostV2Loading(false)
    }
  }

  const handlePostFilterDocumentType = async (document_type: string, page_size?: number, sort_by?: string, order?: string, page?: number) => {
    setPostFilterDocumentTypeLoading(true);
    try {
      const res = await getPostFilterDocumentTypeV2(document_type, page_size, sort_by, order, page)
      setPostFilterDocumentType(res.data)
    } catch (error) {
      console.log(error)
      message.error("Lỗi lấy bài viết")
    } finally {
      setPostFilterDocumentTypeLoading(false)
    }
  }

  const handleGetPostV2Detail = async (post_id: number) => {
    setPostV2DetailLoading(true);
    try {
      const res = await getPostV2Detail(post_id)
      setPostV2Detail(res.data)
    } catch (error) {
      console.log(error)
      message.error("Lỗi lấy bài viết")
    } finally {
      setPostV2DetailLoading(false)
    }
  }

  const handleGetDataTypePostV2 = async () => {
    setDataTypeLoading(true);
    try {
      const res = await getDataTypePostV2()
      setDataType(res.data)
    } catch (error) {
      console.log(error)
      message.error("Lỗi lấy loại dữ liệu")
    } finally {
      setDataTypeLoading(false)
    }
  }

  const handleCreatePostV2 = async (data: MManagePostV2.IRecord) => {
    setLoadingPostV2(true);
    try {
      const res = await createPostV2(data)
      if (res) triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("Lỗi tạo bài viết")
      return null
    } finally {
      setLoadingPostV2(false)
    }
  }

  const handleCrawlPostV2 = async (data: MManagePostV2.ICrawlInput) => {
    setPostV2CrawlLoading(true);
    try {
      const res = await createCrawlV2(data)
      return res.data
    } catch (error) {
      console.log(error)
      message.error("Lỗi tìm kiếm bài viết")
      return null
    } finally {
      setPostV2CrawlLoading(false)
    }
  }

  const handleEditPostV2 = async (post_id: number, data: MManagePostV2.IRecord) => {
    setLoadingPostV2(true);
    try {
      const res = await editPostV2(post_id, data)
      if (res) triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("Lỗi sửa bài viết")
      return null
    } finally {
      setLoadingPostV2(false)
    }
  }

  const handleDeletePostV2 = async (post_id: number) => {
    setLoadingPostV2(true);
    try {
      const res = await deletePostV2(post_id)
      if (res) triggerReload()
      return res
    } catch (error) {
      console.log(error)
      message.error("Lỗi sửa bài viết")
      return null
    } finally {
      setLoadingPostV2(false)
    }
  }

  //v1
  const handlePostFilterDataTypeV1 = async (data_type: string, page_size?: number, sort_by?: string, order?: string, page?: number) => {
    setPostFilterDataTypeV1Loading(true);
    try {
      const res = await getPostFilterDataTypeV1(data_type, page_size, sort_by, order, page)
      setPostFilterDataTypeV1(res.data)
    } catch (error) {
      console.log(error)
      message.error("Lỗi lấy bài viết")
    } finally {
      setPostFilterDataTypeV1Loading(false)
    }
  }

  const handleGetDataSource = async () => {
    setDataSourceLoading(true);
    try {
      const res = await getSourcePostV1()
      setDataSource(res.data)
    } catch (error) {
      console.log(error)
      message.error("Lỗi lấy nguồn")
    } finally {
      setDataSourceLoading(false)
    }
  }


  return {
    allPostv2,
    allPostv2Loading,
    postv2Detail,
    postv2DetailLoading,
    dataType,
    dataTypeLoading,
    postFilterDocumentType,
    postFilterDocumentTypeLoading,
    postFilterDataTypeV1,
    postFilterDataTypeV1Loading,
    // postv2Crawl,
    postv2CrawlLoading,
    dataSource,
    dataSourceLoading,

    loadingPostV2,

    refreshKey,

    handleGetAllPostV2,
    handleGetPostV2Detail,
    handleCreatePostV2,
    handleDeletePostV2,
    handleEditPostV2,
    handleGetDataTypePostV2,
    handlePostFilterDocumentType,
    handlePostFilterDataTypeV1,
    handleCrawlPostV2,
    handleGetDataSource,
  }
}