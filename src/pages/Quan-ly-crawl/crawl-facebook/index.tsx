import { useModel } from "@umijs/max";
import { Col, Row, theme, Typography } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import CrawlForm from "./components/CrawlForm";
import HistoryTable from "./components/HistoryTable";
import DetailModal from "./components/DetailModal";

const { Title } = Typography;

interface ISnapshotHistoryItem {
  id: string;
  type: string;
  time: number;
  urls_count: number;
  local_records?: any[];
}

const CrawlFacebookPanel: React.FC = () => {
  const { token } = theme.useToken();

  const {
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
  } = useModel("crawl-facebook.crawl-facebook");

  const [historyList, setHistoryList] = useState<ISnapshotHistoryItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>("");
  const [selectedSnapshotType, setSelectedSnapshotType] = useState<string>("");
  const [snapshotData, setSnapshotData] = useState<any[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem("crawl_facebook_snapshots_history");
    if (cached) {
      try {
        setHistoryList(JSON.parse(cached));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const addSnapshotToHistory = (id: string, type: string, urlsCount: number, localRecords?: any[]) => {
    const newItem: ISnapshotHistoryItem = {
      id,
      type,
      time: Math.floor(Date.now() / 1000),
      urls_count: urlsCount,
      local_records: localRecords,
    };
    const updated = [newItem, ...historyList].slice(0, 50); // limit to 50 items
    setHistoryList(updated);
    localStorage.setItem("crawl_facebook_snapshots_history", JSON.stringify(updated));
  };

  const isSubmitting =
    crawlPagePostsLoading ||
    crawlGroupPostsLoading ||
    crawlProfilesLoading ||
    crawlPagesProfilesLoading ||
    crawlReelsLoading;

  const handleSubmitCrawl = async (values: any): Promise<boolean> => {
    const { scraper_type, urls, start_date, end_date, num_of_posts, posts_to_not_include, user_to_not_include } = values;

    // Parse textarea URLs into array
    const urlList: string[] = (urls || "")
      .split("\n")
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);

    if (urlList.length === 0) {
      return false;
    }

    // Format dates to MM-DD-YYYY if provided
    const startDateStr = start_date ? dayjs(start_date).format("MM-DD-YYYY") : undefined;
    const endDateStr = end_date ? dayjs(end_date).format("MM-DD-YYYY") : undefined;

    let res: any = null;

    if (scraper_type === "page-posts") {
      const payload: MCrawlFacebook.IPagePostRequest = {
        input: urlList.map((url: string) => ({
          url,
          num_of_posts: num_of_posts || undefined,
          posts_to_not_include: posts_to_not_include
            ? posts_to_not_include.split(",").map((s: string) => s.trim())
            : undefined,
          start_date: startDateStr,
          end_date: endDateStr,
        })),
      };
      res = await handleCrawlPagePosts(payload);
    } else if (scraper_type === "group-posts") {
      const payload: MCrawlFacebook.IGroupPostRequest = {
        input: urlList.map((url: string) => ({
          url,
          user_to_not_include: user_to_not_include || undefined,
          start_date: startDateStr,
          end_date: endDateStr,
        })),
      };
      res = await handleCrawlGroupPosts(payload);
    } else if (scraper_type === "profiles") {
      const payload: MCrawlFacebook.IProfileRequest = {
        input: urlList.map((url: string) => ({ url })),
      };
      res = await handleCrawlProfiles(payload);
    } else if (scraper_type === "pages-profiles") {
      const payload: MCrawlFacebook.IPageProfileRequest = {
        input: urlList.map((url: string) => ({ url })),
      };
      res = await handleCrawlPagesProfiles(payload);
    } else if (scraper_type === "reels") {
      const payload: MCrawlFacebook.IReelRequest = {
        input: urlList.map((url: string) => ({
          url,
          start_date: startDateStr,
          end_date: endDateStr,
        })),
      };
      res = await handleCrawlReels(payload);
    }

    // If snapshot task request succeeded, record it
    if (res?.success) {
      const snapId = res?.data?.snapshot_id;
      const rawRecords = res?.data?.records || res?.data?.results || res?.data;
      const recordsArray = Array.isArray(rawRecords)
        ? rawRecords
        : (rawRecords && Array.isArray(rawRecords.records)
          ? rawRecords.records
          : (rawRecords && Array.isArray(rawRecords.results)
            ? rawRecords.results
            : null));

      if (snapId) {
        addSnapshotToHistory(snapId, scraper_type, urlList.length);
      } else if (recordsArray && Array.isArray(recordsArray)) {
        const fakeId = `sync_${Math.random().toString(36).substr(2, 9)}`;
        addSnapshotToHistory(fakeId, scraper_type, urlList.length, recordsArray);
        setSelectedSnapshotId(fakeId);
        setSelectedSnapshotType(scraper_type);
        setSnapshotData(recordsArray);
        setDetailModalOpen(true);
      } else {
        const fakeId = `sync_${Math.random().toString(36).substr(2, 9)}`;
        const fallback = res?.data ? (Array.isArray(res.data) ? res.data : [res.data]) : [];
        addSnapshotToHistory(fakeId, scraper_type, urlList.length, fallback);
        setSelectedSnapshotId(fakeId);
        setSelectedSnapshotType(scraper_type);
        setSnapshotData(fallback);
        setDetailModalOpen(true);
      }
      return true;
    }
    return false;
  };

  const handleViewSnapshot = async (id: string, type: string) => {
    setSelectedSnapshotId(id);
    setSelectedSnapshotType(type);
    setSnapshotData([]);
    setDetailModalOpen(true);

    if (id.startsWith("sync_")) {
      const historyItem = historyList.find((h) => h.id === id);
      if (historyItem && historyItem.local_records) {
        setSnapshotData(historyItem.local_records);
      }
      return;
    }

    const res = await handleGetSnapshot(id, { scraper_type: type });
    if (res?.success && Array.isArray(res.data)) {
      setSnapshotData(res.data);
    } else if (res?.success && res.data?.results && Array.isArray(res.data.results)) {
      setSnapshotData(res.data.results);
    } else if (res?.success && res.data?.records && Array.isArray(res.data.records)) {
      setSnapshotData(res.data.records);
    } else if (res?.success && res.data) {
      setSnapshotData(Array.isArray(res.data) ? res.data : [res.data]);
    }
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <Title level={2} style={{ color: token.colorPrimary, marginBottom: 24 }}>
        Thu thập dữ liệu Facebook (Bright Data Scraper)
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <CrawlForm loading={isSubmitting} onSubmit={handleSubmitCrawl} />
        </Col>

        <Col xs={24} lg={10}>
          <HistoryTable
            dataSource={historyList}
            onView={handleViewSnapshot}
            colorPrimary={token.colorPrimary}
          />
        </Col>
      </Row>

      <DetailModal
        open={detailModalOpen}
        loading={snapshotLoading}
        snapshotId={selectedSnapshotId}
        snapshotType={selectedSnapshotType}
        data={snapshotData}
        onCancel={() => setDetailModalOpen(false)}
        onRefresh={() => handleViewSnapshot(selectedSnapshotId, selectedSnapshotType)}
        colorPrimary={token.colorPrimary}
      />
    </div>
  );
};

export default CrawlFacebookPanel;
