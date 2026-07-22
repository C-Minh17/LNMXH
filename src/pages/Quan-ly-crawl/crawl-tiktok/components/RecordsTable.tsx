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
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "@/utils/dayjs";
import { useModel } from "@umijs/max";
import { getSourceName, getPostContent, getRecordUrl } from "@/utils/crawlUtils";

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

      if (values.has_script !== undefined) {
        if (values.has_script === "true") {
          payload.has_script = true;
        } else if (values.has_script === "false") {
          payload.has_script = false;
        }
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
      return dayjs(isMillis ? ts : ts * 1000).tz().format("DD-MM-YYYY HH:mm");
    }
    return dayjs(ts).tz().format("DD-MM-YYYY HH:mm");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Đã sao chép vào bộ nhớ tạm");
  };

  const processedRecords = useMemo(() => {
    return (records || []).map((r) => ({
      ...r,
      _source_name: getSourceName(r),
      _post_content: getPostContent(r),
      _record_url: getRecordUrl(r),
      _status: r.error ? "error" : "success",
      _has_script_str: r.has_script ? "true" : "false",
      _created_at_str: formatTime(r?.raw_data?.timestamp || r.created_at),
    }));
  }, [records]);

  const columns: IColumn<any>[] = useMemo(
    () => [
      {
        title: "Tên nguồn",
        dataIndex: "_source_name",
        key: "source_name",
        filterType: "string",
        sortable: true,
        width: 170,
        ellipsis: true,
        render: (srcName: string) => (
          <Tooltip title={srcName !== "-" ? srcName : undefined}>
            <Text strong>{srcName || "-"}</Text>
          </Tooltip>
        ),
      },
      {
        title: "Nội dung bài đăng",
        dataIndex: "_post_content",
        key: "post_content",
        filterType: "string",
        sortable: true,
        width: 260,
        ellipsis: true,
        render: (content: string) => (
          <Tooltip title={content !== "-" ? content : undefined}>
            <Text>{content || "-"}</Text>
          </Tooltip>
        ),
      },
      {
        title: "Loại Scraper",
        dataIndex: "scraper_type",
        key: "scraper_type",
        filterType: "select",
        filterData: [
          { label: "profiles (Profiles)", value: "profiles" },
          { label: "profiles-discover (Discover Search)", value: "profiles-discover" },
          { label: "posts (Video)", value: "posts" },
          { label: "posts-keyword (Discover Keyword)", value: "posts-keyword" },
          { label: "posts-profile (Discover Profile)", value: "posts-profile" },
          { label: "posts-discover (Discover Page)", value: "posts-discover" },
        ],
        sortable: true,
        width: 150,
        render: (type: string) => {
          let color = "blue";
          if (type?.includes("post")) color = "purple";
          if (type?.includes("keyword") || type?.includes("discover")) color = "orange";
          return <Tag color={color}>{type || "-"}</Tag>;
        },
      },
      {
        title: "Record URL",
        dataIndex: "_record_url",
        key: "record_url",
        filterType: "string",
        sortable: true,
        width: 220,
        ellipsis: true,
        render: (url: string) =>
          url && url !== "-" ? (
            <Link href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </Link>
          ) : (
            "-"
          ),
      },
      {
        title: "Trạng thái cào",
        dataIndex: "_status",
        key: "status",
        filterType: "select",
        filterData: [
          { label: "Thành công", value: "success" },
          { label: "Lỗi", value: "error" },
        ],
        sortable: true,
        width: 130,
        render: (status: string, record: any) => {
          if (status === "error" || record.error) {
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
        dataIndex: "_has_script_str",
        key: "has_script",
        filterType: "select",
        filterData: [
          { label: "Đã có transcript", value: "true" },
          { label: "Chưa có", value: "false" },
        ],
        sortable: true,
        width: 140,
        render: (val: string, record: any) => (
          <Tag color={record.has_script ? "success" : "default"}>
            {record.has_script ? "Đã có transcript" : "Chưa có"}
          </Tag>
        ),
      },
      {
        title: "Thời gian cào",
        dataIndex: "_created_at_str",
        key: "created_at",
        filterType: "string",
        sortable: true,
        width: 150,
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
              onClick={() => handleViewDetail(record.id)}
            />
          </Tooltip>
        ),
      },
    ],
    []
  );

  return (
    <Card
      title="Dữ liệu đã thu thập (Records)"
      style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginTop: 24 }}
    >
      <TableStaticData
        data={processedRecords}
        columns={columns}
        loading={loading}
        onReload={() => fetchRecords(page, pageSize)}
        hasTotal={true}
        addStt={true}
        otherProps={{
          rowKey: "id",
          scroll: { x: 1100 },
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
        <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="scraper_type" label="Loại Scraper">
            <Select placeholder="Tất cả loại" allowClear style={{ width: 180 }}>
              <Select.Option value="profiles">profiles (Profiles)</Select.Option>
              <Select.Option value="profiles-discover">profiles-discover (Discover Search)</Select.Option>
              <Select.Option value="posts">posts (Video)</Select.Option>
              <Select.Option value="posts-keyword">posts-keyword (Discover Keyword)</Select.Option>
              <Select.Option value="posts-profile">posts-profile (Discover Profile)</Select.Option>
              <Select.Option value="posts-discover">posts-discover (Discover Page)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="only_errors" label="Trạng thái">
            <Select placeholder="Tất cả trạng thái" allowClear style={{ width: 160 }}>
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="success">Thành công</Select.Option>
              <Select.Option value="errors">Chỉ bản ghi lỗi</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="has_script" label="Transcript">
            <Select placeholder="Tất cả" allowClear style={{ width: 150 }}>
              <Select.Option value="true">Đã có transcript</Select.Option>
              <Select.Option value="false">Chưa có transcript</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="snapshot_id" label="Snapshot ID">
            <Input placeholder="Nhập Snapshot ID..." allowClear style={{ width: 200 }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </TableStaticData>

      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "95%" }}>
            <span style={{ fontSize: 18, fontWeight: "bold", color: colorPrimary }}>
              Chi tiết Record: #{detailRecord?.id}
            </span>
            <Tag color="purple" style={{ textTransform: "uppercase" }}>
              {detailRecord?.scraper_type}
            </Tag>
          </div>
        }
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
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
                <Descriptions.Item label="Tên nguồn">
                  <Text strong>{getSourceName(detailRecord)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian cào">
                  {formatTime(detailRecord.raw_data?.timestamp || detailRecord.created_at)}
                </Descriptions.Item>
                <Descriptions.Item label="Snapshot ID">{detailRecord.snapshot_id || "-"}</Descriptions.Item>
                <Descriptions.Item label="Loại Scraper">{detailRecord.scraper_type}</Descriptions.Item>
                <Descriptions.Item label="Nội dung bài" span={2}>
                  {getPostContent(detailRecord)}
                </Descriptions.Item>
                <Descriptions.Item label="Record URL" span={2}>
                  {detailRecord.record_url ? (
                    <Link href={detailRecord.record_url} target="_blank" rel="noopener noreferrer">
                      {detailRecord.record_url}
                    </Link>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Transcript" span={2}>
                  <Tag color={detailRecord.has_script ? "success" : "default"}>
                    {detailRecord.has_script ? "Đã có transcript" : "Chưa có"}
                  </Tag>
                </Descriptions.Item>
                {detailRecord.error && (
                  <Descriptions.Item label="Lỗi cào" span={2}>
                    <Text type="danger">{detailRecord.error}</Text>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {detailRecord.script && (
                <Card title="Nội dung Transcript (STT)" size="small" type="inner" style={{ borderRadius: 8 }}>
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
