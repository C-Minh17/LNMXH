import {
  crawlThreadsProfiles,
  crawlThreadsPosts,
  discoverThreadsPostsByProfile,
  getThreadsSnapshot,
  getThreadsRecords,
  getThreadsRecordDetail,
} from "@/services/crawl-thread";
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
  const [crawlPostsLoading, setCrawlPostsLoading] = useState<boolean>(false);
  const [discoverPostsByProfileLoading, setDiscoverPostsByProfileLoading] = useState<boolean>(false);
  const [snapshotLoading, setSnapshotLoading] = useState<boolean>(false);
  const [getThreadsRecordsLoading, setGetThreadsRecordsLoading] = useState<boolean>(false);
  const [getThreadsRecordDetailLoading, setGetThreadsRecordDetailLoading] = useState<boolean>(false);

  const handleCrawlProfiles = async (data: MCrawlThreads.IProfileRequest, params?: { wait?: boolean }) => {
    setCrawlProfilesLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlThreadsProfiles(data, params);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào dữ liệu profile Threads (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "profiles_by_url", getThreadsSnapshot);
          message.success("Thu thập dữ liệu profile Threads thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl profile Threads theo URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl profile Threads theo URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl profile Threads theo URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlProfilesLoading(false);
    }
  };

  const handleCrawlPosts = async (data: MCrawlThreads.IPostRequest, params?: { wait?: boolean }) => {
    setCrawlPostsLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlThreadsPosts(data, params);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào bài viết Threads (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "posts_by_url", getThreadsSnapshot);
          message.success("Thu thập dữ liệu bài viết Threads thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl bài viết Threads theo URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl bài viết Threads theo URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl bài viết Threads theo URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlPostsLoading(false);
    }
  };

  const handleDiscoverPostsByProfile = async (data: MCrawlThreads.IDiscoverProfilePostRequest, params?: { wait?: boolean }) => {
    setDiscoverPostsByProfileLoading(true);
    let hideMessage: any = null;
    try {
      const res = await discoverThreadsPostsByProfile(data, params);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang discover bài viết Threads theo profile (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "posts_discover_profile", getThreadsSnapshot);
          message.success("Discover bài viết Threads theo profile thành công!");
        } else {
          message.success(res.message || "Yêu cầu discover bài viết Threads theo profile thành công");
        }
      } else {
        message.error(res?.message || "Lỗi discover bài viết Threads theo profile");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi discover bài viết Threads theo profile");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setDiscoverPostsByProfileLoading(false);
    }
  };

  const handleGetSnapshot = async (snapshot_id: string, params?: MCrawlThreads.ISnapshotParams) => {
    setSnapshotLoading(true);
    try {
      const res = await getThreadsSnapshot(snapshot_id, params);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy kết quả snapshot");
      return null;
    } finally {
      setSnapshotLoading(false);
    }
  };

  const handleGetThreadsRecords = async (params?: MCrawlThreads.IRecordParams) => {
    setGetThreadsRecordsLoading(true);
    try {
      const res = await getThreadsRecords(params);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy danh sách records đã crawl");
      return null;
    } finally {
      setGetThreadsRecordsLoading(false);
    }
  };

  const handleGetThreadsRecordDetail = async (record_id: number) => {
    setGetThreadsRecordDetailLoading(true);
    try {
      const res = await getThreadsRecordDetail(record_id);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy chi tiết record đã crawl");
      return null;
    } finally {
      setGetThreadsRecordDetailLoading(false);
    }
  };

  return {
    crawlProfilesLoading,
    crawlPostsLoading,
    discoverPostsByProfileLoading,
    snapshotLoading,
    getThreadsRecordsLoading,
    getThreadsRecordDetailLoading,
    handleCrawlProfiles,
    handleCrawlPosts,
    handleDiscoverPostsByProfile,
    handleGetSnapshot,
    handleGetThreadsRecords,
    handleGetThreadsRecordDetail,
  };
};
