import { AudioOutlined, FileTextOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Card, Col, InputNumber, Row, Space, Typography, message } from "antd";
import React, { useState } from "react";

const { Title } = Typography;

interface TranscriptCardProps {
  processScriptsLoading: boolean;
  processScriptByRecordIdLoading: boolean;
  onProcessScripts: (limit: number) => Promise<void>;
  onProcessScriptByRecordId: (recordId: number) => Promise<void>;
  colorPrimary?: string;
}

export const TranscriptCard: React.FC<TranscriptCardProps> = ({
  processScriptsLoading,
  processScriptByRecordIdLoading,
  onProcessScripts,
  onProcessScriptByRecordId,
  colorPrimary,
}) => {
  const [scriptLimit, setScriptLimit] = useState<number>(20);
  const [recordIdInput, setRecordIdInput] = useState<number | undefined>(undefined);

  const handleProcessBacklog = async () => {
    await onProcessScripts(scriptLimit);
  };

  const handleProcessSingleRecord = async () => {
    if (recordIdInput === undefined || isNaN(recordIdInput)) {
      message.warning("Vui lòng nhập ID bản ghi hợp lệ!");
      return;
    }
    await onProcessScriptByRecordId(recordIdInput);
  };

  return (
    <Card
      title={
        <Space>
          <AudioOutlined style={{ color: colorPrimary }} />
          <span>Xử lý quét phụ đề (Transcript / STT) bổ sung</span>
        </Space>
      }
      bordered={false}
      style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} style={{ borderRight: "1px solid #f0f0f0" }}>
          <Title level={5} style={{ marginBottom: 12 }}>
            Chạy quét cho hàng loạt bản ghi chưa có script
          </Title>
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div>
              <span style={{ marginRight: 8 }}>Giới hạn xử lý (limit):</span>
              <InputNumber
                min={1}
                value={scriptLimit}
                onChange={(val) => setScriptLimit(val || 20)}
                style={{ width: 120 }}
              />
            </div>
            <Button
              type="default"
              icon={<SyncOutlined />}
              loading={processScriptsLoading}
              onClick={handleProcessBacklog}
            >
              Bắt đầu tiến trình quét
            </Button>
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Title level={5} style={{ marginBottom: 12 }}>
            Lấy script cho một bản ghi cụ thể
          </Title>
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div>
              <span style={{ marginRight: 8 }}>Mã bản ghi (record_id):</span>
              <InputNumber
                min={1}
                value={recordIdInput}
                onChange={(val) => setRecordIdInput(val || undefined)}
                placeholder="Nhập record ID"
                style={{ width: 150 }}
              />
            </div>
            <Button
              type="default"
              icon={<FileTextOutlined />}
              loading={processScriptByRecordIdLoading}
              onClick={handleProcessSingleRecord}
            >
              Lấy script ngay lập tức
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
export default TranscriptCard;
