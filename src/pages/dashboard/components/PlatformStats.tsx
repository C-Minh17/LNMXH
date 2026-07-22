import {
  FacebookOutlined,
  TikTokOutlined,
  InstagramOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import React from "react";

interface PlatformStatsProps {
  recordsData?: MCrawlSource.IDashboardRecords;
}

export const PlatformStats: React.FC<PlatformStatsProps> = ({ recordsData }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: "100%" }}>
          <Statistic
            title="Facebook Records"
            value={recordsData?.facebook || 0}
            prefix={<FacebookOutlined style={{ color: "#1890ff" }} />}
            valueStyle={{ fontWeight: "bold", color: "#1890ff" }}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: "#8c8c8c" }}>
            Dữ liệu từ các nguồn Facebook
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: "100%" }}>
          <Statistic
            title="TikTok Records"
            value={recordsData?.tiktok || 0}
            prefix={<TikTokOutlined style={{ color: "#eb2f96" }} />}
            valueStyle={{ fontWeight: "bold", color: "#eb2f96" }}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: "#8c8c8c" }}>
            {recordsData?.tiktok_with_script || 0} bài có Transcript
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: "100%" }}>
          <Statistic
            title="Instagram Records"
            value={recordsData?.instagram || 0}
            prefix={<InstagramOutlined style={{ color: "#722ed1" }} />}
            valueStyle={{ fontWeight: "bold", color: "#722ed1" }}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: "#8c8c8c" }}>
            Dữ liệu bài viết & profile IG
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: "100%" }}>
          <Statistic
            title="Threads Records"
            value={recordsData?.threads || 0}
            prefix={<ThunderboltOutlined style={{ color: "#13c2c2" }} />}
            valueStyle={{ fontWeight: "bold", color: "#13c2c2" }}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: "#8c8c8c" }}>
            Dữ liệu bài viết & profile Threads
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default PlatformStats;
