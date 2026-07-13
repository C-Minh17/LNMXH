import { useModel } from "@umijs/max";
import { Col, Row, theme, Typography, Space } from "antd";
import React, { useEffect, useState } from "react";
import CrawlForm from "./components/CrawlForm";
import TranscriptCard from "./components/TranscriptCard";
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

const CrawlTiktokPanel: React.FC = () => {
  const { token } = theme.useToken();

  const {
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
  } = useModel("crawl-tiktok.crawl-tiktok");

  // Local state
  const [historyList, setHistoryList] = useState<ISnapshotHistoryItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>("");
  const [selectedSnapshotType, setSelectedSnapshotType] = useState<string>("");
  const [snapshotData, setSnapshotData] = useState<any[]>([]);

  // Load snapshot request history from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem("crawl_tiktok_snapshots_history");
    if (cached) {
      try {
        setHistoryList(JSON.parse(cached));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save snapshot request history to localStorage helper
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
    localStorage.setItem("crawl_tiktok_snapshots_history", JSON.stringify(updated));
  };

  // Determine global loading state based on chosen scraper
  const isSubmitting =
    crawlProfilesLoading ||
    discoverProfilesBySearchUrlLoading ||
    crawlPostsLoading ||
    discoverPostsByKeywordLoading ||
    discoverPostsByProfileUrlLoading ||
    discoverPostsByUrlLoading;

  const handleSubmitCrawl = async (values: any) => {
    const { scraper_type, urls, country, with_script, num_of_posts, what_to_collect } = values;

    const urlList: string[] = (urls || "")
      .split("\n")
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);

    if (urlList.length === 0) {
      return false;
    }

    let res: any = null;

    if (scraper_type === "profiles") {
      const payload: MCrawlTiktok.IProfileRequest = {
        input: urlList.map((url: string) => ({
          country: country || undefined,
          url,
        })),
      };
      res = await handleCrawlProfiles(payload);
    } else if (scraper_type === "profiles-discover") {
      const payload: MCrawlTiktok.ISearchProfileRequest = {
        input: urlList.map((url: string) => ({
          country: country || undefined,
          search_url: url,
        })),
      };
      res = await handleDiscoverProfilesBySearchUrl(payload);
    } else if (scraper_type === "posts") {
      const payload: MCrawlTiktok.IPostRequest = {
        input: urlList.map((url: string) => ({
          country: country || undefined,
          url,
        })),
        with_script: !!with_script,
      };
      res = await handleCrawlPosts(payload);
    } else if (scraper_type === "posts-keyword") {
      const payload: MCrawlTiktok.IKeywordPostRequest = {
        input: urlList.map((keyword: string) => ({
          country: country || undefined,
          search_keyword: keyword,
        })),
        with_script: !!with_script,
      };
      res = await handleDiscoverPostsByKeyword(payload);
    } else if (scraper_type === "posts-profile") {
      const payload: MCrawlTiktok.IProfilePostRequest = {
        input: urlList.map((url: string) => ({
          num_of_posts: num_of_posts || undefined,
          url,
          what_to_collect: what_to_collect || undefined,
        })),
        with_script: !!with_script,
      };
      res = await handleDiscoverPostsByProfileUrl(payload);
    } else if (scraper_type === "posts-discover") {
      const payload: MCrawlTiktok.IDiscoverPostRequest = {
        input: urlList.map((url: string) => ({
          URL: url,
        })),
        with_script: !!with_script,
      };
      res = await handleDiscoverPostsByUrl(payload);
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
    if (res?.success && res.data) {
      let records: any[] = [];
      if (Array.isArray(res.data)) {
        records = res.data;
      } else if (res.data.records && Array.isArray(res.data.records)) {
        records = res.data.records;
      } else if ((res.data as any).results && Array.isArray((res.data as any).results)) {
        records = (res.data as any).results;
      } else {
        records = [res.data];
      }
      setSnapshotData(records);
    }
  };

  const handleProcessScriptsBacklog = async (limit: number) => {
    await handleProcessScripts({ limit });
  };

  const handleProcessSingleScript = async (recordId: number) => {
    await handleProcessScriptByRecordId(recordId);
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <Title level={2} style={{ color: token.colorPrimary, marginBottom: 24 }}>
        Thu thập dữ liệu TikTok (Bright Data Scraper)
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <CrawlForm loading={isSubmitting} onSubmit={handleSubmitCrawl} />
            <TranscriptCard
              processScriptsLoading={processScriptsLoading}
              processScriptByRecordIdLoading={processScriptByRecordIdLoading}
              onProcessScripts={handleProcessScriptsBacklog}
              onProcessScriptByRecordId={handleProcessSingleScript}
              colorPrimary={token.colorPrimary}
            />
          </Space>
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

export default CrawlTiktokPanel;
