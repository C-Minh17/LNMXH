import { CopyOutlined, EyeOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  Button,
  Card,
  Descriptions,
  message,
  Modal,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "@/utils/dayjs";
import React, { useEffect, useState } from "react";
import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";

const { Text, Link } = Typography;

interface CrawlRecordsModalProps {
  open: boolean;
  onCancel: () => void;
  source?: MCrawlSource.IRecord;
}

export const CrawlRecordsModal: React.FC<CrawlRecordsModalProps> = ({
  open,
  onCancel,
  source,
}) => {
  const { handleGetCrawlSourceRecords } = useModel(
    "crawl-source.crawl-source"
  );

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailRecord, setDetailRecord] = useState<any>(null);

  const fetchRecords = async (currentPage = page, currentPageSize = pageSize) => {
    if (!source) return;
    setLoading(true);
    try {
      const res = await handleGetCrawlSourceRecords(source.id, {
        page: currentPage,
        page_size: currentPageSize,
      });
      if (res?.success) {
        setRecords(res.data || []);
        setTotal(res.metadata?.total || res.data?.length || 0);
      } else {
        setRecords([]);
        setTotal(0);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi lấy danh sách kết quả crawl");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && source) {
      setPage(1);
      fetchRecords(1, pageSize);
    } else {
      setRecords([]);
      setTotal(0);
    }
  }, [open, source, pageSize]);

  useEffect(() => {
    if (open && source && page > 1) {
      fetchRecords(page, pageSize);
    }
  }, [page]);

  const handleViewDetail = async (record: any) => {
    setDetailRecord(record);
    setDetailOpen(true);
  };

  const formatTime = (ts: any) => {
    if (!ts) return "-";
    if (typeof ts === "number") {
      const isMillis = ts > 9999999999;
      return dayjs(isMillis ? ts : ts * 1000).tz().format("DD-MM-YYYY HH:mm");
    }
    return dayjs(ts).tz().format("DD-MM-YYYY HH:mm");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Đã sao chép vào bộ nhớ tạm");
  };

  const columns: IColumn<any>[] = [
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
      title: "Record URL",
      dataIndex: "record_url",
      key: "record_url",
      width: 250,
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
      render: (_: any, record: any) => {
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
      title: "Thời gian cào",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (time: any, record: any) => formatTime(record?.raw_data?.timestamp || time),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      width: 100,
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Tooltip title="Xem chi tiết dữ liệu cào">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: 18, fontWeight: "bold" }}>
              Kết quả crawl gần nhất: {source?.name}
            </span>
            {source?.platform && (
              <Tag
                color={
                  source.platform === "facebook"
                    ? "blue"
                    : source.platform === "tiktok"
                      ? "magenta"
                      : source.platform === "instagram"
                        ? "orange"
                        : "cyan"
                }
                style={{ textTransform: "capitalize", fontWeight: "bold" }}
              >
                {source.platform}
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
        width={950}
        destroyOnClose
      >
        <Card style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", margin: "8px 0" }} >
          <TableStaticData
            data={records}
            columns={columns}
            loading={loading}
            onReload={() => fetchRecords(page, pageSize)}
            hasTotal={true}
            otherProps={{
              rowKey: "id",
              scroll: { x: 800 },
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
          />
        </Card>
      </Modal>

      {/* Nested detail modal */}
      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "95%" }}>
            <span style={{ fontSize: 18, fontWeight: "bold" }}>
              Chi tiết Record <span style={{ textTransform: "capitalize" }}>{source?.platform}</span>: #{detailRecord?.id}
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
          {detailRecord ? (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="ID">{detailRecord.id}</Descriptions.Item>
                <Descriptions.Item label="Thời gian cào">{formatTime(detailRecord.raw_data?.timestamp || detailRecord.created_at)}</Descriptions.Item>
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
                {detailRecord.script && (
                  <Descriptions.Item label="Transcript (STT)" span={2}>
                    <div style={{ maxHeight: 150, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                      {detailRecord.script}
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>

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
    </>
  );
};
export default CrawlRecordsModal;
