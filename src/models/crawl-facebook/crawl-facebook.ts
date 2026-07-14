import {
  crawlFacebookGroupPosts,
  crawlFacebookPagePosts,
  crawlFacebookPagesProfiles,
  crawlFacebookProfiles,
  crawlFacebookReels,
  getFacebookSnapshot,
  getFacebookRecords,
  getFacebookRecordDetail,
} from "@/services/crawl-facebook";
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
  const [crawlPagePostsLoading, setCrawlPagePostsLoading] = useState<boolean>(false);
  const [crawlGroupPostsLoading, setCrawlGroupPostsLoading] = useState<boolean>(false);
  const [crawlProfilesLoading, setCrawlProfilesLoading] = useState<boolean>(false);
  const [crawlPagesProfilesLoading, setCrawlPagesProfilesLoading] = useState<boolean>(false);
  const [crawlReelsLoading, setCrawlReelsLoading] = useState<boolean>(false);
  const [snapshotLoading, setSnapshotLoading] = useState<boolean>(false);
  const [getFacebookRecordsLoading, setGetFacebookRecordsLoading] = useState<boolean>(false);
  const [getFacebookRecordDetailLoading, setGetFacebookRecordDetailLoading] = useState<boolean>(false);

  const handleCrawlPagePosts = async (data: MCrawlFacebook.IPagePostRequest) => {
    setCrawlPagePostsLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlFacebookPagePosts(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào dữ liệu Fanpage (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "page-posts", getFacebookSnapshot);
          message.success("Thu thập dữ liệu bài viết Fanpage thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl bài viết theo page URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl bài viết theo page URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl bài viết theo page URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlPagePostsLoading(false);
    }
  };

  const handleCrawlGroupPosts = async (data: MCrawlFacebook.IGroupPostRequest) => {
    setCrawlGroupPostsLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlFacebookGroupPosts(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào dữ liệu Group (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "group-posts", getFacebookSnapshot);
          message.success("Thu thập dữ liệu bài viết Group thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl bài viết theo group URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl bài viết theo group URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl bài viết theo group URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlGroupPostsLoading(false);
    }
  };

  const handleCrawlProfiles = async (data: MCrawlFacebook.IProfileRequest) => {
    setCrawlProfilesLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlFacebookProfiles(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào profile Facebook (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "profiles", getFacebookSnapshot);
          message.success("Thu thập dữ liệu cá nhân thành công!");
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

  const handleCrawlPagesProfiles = async (data: MCrawlFacebook.IPageProfileRequest) => {
    setCrawlPagesProfilesLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlFacebookPagesProfiles(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào pages & profiles (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "pages-profiles", getFacebookSnapshot);
          message.success("Thu thập dữ liệu pages & profiles thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl pages & profiles theo URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl pages & profiles theo URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl pages & profiles theo URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlPagesProfilesLoading(false);
    }
  };

  const handleCrawlReels = async (data: MCrawlFacebook.IReelRequest) => {
    setCrawlReelsLoading(true);
    let hideMessage: any = null;
    try {
      const res = await crawlFacebookReels(data);
      if (res?.success) {
        const snapshotId = res?.data?.snapshot_id;
        if (snapshotId) {
          hideMessage = message.loading(`Đang cào video Reels (Snapshot ID: ${snapshotId})...`, 0);
          await waitForSnapshot(snapshotId, "reels", getFacebookSnapshot);
          message.success("Thu thập dữ liệu Reels thành công!");
        } else {
          message.success(res.message || "Yêu cầu crawl reels theo profile URL thành công");
        }
      } else {
        message.error(res?.message || "Lỗi crawl reels theo profile URL");
      }
      return res;
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi crawl reels theo profile URL");
      return null;
    } finally {
      if (hideMessage) hideMessage();
      setCrawlReelsLoading(false);
    }
  };

  const handleGetSnapshot = async (snapshot_id: string, params?: MCrawlFacebook.ISnapshotParams) => {
    setSnapshotLoading(true);
    try {
      const res = await getFacebookSnapshot(snapshot_id, params);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy kết quả snapshot");
      return null;
    } finally {
      setSnapshotLoading(false);
    }
  };

  const handleGetFacebookRecords = async (params?: MCrawlFacebook.IRecordParams) => {
    setGetFacebookRecordsLoading(true);
    try {
      const res = await getFacebookRecords(params);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy danh sách records đã crawl");
      return null;
    } finally {
      setGetFacebookRecordsLoading(false);
    }
  };

  const handleGetFacebookRecordDetail = async (record_id: number) => {
    setGetFacebookRecordDetailLoading(true);
    try {
      const res = await getFacebookRecordDetail(record_id);
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy chi tiết record đã crawl");
      return null;
    } finally {
      setGetFacebookRecordDetailLoading(false);
    }
  };

  return {
    crawlPagePostsLoading,
    crawlGroupPostsLoading,
    crawlProfilesLoading,
    crawlPagesProfilesLoading,
    crawlReelsLoading,
    snapshotLoading,
    getFacebookRecordsLoading,
    getFacebookRecordDetailLoading,
    handleCrawlPagePosts,
    handleCrawlGroupPosts,
    handleCrawlProfiles,
    handleCrawlPagesProfiles,
    handleCrawlReels,
    handleGetSnapshot,
    handleGetFacebookRecords,
    handleGetFacebookRecordDetail,
  };
};
