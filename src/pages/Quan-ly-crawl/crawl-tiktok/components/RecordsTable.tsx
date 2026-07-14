import { EyeOutlined, CopyOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Tooltip,
  Modal,
  Descriptions,
  Spin,
  message,
  Typography,
} from "antd";
import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useModel } from "@umijs/max";

const { Text, Link, Paragraph } = Typography;

interface RecordsTableProps {
  colorPrimary?: string;
  reloadKey?: number;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({ colorPrimary, reloadKey }) => {
  const { handleGetTiktokRecords, handleGetTiktokRecordDetail } = useModel("crawl-tiktok.crawl-tiktok");

  const [records, setRecords] = useState<MCrawlTiktok.IRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [form] = Form.useForm();

  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailRecord, setDetailRecord] = useState<MCrawlTiktok.IRecord | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  const fetchRecords = async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const payload: MCrawlTiktok.IRecordParams = {
        page: currentPage,
        page_size: currentPageSize,
        scraper_type: values.scraper_type || undefined,
        snapshot_id: values.snapshot_id ? values.snapshot_id.trim() : undefined,
      };

      if (values.only_errors === "errors") {
        payload.only_errors = true;
      } else if (values.only_errors === "success") {
        payload.only_errors = false;
      }

      if (values.has_script === "true") {
        payload.has_script = true;
      } else if (values.has_script === "false") {
        payload.has_script = false;
      }

      const res = await handleGetTiktokRecords(payload);
      if (res?.success) {
        setRecords(res.data || []);
        if (res.metadata) {
          setTotal(res.metadata.total || 0);
        } else {
          setTotal(res.data?.length || 0);
        }
      } else {
        setRecords([]);
        setTotal(0);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy danh sách dữ liệu đã cào");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(1, pageSize);
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    fetchRecords(page, pageSize);
  }, [page]);

  useEffect(() => {
    if (reloadKey) {
      fetchRecords(1, pageSize);
      setPage(1);
    }
  }, [reloadKey]);

  const handleSearch = () => {
    setPage(1);
    fetchRecords(1, pageSize);
  };

  const handleViewDetail = async (recordId: number) => {
    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const res = await handleGetTiktokRecordDetail(recordId);
      if (res?.success && res.data) {
        setDetailRecord(res.data);
      } else {
        message.error("Không tìm thấy chi tiết bản ghi");
        setDetailOpen(false);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy chi tiết bản ghi");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

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

  const columns: IColumn<MCrawlTiktok.IRecord>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Snapshot ID",
      dataIndex: "snapshot_id",
      key: "snapshot_id",
      width: 180,
      render: (id: string) => (
        <Space size="small">
          <Text code copyable={{ text: id }}>
            {id ? `${id.slice(0, 8)}...` : "-"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Loại Scraper",
      dataIndex: "scraper_type",
      key: "scraper_type",
      width: 150,
      render: (type: string) => {
        let color = "blue";
        if (type?.includes("post")) color = "purple";
        if (type?.includes("keyword")) color = "orange";
        return <Tag color={color}>{type || "-"}</Tag>;
      },
    },
    {
      title: "Record URL",
      dataIndex: "record_url",
      key: "record_url",
      width: 220,
      ellipsis: true,
      render: (url: string) =>
        url ? (
          <Link href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </Link>
        ) : (
          "-"
        ),
    },
    {
      title: "Trạng thái cào",
      key: "status",
      width: 130,
      render: (_, record: MCrawlTiktok.IRecord) => {
        if (record.error) {
          return (
            <Tooltip title={record.error}>
              <Tag color="red">Lỗi</Tag>
            </Tooltip>
          );
        }
        return <Tag color="green">Thành công</Tag>;
      },
    },
    {
      title: "Transcript (STT)",
      dataIndex: "has_script",
      key: "has_script",
      width: 140,
      render: (hasScript: boolean) => (
        <Tag color={hasScript ? "success" : "default"}>
          {hasScript ? "Đã có transcript" : "Chưa có"}
        </Tag>
      ),
    },
    {
      title: "Thời gian cào",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (time: any) => formatTime(time),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      width: 100,
      fixed: "right" as const,
      render: (_, record: MCrawlTiktok.IRecord) => (
        <Tooltip title="Xem chi tiết dữ liệu cào">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách cào TikTok"
      style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginTop: 24 }}
    >
      <TableStaticData
        data={records}
        columns={columns}
        loading={loading}
        onReload={() => fetchRecords(page, pageSize)}
        hasTotal={true}
        otherProps={{
          rowKey: "id",
          scroll: { x: 1000 },
          pagination: {
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            onChange: (p: number, ps: number) => {
              setPage(p);
              setPageSize(ps);
            },
          },
        }}
      >
        <Form
          form={form}
          layout="inline"
          onValuesChange={handleSearch}
          style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
        >
          <Form.Item name="scraper_type" style={{ marginBottom: 0 }}>
            <Select placeholder="Loại cào" style={{ width: 140 }} allowClear>
              <Select.Option value="profiles">profiles</Select.Option>
              <Select.Option value="profiles-discover">profiles-discover</Select.Option>
              <Select.Option value="posts">posts</Select.Option>
              <Select.Option value="posts-keyword">posts-keyword</Select.Option>
              <Select.Option value="posts-profile">posts-profile</Select.Option>
              <Select.Option value="posts-discover">posts-discover</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="snapshot_id" style={{ marginBottom: 0 }}>
            <Input placeholder="Snapshot ID" style={{ width: 150 }} allowClear />
          </Form.Item>
          <Form.Item name="only_errors" style={{ marginBottom: 0 }}>
            <Select placeholder="Trạng thái cào" style={{ width: 140 }} allowClear>
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="success">Thành công</Select.Option>
              <Select.Option value="errors">Chỉ record lỗi</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="has_script" style={{ marginBottom: 0 }}>
            <Select placeholder="Trạng thái Transcript" style={{ width: 160 }} allowClear>
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="true">Đã có transcript</Select.Option>
              <Select.Option value="false">Chưa có transcript</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </TableStaticData>

      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "95%" }}>
            <span style={{ fontSize: 18, fontWeight: "bold", color: colorPrimary }}>
              Chi tiết Record TikTok: #{detailRecord?.id}
            </span>
            {detailRecord?.scraper_type && (
              <Tag color="purple" style={{ textTransform: "uppercase" }}>
                {detailRecord?.scraper_type}
              </Tag>
            )}
          </div>
        }
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setDetailRecord(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setDetailOpen(false);
              setDetailRecord(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={850}
        destroyOnClose
      >
        <div style={{ minHeight: 250, padding: "10px 0" }}>
          {detailLoading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Spin size="large" />
              <div style={{ marginTop: 10 }}>Đang tải chi tiết bản ghi...</div>
            </div>
          ) : detailRecord ? (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="ID">{detailRecord.id}</Descriptions.Item>
                <Descriptions.Item label="Thời gian cào">{formatTime(detailRecord.created_at)}</Descriptions.Item>
                <Descriptions.Item label="Loại Scraper">{detailRecord.scraper_type}</Descriptions.Item>
                <Descriptions.Item label="Dataset ID">{detailRecord.dataset_id || "-"}</Descriptions.Item>
                <Descriptions.Item label="Snapshot ID" span={2}>
                  <Text code copyable>{detailRecord.snapshot_id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Record ID">{detailRecord.record_id || "-"}</Descriptions.Item>
                <Descriptions.Item label="Record URL" span={2}>
                  <Link href={detailRecord.record_url} target="_blank" rel="noopener noreferrer">
                    {detailRecord.record_url}
                  </Link>
                </Descriptions.Item>
                {detailRecord.error && (
                  <Descriptions.Item label="Lỗi cào" span={2}>
                    <Text type="danger">{detailRecord.error}</Text>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {detailRecord.script && (
                <Card
                  title="Nội dung Transcript (Video Script)"
                  size="small"
                  type="inner"
                  style={{ borderRadius: 8 }}
                >
                  <Paragraph style={{ maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                    {detailRecord.script}
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
                    onClick={() => copyToClipboard(JSON.stringify(detailRecord.raw_data, null, 2))}
                  >
                    Sao chép JSON
                  </Button>
                }
              >
                <div style={{ maxHeight: 350, overflowY: "auto", backgroundColor: "#f5f5f5", padding: 10, borderRadius: 6 }}>
                  <pre style={{ margin: 0, fontSize: 12 }}>
                    {JSON.stringify(detailRecord.raw_data, null, 2)}
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
    </Card>
  );
};

export default RecordsTable;
