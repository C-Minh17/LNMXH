import {
  FacebookOutlined,
  TikTokOutlined,
  InstagramOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Badge, Card, Tag, theme, Typography } from "antd";
import dayjs from "@/utils/dayjs";
import React from "react";
import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";

const { Text } = Typography;

interface PerSourceTableProps {
  perSourceList: MCrawlSource.IDashboardPerSource[];
  loading: boolean;
  onReload: () => void;
}

export const PerSourceTable: React.FC<PerSourceTableProps> = ({
  perSourceList,
  loading,
  onReload,
}) => {
  const { token } = theme.useToken();

  const formatTime = (ts: number | undefined) => {
    if (!ts) return "-";
    const isMillis = ts > 9999999999;
    return dayjs(isMillis ? ts : ts * 1000).tz().format("DD-MM-YYYY HH:mm");
  };

  const getPlatformTag = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "facebook":
        return <Tag color="blue" icon={<FacebookOutlined />}>Facebook</Tag>;
      case "tiktok":
        return <Tag color="magenta" icon={<TikTokOutlined />}>TikTok</Tag>;
      case "instagram":
        return <Tag color="purple" icon={<InstagramOutlined />}>Instagram</Tag>;
      case "threads":
        return <Tag color="cyan" icon={<ThunderboltOutlined />}>Threads</Tag>;
      default:
        return <Tag color="default">{platform}</Tag>;
    }
  };

  const perSourceColumns: IColumn<any>[] = [
    {
      title: "Tên Nguồn Crawl",
      dataIndex: "name",
      key: "name",
      width: 220,
      filterType: "string",
      sortable: true,
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: "Nền Tảng",
      dataIndex: "platform",
      key: "platform",
      width: 140,
      filterType: "select",
      filterData: [
        { label: "Facebook", value: "facebook" },
        { label: "TikTok", value: "tiktok" },
        { label: "Instagram", value: "instagram" },
        { label: "Threads", value: "threads" },
      ],
      render: (p: string) => getPlatformTag(p),
    },
    {
      title: "Loại Scraper",
      dataIndex: "scraper_type",
      key: "scraper_type",
      width: 180,
      filterType: "string",
      render: (type: string) => <Tag color="geekblue">{type}</Tag>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 130,
      filterType: "select",
      filterData: [
        { label: "Hoạt động", value: "true" },
        { label: "Tạm dừng", value: "false" },
      ],
      render: (active: boolean) => (
        <Badge
          status={active ? "success" : "default"}
          text={active ? "Hoạt động" : "Tạm dừng"}
        />
      ),
    },
    {
      title: "Số Bản Ghi Crawl Được",
      dataIndex: "records_count",
      key: "records_count",
      width: 160,
      align: "right",
      sortable: true,
      render: (count: number) => (
        <Text strong style={{ color: token.colorPrimary }}>
          {Number(count || 0).toLocaleString("vi-VN")}
        </Text>
      ),
    },
    {
      title: "Lần Chạy Gần Nhất",
      dataIndex: "last_run_at",
      key: "last_run_at",
      width: 160,
      sortable: true,
      render: (ts: number) => formatTime(ts),
    },
    {
      title: "Lần Chạy Kế Tiếp",
      dataIndex: "next_run_at",
      key: "next_run_at",
      width: 160,
      sortable: true,
      render: (ts: number) => formatTime(ts),
    },
  ];

  return (
    <Card
      title="Thống Kê Chi Tiết Từng Nguồn Crawl (Per Source)"
      style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
    >
      <TableStaticData
        data={perSourceList}
        columns={perSourceColumns}
        loading={loading}
        onReload={onReload}
        hasTotal={true}
        addStt={true}
        otherProps={{
          rowKey: "id",
          scroll: { x: 1000 },
          pagination: { pageSize: 10 },
        }}
      />
    </Card>
  );
};

export default PerSourceTable;
