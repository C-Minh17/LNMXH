import {
  createCrawlSource,
  deleteCrawlSource,
  getCrawlSourceDetail,
  getCrawlSourceTypes,
  getCrawlSources,
  runCrawlSource,
  updateCrawlSource,
  getCrawlSourceRecords,
} from "@/services/crawl-source";
import { message } from "antd";
import { useState } from "react";

export default () => {
  const [crawlSources, setCrawlSources] = useState<MCrawlSource.IRecord[]>([]);
  const [crawlSourcesLoading, setCrawlSourcesLoading] = useState<boolean>(false);
  const [crawlSourcesTotal, setCrawlSourcesTotal] = useState<number>(0);

  const [crawlSourceDetail, setCrawlSourceDetail] = useState<MCrawlSource.IRecord>();
  const [crawlSourceDetailLoading, setCrawlSourceDetailLoading] = useState<boolean>(false);

  const [crawlSourceTypes, setCrawlSourceTypes] = useState<MCrawlSource.ISourceType[]>([]);
  const [crawlSourceTypesLoading, setCrawlSourceTypesLoading] = useState<boolean>(false);

  const [loadingCrawlSource, setLoadingCrawlSource] = useState<boolean>(false);
  const [runCrawlSourceLoading, setRunCrawlSourceLoading] = useState<boolean>(false);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const triggerReload = () => setRefreshKey((prev) => prev + 1);

  const handleGetCrawlSources = async (params?: MCrawlSource.IParams) => {
    setCrawlSourcesLoading(true);
    try {
      const res = await getCrawlSources(params);
      if (res?.data) {
        setCrawlSources(res.data);
        if (res?.metadata?.total !== undefined) {
          setCrawlSourcesTotal(res.metadata.total);
        }
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy danh sách nguồn crawl");
    } finally {
      setCrawlSourcesLoading(false);
    }
  };

  const handleGetCrawlSourceDetail = async (source_id: number) => {
    setCrawlSourceDetailLoading(true);
    try {
      const res = await getCrawlSourceDetail(source_id);
      if (res?.data) {
        setCrawlSourceDetail(res.data);
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy chi tiết nguồn crawl");
      return null;
    } finally {
      setCrawlSourceDetailLoading(false);
    }
  };

  const handleGetCrawlSourceTypes = async () => {
    setCrawlSourceTypesLoading(true);
    try {
      const res = await getCrawlSourceTypes();
      if (res?.data) {
        setCrawlSourceTypes(res.data);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy cấu hình loại nguồn crawl");
    } finally {
      setCrawlSourceTypesLoading(false);
    }
  };

  const handleCreateCrawlSource = async (data: MCrawlSource.ICreateSource) => {
    setLoadingCrawlSource(true);
    try {
      const res = await createCrawlSource(data);
      if (res) {
        message.success("Tạo nguồn crawl thành công");
        triggerReload();
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi tạo nguồn crawl");
      return null;
    } finally {
      setLoadingCrawlSource(false);
    }
  };

  const handleUpdateCrawlSource = async (source_id: number, data: MCrawlSource.ICreateSource) => {
    setLoadingCrawlSource(true);
    try {
      const res = await updateCrawlSource(source_id, data);
      if (res) {
        message.success("Cập nhật nguồn crawl thành công");
        triggerReload();
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi cập nhật nguồn crawl");
      return null;
    } finally {
      setLoadingCrawlSource(false);
    }
  };

  const handleDeleteCrawlSource = async (source_id: number) => {
    setLoadingCrawlSource(true);
    try {
      const res = await deleteCrawlSource(source_id);
      if (res) {
        message.success("Xóa nguồn crawl thành công");
        triggerReload();
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi xóa nguồn crawl");
      return null;
    } finally {
      setLoadingCrawlSource(false);
    }
  };

  const [crawlSourceRecordsLoading, setCrawlSourceRecordsLoading] = useState<boolean>(false);

  const handleRunCrawlSource = async (source_id: number) => {
    setRunCrawlSourceLoading(true);
    try {
      const res = await runCrawlSource(source_id);
      if (res) {
        message.success("Kích hoạt chạy crawl thành công");
        triggerReload();
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi kích hoạt chạy crawl");
      return null;
    } finally {
      setRunCrawlSourceLoading(false);
    }
  };

  const handleGetCrawlSourceRecords = async (source_id: number, params?: any) => {
    setCrawlSourceRecordsLoading(true);
    try {
      const res = await getCrawlSourceRecords(source_id, params);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy kết quả crawl của nguồn");
      return null;
    } finally {
      setCrawlSourceRecordsLoading(false);
    }
  };

  return {
    crawlSources,
    crawlSourcesLoading,
    crawlSourcesTotal,
    crawlSourceDetail,
    crawlSourceDetailLoading,
    crawlSourceTypes,
    crawlSourceTypesLoading,
    loadingCrawlSource,
    runCrawlSourceLoading,
    crawlSourceRecordsLoading,
    refreshKey,
    triggerReload,
    handleGetCrawlSources,
    handleGetCrawlSourceDetail,
    handleGetCrawlSourceTypes,
    handleCreateCrawlSource,
    handleUpdateCrawlSource,
    handleDeleteCrawlSource,
    handleRunCrawlSource,
    handleGetCrawlSourceRecords,
  };
};
