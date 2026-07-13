import { CloudDownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, Tabs, Tag, Typography } from "antd";
import dayjs from "dayjs";
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
    const isProfile = snapshotType === "profiles" || snapshotType === "profiles-discover";

    if (isProfile) {
      return [
        {
          title: "Tên hiển thị",
          key: "nickname",
          width: 150,
          render: (record: any) => <Text strong>{record.nickname || record.name || "-"}</Text>,
        },
        {
          title: "Username",
          key: "username",
          width: 120,
          render: (record: any) => {
            const uname =
              record.account_id ||
              record.profile_username ||
              record.unique_id ||
              record.username ||
              record.uniqueId ||
              record.id;
            return uname ? `@${uname}` : "-";
          },
        },
        {
          title: "Người theo dõi",
          key: "followers",
          width: 120,
          render: (record: any) => {
            const val = record.follower_count || record.followers || record.followerCount;
            return typeof val === "number" ? val.toLocaleString() : (val || "-");
          },
        },
        {
          title: "Lượt thích",
          key: "likes",
          width: 120,
          render: (record: any) => {
            const val = record.heart_count || record.likes || record.heartCount || record.like_count;
            return typeof val === "number" ? val.toLocaleString() : (val || "-");
          },
        },
        {
          title: "Số video",
          key: "video_count",
          width: 100,
          render: (record: any) => {
            const val = record.videos_count || record.video_count || record.videoCount;
            return typeof val === "number" ? val.toLocaleString() : (val || "-");
          },
        },
        {
          title: "Tiểu sử (Bio)",
          key: "bio",
          width: 200,
          render: (record: any) =>
            record.biography || record.signature || record.bio || record.description || "-",
          ellipsis: true,
        },
        {
          title: "Link",
          key: "url",
          width: 120,
          render: (record: any) => {
            const val = record.url || record.profile_url;
            return val ? (
              <Link href={val} target="_blank">
                Xem TikTok
              </Link>
            ) : "-";
          },
        },
      ];
    }

    return [
      {
        title: "Tác giả",
        key: "author",
        width: 150,
        render: (record: any) => {
          const auth =
            record.profile_username ||
            record.account_id ||
            record.author ||
            record.nickname ||
            record.username ||
            record.unique_id;
          return <Text strong>{auth || "-"}</Text>;
        },
      },
      {
        title: "Nội dung bài viết",
        key: "description",
        width: 250,
        ellipsis: { showTitle: true },
        render: (record: any) => record.desc || record.text || record.description || "Video không có mô tả",
      },
      {
        title: "Lượt xem",
        key: "views",
        width: 100,
        render: (record: any) => {
          const val = record.play_count || record.views || record.playCount;
          return typeof val === "number" ? val.toLocaleString() : (val || "-");
        },
      },
      {
        title: "Thích",
        key: "likes",
        width: 100,
        render: (record: any) => {
          const val = record.digg_count || record.likes || record.diggCount;
          return typeof val === "number" ? val.toLocaleString() : (val || "-");
        },
      },
      {
        title: "Bình luận",
        key: "comments",
        width: 100,
        render: (record: any) => {
          const val = record.comment_count || record.comments || record.commentCount;
          return typeof val === "number" ? val.toLocaleString() : (val || "-");
        },
      },
      {
        title: "Chia sẻ",
        key: "shares",
        width: 100,
        render: (record: any) => {
          const val = record.share_count || record.shares || record.shareCount;
          return typeof val === "number" ? val.toLocaleString() : (val || "-");
        },
      },
      {
        title: "Ngày đăng",
        key: "date",
        width: 160,
        render: (record: any) => {
          const val = record.create_time || record.date || record.createTime;
          if (val) {
            let parsed = dayjs(val);
            if (!parsed.isValid() && typeof val === "number") {
              const ts = val > 9999999999 ? val : val * 1000;
              parsed = dayjs(ts);
            }
            if (parsed.isValid()) {
              return parsed.format("DD-MM-YYYY HH:mm");
            }
          }
          return val || "-";
        },
      },
      {
        title: "Link video",
        key: "url",
        width: 140,
        fixed: "right",
        render: (record: any) => {
          const val = record.url || record.video_url;
          return val ? (
            <Link href={val} target="_blank">
              Xem video
            </Link>
          ) : "-";
        },
      },
    ];
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "95%" }}>
          <Title level={4} style={{ margin: 0, color: colorPrimary }}>
            Kết quả thu thập TikTok: <Text code>{snapshotId}</Text>
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
      width={980}
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
            Chưa có dữ liệu trả về từ cào (Có thể cào đang chạy hoặc dữ liệu cào chưa sẵn sàng).
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
