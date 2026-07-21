import { CopyOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Modal, Space, Spin, Tag, Typography, message } from "antd";
import dayjs from "dayjs";
import React from "react";

const { Text, Link, Paragraph } = Typography;

interface CrawlHistoryDetailModalProps {
  open: boolean;
  record: any;
  loading: boolean;
  onCancel: () => void;
  activePlatform: string;
  colorPrimary: string;
}

export const CrawlHistoryDetailModal: React.FC<CrawlHistoryDetailModalProps> = ({
  open,
  record,
  loading,
  onCancel,
  activePlatform,
  colorPrimary,
}) => {
  const formatTime = (ts: any) => {
    if (!ts) return "-";
    if (typeof ts === "number") {
      const isMillis = ts > 9999999999;
      return dayjs(isMillis ? ts : ts * 1000).format("DD-MM-YYYY HH:mm");
    }
    return dayjs(ts).format("DD-MM-YYYY HH:mm");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Đã sao chép vào bộ nhớ tạm");
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "95%" }}>
          <span style={{ fontSize: 18, fontWeight: "bold", color: colorPrimary }}>
            Chi tiết Record: #{record?.id}
          </span>
          {record?.scraper_type && (
            <Tag color="purple" style={{ textTransform: "uppercase" }}>
              {record?.scraper_type}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={850}
      destroyOnClose
    >
      <div style={{ minHeight: 250, padding: "10px 0" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 10 }}>Đang tải chi tiết bản ghi...</div>
          </div>
        ) : record ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="ID">{record.id}</Descriptions.Item>
              <Descriptions.Item label="Thời gian cào">{formatTime(record.created_at)}</Descriptions.Item>
              <Descriptions.Item label="Nền tảng">
                <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>
                  {activePlatform}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Loại Scraper">{record.scraper_type}</Descriptions.Item>
              <Descriptions.Item label="Dataset ID">{record.dataset_id || "-"}</Descriptions.Item>
              <Descriptions.Item label="Snapshot ID" span={2}>
                <Text code copyable>{record.snapshot_id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Record ID">{record.record_id || "-"}</Descriptions.Item>
              <Descriptions.Item label="Record URL" span={2}>
                {record.record_url ? (
                  <Link href={record.record_url} target="_blank" rel="noopener noreferrer">
                    {record.record_url}
                  </Link>
                ) : (
                  "-"
                )}
              </Descriptions.Item>
              {record.error && (
                <Descriptions.Item label="Lỗi cào" span={2}>
                  <Text type="danger">{record.error}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            {record.script && (
              <Card
                title="Nội dung Transcript (Video Script)"
                size="small"
                type="inner"
                style={{ borderRadius: 8 }}
              >
                <Paragraph style={{ maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                  {record.script}
                </Paragraph>
              </Card>
            )}

            <Card
              title="Dữ liệu JSON thô (Raw Data)"
              size="small"
              type="inner"
              style={{ borderRadius: 8 }}
              extra={
                <Button
                  type="link"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(JSON.stringify(record.raw_data, null, 2))}
                >
                  Sao chép JSON
                </Button>
              }
            >
              <div style={{ maxHeight: 350, overflowY: "auto", backgroundColor: "#f5f5f5", padding: 10, borderRadius: 6 }}>
                <pre style={{ margin: 0, fontSize: 12 }}>
                  {JSON.stringify(record.raw_data, null, 2)}
                </pre>
              </div>
            </Card>
          </Space>
        ) : (
          <div style={{ textAlign: "center", color: "#bfbfbf", padding: "40px 0" }}>
            Không tải được thông tin bản ghi
          </div>
        )}
      </div>
    </Modal>
  );
};
export default CrawlHistoryDetailModal;
