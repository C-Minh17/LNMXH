import { CheckCircleOutlined, DatabaseOutlined, FundOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Tag, theme } from "antd";
import React from "react";

interface GeneralOverviewProps {
  sourcesData?: MCrawlSource.IDashboardSources;
  recordsData?: MCrawlSource.IDashboardRecords;
}

export const GeneralOverview: React.FC<GeneralOverviewProps> = ({
  sourcesData,
  recordsData,
}) => {
  const { token } = theme.useToken();

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <Statistic
            title="Tổng số Nguồn Crawl (Sources)"
            value={sourcesData?.total || 0}
            prefix={<DatabaseOutlined style={{ color: token.colorPrimary, fontSize: 24 }} />}
            valueStyle={{ fontWeight: "bold", fontSize: 28 }}
          />
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Tag color="success" icon={<CheckCircleOutlined />} style={{ fontSize: 13, padding: "4px 8px" }}>
              Đang hoạt động (Active): {sourcesData?.active || 0}
            </Tag>
            <Tag color="default" style={{ fontSize: 13, padding: "4px 8px" }}>
              Tạm dừng (Inactive): {sourcesData?.inactive || 0}
            </Tag>
          </div>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <Statistic
            title="Tổng số Bản Ghi Đã Crawl (Total Records)"
            value={recordsData?.total || 0}
            prefix={<FundOutlined style={{ color: "#722ed1", fontSize: 24 }} />}
            valueStyle={{ fontWeight: "bold", color: "#722ed1", fontSize: 28 }}
          />
          <div style={{ marginTop: 12, fontSize: 13, color: "#8c8c8c" }}>
            Tổng dữ liệu thu thập được từ cả 4 nền tảng (Facebook, TikTok, Instagram, Threads)
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default GeneralOverview;
