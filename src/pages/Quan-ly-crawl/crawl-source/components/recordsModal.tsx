import { EyeOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  Button,
  message,
  Modal,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "@/utils/dayjs";
import React, { useEffect, useMemo, useState } from "react";
import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { getSourceName, getPostContent, getRecordUrl } from "@/utils/crawlUtils";
import CrawlHistoryDetailModal from "./crawlHistoryDetailModal";

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

  const processedRecords = useMemo(() => {
    return (records || []).map((r) => ({
      ...r,
      _source_name: getSourceName(r) !== "-" ? getSourceName(r) : (source?.name || "-"),
      _post_content: getPostContent(r),
      _record_url: getRecordUrl(r),
      _status: r.error ? "error" : "success",
      _created_at_str: formatTime(r?.raw_data?.timestamp || r.created_at),
    }));
  }, [records, source]);

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
        title: "Record URL",
        dataIndex: "_record_url",
        key: "record_url",
        filterType: "string",
        sortable: true,
        width: 250,
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
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
        ),
      },
    ],
    []
  );

  return (
    <Modal
      title={
        <div style={{ fontSize: 18, fontWeight: "bold" }}>
          Lịch sử kết quả cào: {source?.name || `#${source?.id}`}
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={1000}
      destroyOnClose
    >
      <div style={{ minHeight: 400, padding: "10px 0" }}>
        <TableStaticData
          data={processedRecords}
          columns={columns}
          loading={loading}
          onReload={() => fetchRecords(page, pageSize)}
          hasTotal={true}
          addStt={true}
          otherProps={{
            rowKey: "id",
            scroll: { x: 900 },
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
      </div>

      <CrawlHistoryDetailModal
        open={detailOpen}
        record={detailRecord}
        loading={false}
        onCancel={() => {
          setDetailOpen(false);
          setDetailRecord(null);
        }}
        activePlatform={source?.platform || "facebook"}
        colorPrimary="#1890ff"
      />
    </Modal>
  );
};

export default CrawlRecordsModal;
