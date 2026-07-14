import { useModel } from "@umijs/max";
import { Col, Row, theme, Typography } from "antd";
import React, { useState } from "react";
import CrawlForm from "./components/CrawlForm";
import TranscriptCard from "./components/TranscriptCard";
import RecordsTable from "./components/RecordsTable";

const { Title } = Typography;

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
    handleCrawlProfiles,
    handleDiscoverProfilesBySearchUrl,
    handleCrawlPosts,
    handleDiscoverPostsByKeyword,
    handleDiscoverPostsByProfileUrl,
    handleDiscoverPostsByUrl,
    handleProcessScripts,
    handleProcessScriptByRecordId,
  } = useModel("crawl-tiktok.crawl-tiktok");

  // Local state to trigger RecordsTable refresh
  const [recordsReloadKey, setRecordsReloadKey] = useState<number>(0);

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

    // If snapshot task request succeeded, trigger records reload
    if (res?.success) {
      setRecordsReloadKey((prev) => prev + 1);
      return true;
    }
    return false;
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
          <CrawlForm loading={isSubmitting} onSubmit={handleSubmitCrawl} />
        </Col>

        <Col xs={24} lg={10}>
          <TranscriptCard
            processScriptsLoading={processScriptsLoading}
            processScriptByRecordIdLoading={processScriptByRecordIdLoading}
            onProcessScripts={handleProcessScriptsBacklog}
            onProcessScriptByRecordId={handleProcessSingleScript}
            colorPrimary={token.colorPrimary}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <RecordsTable reloadKey={recordsReloadKey} colorPrimary={token.colorPrimary} />
        </Col>
      </Row>
    </div>
  );
};

export default CrawlTiktokPanel;
