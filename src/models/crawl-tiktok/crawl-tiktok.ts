import {
  crawlTiktokProfiles,
  discoverTiktokProfilesBySearchUrl,
  crawlTiktokPosts,
  discoverTiktokPostsByKeyword,
  discoverTiktokPostsByProfileUrl,
  discoverTiktokPostsByUrl,
  processTiktokScripts,
  processTiktokScriptByRecordId,
  getTiktokSnapshot,
  getTiktokRecords,
  getTiktokRecordDetail,
} from "@/services/crawl-tiktok";
import { message } from "antd";
import { useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForSnapshot = async (
  snapshotId: string,
  scraperType: string,
  getSnapshotFn: (snapshotId: string, params: any) => Promise<any>
) => {
  const scraperTypeParam = scraperType.replace("-", "_");
  const maxTries = 50;
  const intervalMs = 6000;

  for (let i = 0; i < maxTries; i++) {
    const res = await getSnapshotFn(snapshotId, { scraper_type: scraperTypeParam });
    const status = res?.data?.status;

    if (status === "failed") {
      throw new Error(res?.message || "Yêu cầu crawl thất bại từ Bright Data");
    }

    if (!status) {
      return res?.data?.records; // Done
    }

    await sleep(intervalMs);
  }

  throw new Error("Hết thời gian chờ crawl (vui lòng kiểm tra lại danh sách cào sau)");
};

export default () => {
  const [crawlProfilesLoading, setCrawlProfilesLoading] = useState<boolean>(false);
  const [discoverProfilesBySearchUrlLoading, setDiscoverProfilesBySearchUrlLoading] = useState<boolean>(false);
  const [crawlPostsLoading, setCrawlPostsLoading] = useState<boolean>(false);
  const [discoverPostsByKeywordLoading, setDiscoverPostsByKeywordLoading] = useState<boolean>(false);
  const [discoverPostsByProfileUrlLoading, setDiscoverPostsByProfileUrlLoading] = useState<boolean>(false);
  const [discoverPostsByUrlLoading, setDiscoverPostsByUrlLoading] = useState<boolean>(false);
  const [processScriptsLoading, setProcessScriptsLoading] = useState<boolean>(false);
  const [processScriptByRecordIdLoading, setProcessScriptByRecordIdLoading] = useState<boolean>(false);
  const [snapshotLoading, setSnapshotLoading] = useState<boolean>(false);
  const [getTiktokRecordsLoading, setGetTiktokRecordsLoading] = useState<boolean>(false);
  const [getTiktokRecordDetailLoading, setGetTiktokRecordDetailLoading] = useState<boolean>(false);

  const handleCrawlProfiles = async (data: MCrawlTiktok.IProfileRequest) => {
    setCrawlProfilesLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlTiktokProfiles(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào dữ liệu profile (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "profiles", getTiktokSnapshot);
          message.success("Thu thập dữ liệu profile thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl profile theo URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl profile theo URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl profile theo URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlProfilesLoading(false);
    }
  };

  const handleDiscoverProfilesBySearchUrl = async (data: MCrawlTiktok.ISearchProfileRequest) => {
    setDiscoverProfilesBySearchUrlLoading(true);
    let hideMessage: any = null;
    try {
      const res = await discoverTiktokProfilesBySearchUrl(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào profile discover (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "profiles-discover", getTiktokSnapshot);
          message.success("Thu thập dữ liệu profile discover thành công!");
        } else {
          message.success(res.message || "Yêu cầu discover profile theo search URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi discover profile theo search URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi discover profile theo search URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setDiscoverProfilesBySearchUrlLoading(false);
    }
  };

  const handleCrawlPosts = async (data: MCrawlTiktok.IPostRequest) => {
    setCrawlPostsLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlTiktokPosts(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào video TikTok (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "posts", getTiktokSnapshot);
          message.success("Thu thập dữ liệu video thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl bài viết theo URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl bài viết theo URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl bài viết theo URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlPostsLoading(false);
    }
  };

  const handleDiscoverPostsByKeyword = async (data: MCrawlTiktok.IKeywordPostRequest) => {
    setDiscoverPostsByKeywordLoading(true);
    let hideMessage: any = null;
    try {
      const res = await discoverTiktokPostsByKeyword(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang discover video keyword (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "posts-keyword", getTiktokSnapshot);
          message.success("Discover video theo keyword thành công!");
        } else {
          message.success(res.message || "Yêu cầu discover video theo keyword thành công");
        }
      } else {
        message.error(res?.message || "Lỗi discover video theo keyword");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi discover video theo keyword");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setDiscoverPostsByKeywordLoading(false);
    }
  };

  const handleDiscoverPostsByProfileUrl = async (data: MCrawlTiktok.IProfilePostRequest) => {
    setDiscoverPostsByProfileUrlLoading(true);
    let hideMessage: any = null;
    try {
      const res = await discoverTiktokPostsByProfileUrl(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang discover video profile (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "posts-profile", getTiktokSnapshot);
          message.success("Discover video theo profile thành công!");
        } else {
          message.success(res.message || "Yêu cầu discover video theo profile URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi discover video theo profile URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi discover video theo profile URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setDiscoverPostsByProfileUrlLoading(false);
    }
  };

  const handleDiscoverPostsByUrl = async (data: MCrawlTiktok.IDiscoverPostRequest) => {
    setDiscoverPostsByUrlLoading(true);
    let hideMessage: any = null;
    try {
      const res = await discoverTiktokPostsByUrl(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang discover video discover page (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "posts-discover", getTiktokSnapshot);
          message.success("Discover video từ Discover page thành công!");
        } else {
          message.success(res.message || "Yêu cầu discover video từ trang Discover thành công");
        }
      } else {
        message.error(res?.message || "Lỗi discover video từ trang Discover");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi discover video từ trang Discover");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setDiscoverPostsByUrlLoading(false);
    }
  };

  const handleProcessScripts = async (params?: MCrawlTiktok.IProcessScriptsParams) => {
    setProcessScriptsLoading(true);
    try {
      const res = await processTiktokScripts(params);
      if (res?.success) {
        message.success(res.message || "Yêu cầu quét transcript bổ sung thành công");
      } else {
        message.error(res?.message || "Lỗi quét transcript bổ sung");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi quét transcript bổ sung");
      return null;
    } finally {
      setProcessScriptsLoading(false);
    }
  };

  const handleProcessScriptByRecordId = async (record_id: number) => {
    setProcessScriptByRecordIdLoading(true);
    try {
      const res = await processTiktokScriptByRecordId(record_id);
      if (res?.success) {
        message.success(res.message || "Yêu cầu quét transcript cho bản ghi thành công");
      } else {
        message.error(res?.message || "Lỗi quét transcript cho bản ghi");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi quét transcript cho bản ghi");
      return null;
    } finally {
      setProcessScriptByRecordIdLoading(false);
    }
  };

  const handleGetSnapshot = async (snapshot_id: string, params?: MCrawlTiktok.ISnapshotParams) => {
    setSnapshotLoading(true);
    try {
      const res = await getTiktokSnapshot(snapshot_id, params);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy kết quả snapshot");
      return null;
    } finally {
      setSnapshotLoading(false);
    }
  };

  const handleGetTiktokRecords = async (params?: MCrawlTiktok.IRecordParams) => {
    setGetTiktokRecordsLoading(true);
    try {
      const res = await getTiktokRecords(params);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy danh sách records đã crawl");
      return null;
    } finally {
      setGetTiktokRecordsLoading(false);
    }
  };

  const handleGetTiktokRecordDetail = async (record_id: number) => {
    setGetTiktokRecordDetailLoading(true);
    try {
      const res = await getTiktokRecordDetail(record_id);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy chi tiết record đã crawl");
      return null;
    } finally {
      setGetTiktokRecordDetailLoading(false);
    }
  };

  return {
    crawlProfilesLoading,
    discoverProfilesBySearchUrlLoading,
    crawlPostsLoading,
    discoverPostsByKeywordLoading,
    discoverPostsByProfileUrlLoading,
    discoverPostsByUrlLoading,
    processScriptsLoading,
    processScriptByRecordIdLoading,
    snapshotLoading,
    getTiktokRecordsLoading,
    getTiktokRecordDetailLoading,
    handleCrawlProfiles,
    handleDiscoverProfilesBySearchUrl,
    handleCrawlPosts,
    handleDiscoverPostsByKeyword,
    handleDiscoverPostsByProfileUrl,
    handleDiscoverPostsByUrl,
    handleProcessScripts,
    handleProcessScriptByRecordId,
    handleGetSnapshot,
    handleGetTiktokRecords,
    handleGetTiktokRecordDetail,
  };
};
