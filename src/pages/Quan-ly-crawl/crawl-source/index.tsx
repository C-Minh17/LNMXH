import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  Badge,
  Button,
  Card,
  Popconfirm,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "@/utils/dayjs";
import React, { useEffect, useState } from "react";
import FormCrawlSource from "./components/form";
import CrawlRecordsModal from "./components/recordsModal";
import { QuickCrawlModal } from "./components/quickCrawlModal";
import { CrawlHistoryTable } from "./components/crawlHistoryTable";

const { Title, Text } = Typography;

const formatTime = (ts: any, format = "HH:mm DD/MM/YYYY") => {
  if (!ts) return "-";
  if (typeof ts === "number") {
    const isMillis = ts > 9999999999;
    return dayjs(isMillis ? ts : ts * 1000).tz().format(format);
  }
  return dayjs(ts).tz().format(format);
};

const CrawlSourceManager: React.FC = () => {
  const { token } = theme.useToken();

  // Load state and handlers from Umi Model
  const {
    crawlSources,
    crawlSourcesLoading,
    refreshKey,
    handleGetCrawlSources,
    handleDeleteCrawlSource,
    handleRunCrawlSource,
    triggerReload
  } = useModel("crawl-source.crawl-source");

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [quickCrawlOpen, setQuickCrawlOpen] = useState<boolean>(false);
  const [methodForm, setMethodForm] = useState<"post" | "put">("post");
  const [currentRecord, setCurrentRecord] = useState<MCrawlSource.IRecord | undefined>(undefined);
  const [runningSources, setRunningSources] = useState<Record<number, boolean>>({});
  const [recordsModalOpen, setRecordsModalOpen] = useState<boolean>(false);
  const [selectedSourceForRecords, setSelectedSourceForRecords] = useState<MCrawlSource.IRecord | undefined>(undefined);

  // Fetch initial data
  useEffect(() => {
    handleGetCrawlSources();
  }, [refreshKey]);

  const handleCreateClick = () => {
    setMethodForm("post");
    setCurrentRecord(undefined);
    setOpenModal(true);
  };

  const handleEditClick = (record: MCrawlSource.IRecord) => {
    setMethodForm("put");
    setCurrentRecord(record);
    setOpenModal(true);
  };

  const columns: IColumn<MCrawlSource.IRecord>[] = [
    {
      title: "Tên nguồn",
      dataIndex: "name",
      filterType: "string",
      sortable: true,
      width: 220,
      render: (name, record) => (
        <Tooltip title={record.description || "Không có mô tả"}>
          <Text strong style={{ cursor: "pointer" }}>
            {name}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Nền tảng",
      dataIndex: "platform",
      filterType: "select",
      filterData: ["facebook", "tiktok"],
      sortable: true,
      align: "center",
      width: 140,
      render: (platform) => {
        const color =
          platform === "facebook"
            ? "blue"
            : platform === "tiktok"
              ? "magenta"
              : "orange";
        return (
          <Tag color={color} style={{ textTransform: "capitalize", fontWeight: "bold" }}>
            {platform}
          </Tag>
        );
      },
    },
    {
      title: "Bộ cào (Scraper Type)",
      dataIndex: "scraper_type",
      filterType: "string",
      sortable: true,
      width: 200,
    },
    {
      title: "Tần suất",
      dataIndex: "frequency_minutes",
      sortable: true,
      align: "center",
      width: 140,
      render: (freq) => `${freq} phút`,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      width: 160,
      render: (isActive) => (
        <Badge
          status={isActive ? "success" : "default"}
          text={isActive ? "Đang hoạt động" : "Tạm dừng"}
        />
      ),
    },
    {
      title: "Chạy lần cuối",
      dataIndex: "last_run_at",
      sortable: true,
      width: 180,
      render: (val) => formatTime(val),
    },
    {
      title: "Chạy tiếp theo",
      dataIndex: "next_run_at",
      sortable: true,
      width: 180,
      render: (val) => formatTime(val),
    },
    {
      title: "Thao tác",
      align: "center",
      width: 160,
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Tooltip title="Chạy crawl ngay lập tức">
            <Button
              onClick={async () => {
                setRunningSources((prev) => ({ ...prev, [record.id]: true }));
                try {
                  await handleRunCrawlSource(record.id);
                } finally {
                  setRunningSources((prev) => ({ ...prev, [record.id]: false }));
                }
              }}
              type="link"
              loading={!!runningSources[record.id]}
              icon={<PlayCircleOutlined style={{ color: "#52c41a", fontSize: "16px" }} />}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết kết quả cào">
            <Button
              onClick={() => {
                setSelectedSourceForRecords(record);
                setRecordsModalOpen(true);
              }}
              type="link"
              icon={<EyeOutlined style={{ color: "#1890ff", fontSize: "16px" }} />}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => handleEditClick(record)}
              type="link"
              icon={<EditOutlined style={{ fontSize: "16px" }} />}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={async () => {
                await handleDeleteCrawlSource(record.id);
              }}
              title="Bạn có chắc chắn muốn xóa cấu hình nguồn này?"
              okText="Xóa"
              cancelText="Hủy"
              placement="topLeft"
            >
              <Button
                danger
                type="link"
                icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <Title level={2} style={{ color: token.colorPrimary, marginBottom: 24 }}>
        Danh sách nguồn thu thập tin bài
      </Title>

      <Card
        title={<span style={{ fontSize: 18, fontWeight: "bold", color: token.colorPrimary }}>Danh sách nguồn thu thập bài viết</span>}
        style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginTop: 24 }}
      >
        <TableStaticData
          columns={columns}
          data={crawlSources || []}
          addStt={true}
          hasTotal={true}
          loading={crawlSourcesLoading}
          hasCreate={true}
          setShowEdit={handleCreateClick}
          onReload={triggerReload}
        // otherButtons={[
        //   <Button
        //     key="quick-crawl"
        //     onClick={() => setQuickCrawlOpen(true)}
        //     icon={<PlayCircleOutlined />}
        //     style={{
        //       borderRadius: 6,
        //       backgroundColor: token.colorSuccess,
        //       borderColor: token.colorSuccess,
        //       color: "#fff",
        //     }}
        //   >
        //     Crawl nhanh
        //   </Button>
        // ]}
        />
      </Card>

      <FormCrawlSource
        open={openModal}
        setOpen={setOpenModal}
        method={methodForm}
        initialValues={currentRecord}
      />

      <QuickCrawlModal
        open={quickCrawlOpen}
        setOpen={setQuickCrawlOpen}
      />

      <CrawlRecordsModal
        open={recordsModalOpen}
        onCancel={() => {
          setRecordsModalOpen(false);
          setSelectedSourceForRecords(undefined);
        }}
        source={selectedSourceForRecords}
      />

      <CrawlHistoryTable />
    </>
  );
};

export default CrawlSourceManager;
