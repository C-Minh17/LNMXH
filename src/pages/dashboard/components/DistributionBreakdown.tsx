import {
  FacebookOutlined,
  TikTokOutlined,
  InstagramOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Tag, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface DistributionBreakdownProps {
  sourcesData?: MCrawlSource.IDashboardSources;
}

export const DistributionBreakdown: React.FC<DistributionBreakdownProps> = ({
  sourcesData,
}) => {
  const getPlatformTag = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "facebook":
        return <Tag color="blue" icon={<FacebookOutlined />}>Facebook</Tag>;
      case "tiktok":
        return <Tag color="magenta" icon={<TikTokOutlined />}>TikTok</Tag>;
      case "instagram":
        return <Tag color="purple" icon={<InstagramOutlined />}>Instagram</Tag>;
      case "threads":
        return <Tag color="cyan" icon={<ThunderboltOutlined />}>Threads</Tag>;
      default:
        return <Tag color="default">{platform}</Tag>;
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card
          title="Phân bố Nguồn Crawl theo Nền tảng (Platform)"
          style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        >
          <Row gutter={[16, 16]}>
            {Object.entries(sourcesData?.by_platform || {}).map(([pf, count]) => (
              <Col span={12} key={pf}>
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#fafafa",
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {getPlatformTag(pf)}
                  <Text strong style={{ fontSize: 16 }}>
                    {count} nguồn
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card
          title="Phân bố Nguồn Crawl theo Loại Scraper"
          bordered={false}
          style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        >
          <Row gutter={[12, 12]}>
            {Object.entries(sourcesData?.by_scraper_type || {}).map(([type, count]) => (
              <Col span={12} key={type}>
                <div
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "#fafafa",
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Tag color="gold" style={{ margin: 0 }}>{type}</Tag>
                  <Text strong>{count} nguồn</Text>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default DistributionBreakdown;
