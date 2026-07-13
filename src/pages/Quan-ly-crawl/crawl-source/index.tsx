import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  Badge,
  Button,
  Popconfirm,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import FormCrawlSource from "./components/form";

const { Title, Text } = Typography;

const CrawlSourceManager: React.FC = () => {
  const { token } = theme.useToken();

  // Load state and handlers from Umi Model
  const {
    crawlSources,
    crawlSourcesLoading,
    runCrawlSourceLoading,
    refreshKey,
    handleGetCrawlSources,
    handleDeleteCrawlSource,
    handleRunCrawlSource,
    triggerReload
  } = useModel("crawl-source.crawl-source");

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [methodForm, setMethodForm] = useState<"post" | "put">("post");
  const [currentRecord, setCurrentRecord] = useState<MCrawlSource.IRecord | undefined>(undefined);

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
      render: (val) => (val ? dayjs(val * 1000).format("HH:mm DD/MM/YYYY") : "-"),
    },
    {
      title: "Chạy tiếp theo",
      dataIndex: "next_run_at",
      sortable: true,
      width: 180,
      render: (val) => (val ? dayjs(val * 1000).format("HH:mm DD/MM/YYYY") : "-"),
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
                await handleRunCrawlSource(record.id);
              }}
              type="link"
              loading={runCrawlSourceLoading}
              icon={<PlayCircleOutlined style={{ color: "#52c41a", fontSize: "16px" }} />}
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
        Quản lý nguồn thu thập tin bài
      </Title>

      <TableStaticData
        columns={columns}
        data={crawlSources || []}
        addStt={true}
        hasTotal={true}
        loading={crawlSourcesLoading}
        hasCreate={true}
        setShowEdit={handleCreateClick}
        onReload={triggerReload}
      />

      <FormCrawlSource
        open={openModal}
        setOpen={setOpenModal}
        method={methodForm}
        initialValues={currentRecord}
      />
    </>
  );
};

export default CrawlSourceManager;
