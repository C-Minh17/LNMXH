import { useModel } from "@umijs/max";
import { Col, Row, theme, Typography } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import CrawlForm from "./components/CrawlForm";
import RecordsTable from "./components/RecordsTable";

const { Title } = Typography;

const CrawlFacebookPanel: React.FC = () => {
  const { token } = theme.useToken();

  const {
    crawlPagePostsLoading,
    crawlGroupPostsLoading,
    crawlProfilesLoading,
    crawlPagesProfilesLoading,
    crawlReelsLoading,
    handleCrawlPagePosts,
    handleCrawlGroupPosts,
    handleCrawlProfiles,
    handleCrawlPagesProfiles,
    handleCrawlReels,
  } = useModel("crawl-facebook.crawl-facebook");

  // Local state to trigger RecordsTable refresh
  const [recordsReloadKey, setRecordsReloadKey] = useState<number>(0);

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

    // If snapshot task request succeeded, trigger records reload
    if (res?.success) {
      setRecordsReloadKey((prev) => prev + 1);
      return true;
    }
    return false;
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <Title level={2} style={{ color: token.colorPrimary, marginBottom: 24 }}>
        Thu thập dữ liệu Facebook (Bright Data Scraper)
      </Title>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <CrawlForm loading={isSubmitting} onSubmit={handleSubmitCrawl} />
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

export default CrawlFacebookPanel;
