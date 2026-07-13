import { EyeOutlined, HistoryOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Space, Tag, Tooltip } from "antd";
import React from "react";
import dayjs from "dayjs";
import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";

interface ISnapshotHistoryItem {
  id: string;
  type: string;
  time: number;
  urls_count: number;
}

interface HistoryTableProps {
  dataSource: ISnapshotHistoryItem[];
  onView: (id: string, type: string) => void;
  colorPrimary?: string;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ dataSource, onView, colorPrimary }) => {
  const columns: IColumn<ISnapshotHistoryItem>[] = [
    {
      title: "Thời gian cào",
      dataIndex: "time",
      key: "time",
      width: 160,
      render: (time: number) => dayjs(time * 1000).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Loại cào",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (type: string) => {
        let color = "blue";
        if (type.includes("posts")) {
          color = "magenta";
        }
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Số mục",
      dataIndex: "urls_count",
      key: "urls_count",
      align: "center",
      width: 80,
      render: (count: number) => <Badge count={count} color="#1890ff" />,
    },
    {
      title: "Xem",
      key: "action",
      align: "center",
      width: 80,
      render: (_, record) => (
        <Tooltip title="Xem dữ liệu cào được">
          <Button
            type="link"
            size="middle"
            icon={<EyeOutlined />}
            onClick={() => onView(record.id, record.type)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <HistoryOutlined style={{ color: colorPrimary }} />
          <span>Lịch sử yêu cầu cào (Snapshots)</span>
        </Space>
      }
      style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", minHeight: 480 }}
    >
      {dataSource.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#bfbfbf" }}>
          Chưa có yêu cầu thu thập nào được gửi.
        </div>
      ) : (
        <TableStaticData
          data={dataSource}
          columns={columns}
          size="small"
          otherProps={{
            rowKey: "id",
            pagination: { pageSize: 8 },
          }}
        />
      )}
    </Card>
  );
};

export default HistoryTable;
