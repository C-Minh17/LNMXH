import { EyeOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  Button,
  Card,
  Form,
  Segmented,
  Space,
  Tag,
  theme,
  Tooltip,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import CrawlHistoryFilterForm from "./crawlHistoryFilterForm";
import CrawlHistoryDetailModal from "./crawlHistoryDetailModal";

const { Text, Link } = Typography;

interface CrawlHistoryTableProps {
  reloadKey?: number;
}

export const CrawlHistoryTable: React.FC<CrawlHistoryTableProps> = ({ reloadKey }) => {
  const { token } = theme.useToken();
  const [activePlatform, setActivePlatform] = useState<string>("facebook");
  const [form] = Form.useForm();

  // Load platform models
  const fbModel = useModel("crawl-facebook.crawl-facebook");
  const ttModel = useModel("crawl-tiktok.crawl-tiktok");
  const igModel = useModel("crawl-ig.crawl-ig");
  const thModel = useModel("crawl-threads.crawl-threads");

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Detail Modal State
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailRecord, setDetailRecord] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  const fetchRecords = async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const payload: any = {
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

      if (activePlatform === "tiktok" && values.has_script !== undefined) {
        if (values.has_script === "true") {
          payload.has_script = true;
        } else if (values.has_script === "false") {
          payload.has_script = false;
        }
      }

      let res: any = null;
      if (activePlatform === "facebook") {
        res = await fbModel.handleGetFacebookRecords(payload);
      } else if (activePlatform === "tiktok") {
        res = await ttModel.handleGetTiktokRecords(payload);
      } else if (activePlatform === "instagram") {
        res = await igModel.handleGetIgRecords(payload);
      } else if (activePlatform === "threads") {
        res = await thModel.handleGetThreadsRecords(payload);
      }

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
      message.error("Lỗi lấy danh sách lịch sử cào");
    } finally {
      setLoading(false);
    }
  };

  // Triggers reload when page/pagesize or active platform changes
  useEffect(() => {
    fetchRecords(1, pageSize);
    setPage(1);
  }, [activePlatform, pageSize]);

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
      let res: any = null;
      if (activePlatform === "facebook") {
        res = await fbModel.handleGetFacebookRecordDetail(recordId);
      } else if (activePlatform === "tiktok") {
        res = await ttModel.handleGetTiktokRecordDetail(recordId);
      } else if (activePlatform === "instagram") {
        res = await igModel.handleGetIgRecordDetail(recordId);
      } else if (activePlatform === "threads") {
        res = await thModel.handleGetThreadsRecordDetail(recordId);
      }

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



  const columns: IColumn<any>[] = useMemo(() => {
    const cols: IColumn<any>[] = [
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
        width: 180,
        render: (type: string) => {
          let color = "blue";
          if (type?.includes("post")) color = "purple";
          if (type?.includes("keyword") || type?.includes("discover")) color = "orange";
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
        title: "Trạng thái",
        key: "status",
        width: 130,
        render: (_, record: any) => {
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
    ];

    if (activePlatform === "tiktok") {
      cols.push({
        title: "Transcript",
        dataIndex: "has_script",
        key: "has_script",
        width: 140,
        render: (hasScript: boolean) => (
          <Tag color={hasScript ? "success" : "default"}>
            {hasScript ? "Đã có" : "Chưa có"}
          </Tag>
        ),
      });
    }

    cols.push(
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
        align: "center",
        width: 100,
        fixed: "right",
        render: (_, record: any) => (
          <Tooltip title="Xem chi tiết dữ liệu cào">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record.id)}
            />
          </Tooltip>
        ),
      }
    );

    return cols;
  }, [activePlatform]);

  const segmentedOptions = [
    { label: "Facebook", value: "facebook" },
    { label: "TikTok", value: "tiktok" },
    { label: "Instagram", value: "instagram" },
    { label: "Threads", value: "threads" },
  ];

  return (
    <Card
      title={
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", width: "100%" }}>
          <span style={{ fontSize: 18, fontWeight: "bold", color: token.colorPrimary }}>Lịch sử dữ liệu đã thu thập</span>
          <Segmented
            options={segmentedOptions}
            value={activePlatform}
            onChange={(val) => {
              setActivePlatform(val as string);
              form.resetFields();
            }}
            size="middle"
          />
        </div>
      }
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
        <CrawlHistoryFilterForm
          form={form}
          activePlatform={activePlatform}
          onSearch={handleSearch}
        />
      </TableStaticData>

      <CrawlHistoryDetailModal
        open={detailOpen}
        record={detailRecord}
        loading={detailLoading}
        onCancel={() => {
          setDetailOpen(false);
          setDetailRecord(null);
        }}
        activePlatform={activePlatform}
        colorPrimary={token.colorPrimary}
      />
    </Card>
  );
};
