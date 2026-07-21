import {
  crawlIgProfiles,
  discoverIgProfilesByUsername,
  crawlIgPosts,
  getIgSnapshot,
  getIgRecords,
  getIgRecordDetail,
} from "@/services/crawl-ig";
import { message } from "antd";
import { useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForSnapshot = async (
  snapshotId: string,
  scraperType: string,
  getSnapshotFn: (snapshotId: string, params: any) => Promise<any>
) => {
  const maxTries = 50;
  const intervalMs = 6000;

  for (let i = 0; i < maxTries; i++) {
    const res = await getSnapshotFn(snapshotId, { scraper_type: scraperType });
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
  const [discoverProfilesByUsernameLoading, setDiscoverProfilesByUsernameLoading] = useState<boolean>(false);
  const [crawlPostsLoading, setCrawlPostsLoading] = useState<boolean>(false);
  const [snapshotLoading, setSnapshotLoading] = useState<boolean>(false);
  const [getIgRecordsLoading, setGetIgRecordsLoading] = useState<boolean>(false);
  const [getIgRecordDetailLoading, setGetIgRecordDetailLoading] = useState<boolean>(false);

  const handleCrawlProfiles = async (data: MCrawlIg.IProfileRequest, params?: { wait?: boolean }) => {
    setCrawlProfilesLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlIgProfiles(data, params);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào dữ liệu profile Instagram (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "profiles_by_url", getIgSnapshot);
          message.success("Thu thập dữ liệu profile Instagram thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl profile Instagram theo URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl profile Instagram theo URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl profile Instagram theo URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlProfilesLoading(false);
    }
  };

  const handleDiscoverProfilesByUsername = async (data: MCrawlIg.IDiscoverProfileRequest, params?: { wait?: boolean }) => {
    setDiscoverProfilesByUsernameLoading(true);
    let hideMessage: any = null;
    try {
      const res = await discoverIgProfilesByUsername(data, params);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang discover profile Instagram (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "profiles_discover_user_name", getIgSnapshot);
          message.success("Discover profile Instagram theo username thành công!");
        } else {
          message.success(res.message || "Yêu cầu discover profile Instagram theo username thành công");
        }
      } else {
        message.error(res?.message || "Lỗi discover profile Instagram theo username");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi discover profile Instagram theo username");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setDiscoverProfilesByUsernameLoading(false);
    }
  };

  const handleCrawlPosts = async (data: MCrawlIg.IPostRequest, params?: { wait?: boolean }) => {
    setCrawlPostsLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlIgPosts(data, params);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào bài viết Instagram (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "posts_by_url", getIgSnapshot);
          message.success("Thu thập dữ liệu bài viết Instagram thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl bài viết Instagram theo URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl bài viết Instagram theo URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl bài viết Instagram theo URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlPostsLoading(false);
    }
  };

  const handleGetSnapshot = async (snapshot_id: string, params?: MCrawlIg.ISnapshotParams) => {
    setSnapshotLoading(true);
    try {
      const res = await getIgSnapshot(snapshot_id, params);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy kết quả snapshot");
      return null;
    } finally {
      setSnapshotLoading(false);
    }
  };

  const handleGetIgRecords = async (params?: MCrawlIg.IRecordParams) => {
    setGetIgRecordsLoading(true);
    try {
      const res = await getIgRecords(params);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy danh sách records đã crawl");
      return null;
    } finally {
      setGetIgRecordsLoading(false);
    }
  };

  const handleGetIgRecordDetail = async (record_id: number) => {
    setGetIgRecordDetailLoading(true);
    try {
      const res = await getIgRecordDetail(record_id);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy chi tiết record đã crawl");
      return null;
    } finally {
      setGetIgRecordDetailLoading(false);
    }
  };

  return {
    crawlProfilesLoading,
    discoverProfilesByUsernameLoading,
    crawlPostsLoading,
    snapshotLoading,
    getIgRecordsLoading,
    getIgRecordDetailLoading,
    handleCrawlProfiles,
    handleDiscoverProfilesByUsername,
    handleCrawlPosts,
    handleGetSnapshot,
    handleGetIgRecords,
    handleGetIgRecordDetail,
  };
};
