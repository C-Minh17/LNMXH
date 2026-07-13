import { CloudDownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, Tabs, Tag, Typography } from "antd";
import React from "react";
import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";

const { Title, Text, Link } = Typography;

interface DetailModalProps {
  open: boolean;
  loading: boolean;
  snapshotId: string;
  snapshotType: string;
  data: any[];
  onCancel: () => void;
  onRefresh: () => void;
  colorPrimary?: string;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  open,
  loading,
  snapshotId,
  snapshotType,
  data,
  onCancel,
  onRefresh,
  colorPrimary,
}) => {
  const getSnapshotDetailColumns = (): IColumn<any>[] => {
    if (snapshotType === "profiles" || snapshotType === "pages-profiles") {
      return [
        {
          title: "Tên hiển thị",
          dataIndex: "name",
          key: "name",
          width: 150,
          render: (val: string) => <Text strong>{val || "-"}</Text>,
        },
        {
          title: "Username",
          dataIndex: "username",
          key: "username",
          width: 120,
          render: (val: string) => (val ? `@${val}` : "-"),
        },
        {
          title: "Người theo dõi",
          dataIndex: "followers",
          key: "followers",
          width: 120,
          render: (val: any) => val?.toLocaleString() || "-",
        },
        {
          title: "Lượt thích",
          dataIndex: "likes",
          key: "likes",
          width: 120,
          render: (val: any) => val?.toLocaleString() || "-",
        },
        {
          title: "Tiểu sử (Bio)",
          dataIndex: "bio",
          key: "bio",
          width: 220,
          ellipsis: true,
        },
        {
          title: "Link",
          dataIndex: "url",
          key: "url",
          width: 120,
          render: (val: string) =>
            val ? (
              <Link href={val} target="_blank">
                Xem Facebook
              </Link>
            ) : (
              "-"
            ),
        },
      ];
    }

    if (snapshotType === "reels") {
      return [
        {
          title: "Link Video",
          dataIndex: "url",
          key: "url",
          width: 180,
          render: (val: string) =>
            val ? (
              <Link href={val} target="_blank" copyable>
                {val}
              </Link>
            ) : (
              "-"
            ),
        },
        {
          title: "Lượt xem",
          dataIndex: "views",
          key: "views",
          width: 120,
          render: (val: any) => val?.toLocaleString() || "-",
        },
        {
          title: "Lượt thích",
          dataIndex: "likes",
          key: "likes",
          width: 120,
          render: (val: any) => val?.toLocaleString() || "-",
        },
        {
          title: "Bình luận",
          dataIndex: "comments",
          key: "comments",
          width: 120,
          render: (val: any) => val?.toLocaleString() || "-",
        },
        {
          title: "Ngày đăng",
          dataIndex: "date",
          key: "date",
          width: 150,
        },
      ];
    }

    return [
      {
        title: "Tác giả",
        dataIndex: "author",
        key: "author",
        width: 150,
        render: (val: string) => <Text strong>{val || "-"}</Text>,
      },
      {
        title: "Nội dung bài viết",
        dataIndex: "text",
        key: "text",
        width: 250,
        ellipsis: { showTitle: true },
        render: (val: string) => val || "Bài viết không có text",
      },
      {
        title: "Thích",
        dataIndex: "likes",
        key: "likes",
        width: 100,
        render: (val: any) => val?.toLocaleString() || "-",
      },
      {
        title: "Bình luận",
        dataIndex: "comments",
        key: "comments",
        width: 100,
        render: (val: any) => val?.toLocaleString() || "-",
      },
      {
        title: "Chia sẻ",
        dataIndex: "shares",
        key: "shares",
        width: 100,
        render: (val: any) => val?.toLocaleString() || "-",
      },
      {
        title: "Ngày đăng",
        dataIndex: "date",
        key: "date",
        width: 160,
      },
      {
        title: "Link bài viết",
        dataIndex: "url",
        key: "url",
        fixed: "right",
        width: 140,
        render: (val: string) =>
          val ? (
            <Link href={val} target="_blank">
              Xem bài viết
            </Link>
          ) : (
            "-"
          ),
      },
    ];
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "95%" }}>
          <Title level={4} style={{ margin: 0, color: colorPrimary }}>
            Kết quả thu thập: <Text code>{snapshotId}</Text>
          </Title>
          <Tag color="purple" style={{ textTransform: "uppercase", fontSize: "12px", padding: "2px 8px" }}>
            {snapshotType}
          </Tag>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel} size="large">
          Đóng
        </Button>,
        // <Button
        //   key="refresh"
        //   type="primary"
        //   icon={<CloudDownloadOutlined />}
        //   loading={loading}
        //   onClick={onRefresh}
        //   size="large"
        // >
        //   Tải lại kết quả
        // </Button>,
      ]}
      width={950}
      destroyOnClose
    >
      <div style={{ minHeight: 350, marginTop: 15 }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: 300 }}>
            <Spin size="large" />
            <Text style={{ marginTop: 15 }} type="secondary">
              Đang kết nối tải kết quả cào từ Bright Data...
            </Text>
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#bfbfbf" }}>
            Chưa có dữ liệu trả về từ cào (Có thể cào đang chạy hoặc link cào sai).
            <br />
            Vui lòng thử nhấp vào **Tải lại kết quả** sau vài phút.
          </div>
        ) : (
          <Tabs defaultActiveKey="table">
            <Tabs.TabPane tab="Bảng kết quả" key="table">
              <TableStaticData
                data={data}
                columns={getSnapshotDetailColumns()}
                size="middle"
                otherProps={{
                  rowKey: (r: any, idx: number) => r.id || r.url || String(idx),
                  pagination: { pageSize: 5 },
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Dữ liệu JSON thô" key="json">
              <div style={{ maxHeight: 400, overflow: "auto", borderRadius: 8, border: "1px solid #f0f0f0" }}>
                <pre style={{ margin: 0, padding: 15, backgroundColor: "#fafafa", fontSize: 13 }}>
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </Tabs.TabPane>
          </Tabs>
        )}
      </div>
    </Modal>
  );
};

export default DetailModal;
