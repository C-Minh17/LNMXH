import { EyeOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  Button,
  Card,
  Form,
  Segmented,
  Tag,
  theme,
  Tooltip,
  Typography,
  message,
} from "antd";
import dayjs from "@/utils/dayjs";
import React, { useEffect, useMemo, useState } from "react";
import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { getSourceName, getPostContent, getRecordUrl } from "@/utils/crawlUtils";
import { CrawlHistoryFilterForm, scraperOptionsMap } from "./crawlHistoryFilterForm";
import CrawlHistoryDetailModal from "./crawlHistoryDetailModal";

const { Text, Link } = Typography;

interface CrawlHistoryTableProps {
  reloadKey?: number;
}

export const CrawlHistoryTable: React.FC<CrawlHistoryTableProps> = ({ reloadKey }) => {
  const { token } = theme.useToken();
  const [activePlatform, setActivePlatform] = useState<string>("facebook");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Detail Modal State
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailRecord, setDetailRecord] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // Model actions
  const crawlFacebookModel = useModel("crawl-facebook.crawl-facebook");
  const crawlTiktokModel = useModel("crawl-tiktok.crawl-tiktok");
  const crawlIgModel = useModel("crawl-ig.crawl-ig");
  const crawlThreadsModel = useModel("crawl-threads.crawl-threads");

  const fetchRecords = async (currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    try {
      const formValues = form.getFieldsValue();
      const params: any = {
        page: currentPage,
        page_size: currentPageSize,
      };

      if (formValues.scraper_type) {
        params.scraper_type = formValues.scraper_type;
      }
      if (formValues.snapshot_id) {
        params.snapshot_id = formValues.snapshot_id;
      }
      if (formValues.status) {
        params.status = formValues.status;
      }

      let res: any = null;
      switch (activePlatform) {
        case "tiktok":
          res = await crawlTiktokModel.handleGetTiktokRecords(params);
          break;
        case "instagram":
          res = await crawlIgModel.handleGetIgRecords(params);
          break;
        case "threads":
          res = await crawlThreadsModel.handleGetThreadsRecords(params);
          break;
        default:
          res = await crawlFacebookModel.handleGetFacebookRecords(params);
          break;
      }

      if (res && res.data) {
        setRecords(res.data || []);
        setTotal(res.metadata?.total || res.data?.length || 0);
      } else {
        setRecords([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách bản ghi cào:", error);
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchRecords(1, pageSize);
  }, [activePlatform, reloadKey]);

  useEffect(() => {
    fetchRecords(page, pageSize);
  }, [page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    fetchRecords(1, pageSize);
  };

  const handleViewDetail = async (recordId: number) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      let res: any = null;
      switch (activePlatform) {
        case "tiktok":
          res = await crawlTiktokModel.handleGetTiktokRecordDetail(recordId);
          break;
        case "instagram":
          res = await crawlIgModel.handleGetIgRecordDetail(recordId);
          break;
        case "threads":
          res = await crawlThreadsModel.handleGetThreadsRecordDetail(recordId);
          break;
        default:
          res = await crawlFacebookModel.handleGetFacebookRecordDetail(recordId);
          break;
      }

      if (res && res.data) {
        setDetailRecord(res.data);
      } else {
        message.error("Không lấy được thông tin chi tiết bản ghi");
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết bản ghi:", error);
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

  const processedRecords = useMemo(() => {
    return (records || []).map((r) => ({
      ...r,
      _source_name: getSourceName(r),
      _post_content: getPostContent(r),
      _record_url: getRecordUrl(r),
      _status: r.error ? "error" : "success",
      _created_at_str: formatTime(r?.raw_data?.timestamp || r.created_at),
    }));
  }, [records]);

  const columns: IColumn<any>[] = useMemo(() => {
    const cols: IColumn<any>[] = [
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
        title: "Nội dung",
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
        filterData: scraperOptionsMap[activePlatform] || [],
        sortable: true,
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
        title: "Trạng thái",
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
    ];

    if (activePlatform === "tiktok") {
      cols.push({
        title: "Transcript",
        dataIndex: "has_script",
        key: "has_script",
        filterType: "select",
        filterData: [
          { label: "Đã có", value: "true" },
          { label: "Chưa có", value: "false" },
        ],
        sortable: true,
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
        dataIndex: "_created_at_str",
        key: "created_at",
        filterType: "string",
        sortable: true,
        width: 150,
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
        data={processedRecords}
        columns={columns}
        loading={loading}
        onReload={() => fetchRecords(page, pageSize)}
        hasTotal={true}
        addStt={true}
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

export default CrawlHistoryTable;
