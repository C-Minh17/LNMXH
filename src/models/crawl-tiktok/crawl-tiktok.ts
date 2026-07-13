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
} from "@/services/crawl-tiktok";
import { message } from "antd";
import { useState } from "react";

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

  const handleCrawlProfiles = async (data: MCrawlTiktok.IProfileRequest) => {
    setCrawlProfilesLoading(true);
    try {
      const res = await crawlTiktokProfiles(data);
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

  const handleDiscoverProfilesBySearchUrl = async (data: MCrawlTiktok.ISearchProfileRequest) => {
    setDiscoverProfilesBySearchUrlLoading(true);
    try {
      const res = await discoverTiktokProfilesBySearchUrl(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu discover profile theo search URL thành công");
      } else {
        message.error(res?.message || "Lỗi discover profile theo search URL");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi discover profile theo search URL");
      return null;
    } finally {
      setDiscoverProfilesBySearchUrlLoading(false);
    }
  };

  const handleCrawlPosts = async (data: MCrawlTiktok.IPostRequest) => {
    setCrawlPostsLoading(true);
    try {
      const res = await crawlTiktokPosts(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu crawl bài viết theo URL thành công");
      } else {
        message.error(res?.message || "Lỗi crawl bài viết theo URL");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi crawl bài viết theo URL");
      return null;
    } finally {
      setCrawlPostsLoading(false);
    }
  };

  const handleDiscoverPostsByKeyword = async (data: MCrawlTiktok.IKeywordPostRequest) => {
    setDiscoverPostsByKeywordLoading(true);
    try {
      const res = await discoverTiktokPostsByKeyword(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu discover video theo keyword thành công");
      } else {
        message.error(res?.message || "Lỗi discover video theo keyword");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi discover video theo keyword");
      return null;
    } finally {
      setDiscoverPostsByKeywordLoading(false);
    }
  };

  const handleDiscoverPostsByProfileUrl = async (data: MCrawlTiktok.IProfilePostRequest) => {
    setDiscoverPostsByProfileUrlLoading(true);
    try {
      const res = await discoverTiktokPostsByProfileUrl(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu discover video theo profile URL thành công");
      } else {
        message.error(res?.message || "Lỗi discover video theo profile URL");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi discover video theo profile URL");
      return null;
    } finally {
      setDiscoverPostsByProfileUrlLoading(false);
    }
  };

  const handleDiscoverPostsByUrl = async (data: MCrawlTiktok.IDiscoverPostRequest) => {
    setDiscoverPostsByUrlLoading(true);
    try {
      const res = await discoverTiktokPostsByUrl(data);
      if (res?.success) {
        message.success(res.message || "Yêu cầu discover video từ trang Discover thành công");
      } else {
        message.error(res?.message || "Lỗi discover video từ trang Discover");
      }
      return res;
    } catch (error) {
      console.error(error);
      message.error("Lỗi discover video từ trang Discover");
      return null;
    } finally {
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
    handleCrawlProfiles,
    handleDiscoverProfilesBySearchUrl,
    handleCrawlPosts,
    handleDiscoverPostsByKeyword,
    handleDiscoverPostsByProfileUrl,
    handleDiscoverPostsByUrl,
    handleProcessScripts,
    handleProcessScriptByRecordId,
    handleGetSnapshot,
  };
};
