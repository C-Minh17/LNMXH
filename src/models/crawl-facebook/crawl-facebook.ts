import {
  crawlFacebookGroupPosts,
  crawlFacebookPagePosts,
  crawlFacebookPagesProfiles,
  crawlFacebookProfiles,
  crawlFacebookReels,
  getFacebookSnapshot,
} from "@/services/crawl-facebook";
import { message } from "antd";
import { useState } from "react";

export default () => {
  const [crawlPagePostsLoading, setCrawlPagePostsLoading] = useState<boolean>(false);
  const [crawlGroupPostsLoading, setCrawlGroupPostsLoading] = useState<boolean>(false);
  const [crawlProfilesLoading, setCrawlProfilesLoading] = useState<boolean>(false);
  const [crawlPagesProfilesLoading, setCrawlPagesProfilesLoading] = useState<boolean>(false);
  const [crawlReelsLoading, setCrawlReelsLoading] = useState<boolean>(false);
  const [snapshotLoading, setSnapshotLoading] = useState<boolean>(false);

  const handleCrawlPagePosts = async (data: MCrawlFacebook.IPagePostRequest) => {
    setCrawlPagePostsLoading(true);
    try {
      const res = await crawlFacebookPagePosts(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu crawl bài viết theo page URL thành công");
      } else {
        message.error(res?.message || "Lỗi crawl bài viết theo page URL");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi crawl bài viết theo page URL");
      return null;
    } finally {
      setCrawlPagePostsLoading(false);
    }
  };

  const handleCrawlGroupPosts = async (data: MCrawlFacebook.IGroupPostRequest) => {
    setCrawlGroupPostsLoading(true);
    try {
      const res = await crawlFacebookGroupPosts(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu crawl bài viết theo group URL thành công");
      } else {
        message.error(res?.message || "Lỗi crawl bài viết theo group URL");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi crawl bài viết theo group URL");
      return null;
    } finally {
      setCrawlGroupPostsLoading(false);
    }
  };

  const handleCrawlProfiles = async (data: MCrawlFacebook.IProfileRequest) => {
    setCrawlProfilesLoading(true);
    try {
      const res = await crawlFacebookProfiles(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu crawl profile theo URL thành công");
      } else {
        message.error(res?.message || "Lỗi crawl profile theo URL");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi crawl profile theo URL");
      return null;
    } finally {
      setCrawlProfilesLoading(false);
    }
  };

  const handleCrawlPagesProfiles = async (data: MCrawlFacebook.IPageProfileRequest) => {
    setCrawlPagesProfilesLoading(true);
    try {
      const res = await crawlFacebookPagesProfiles(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu crawl pages & profiles theo URL thành công");
      } else {
        message.error(res?.message || "Lỗi crawl pages & profiles theo URL");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi crawl pages & profiles theo URL");
      return null;
    } finally {
      setCrawlPagesProfilesLoading(false);
    }
  };

  const handleCrawlReels = async (data: MCrawlFacebook.IReelRequest) => {
    setCrawlReelsLoading(true);
    try {
      const res = await crawlFacebookReels(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu crawl reels theo profile URL thành công");
      } else {
        message.error(res?.message || "Lỗi crawl reels theo profile URL");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi crawl reels theo profile URL");
      return null;
    } finally {
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

  return {
    crawlPagePostsLoading,
    crawlGroupPostsLoading,
    crawlProfilesLoading,
    crawlPagesProfilesLoading,
    crawlReelsLoading,
    snapshotLoading,
    handleCrawlPagePosts,
    handleCrawlGroupPosts,
    handleCrawlProfiles,
    handleCrawlPagesProfiles,
    handleCrawlReels,
    handleGetSnapshot,
  };
};
