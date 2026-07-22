import { CopyOutlined, CheckCircleFilled } from "@ant-design/icons";
import { Button, Card, Descriptions, Modal, Space, Spin, Table, Tag, Typography, message } from "antd";
import dayjs from "@/utils/dayjs";
import React from "react";
import { getSourceName, getPostContent, getRecordUrl } from "@/utils/crawlUtils";

const { Text, Link, Paragraph } = Typography;

interface CrawlHistoryDetailModalProps {
  open: boolean;
  record: any;
  loading: boolean;
  onCancel: () => void;
  activePlatform: string;
  colorPrimary: string;
}

export const CrawlHistoryDetailModal: React.FC<CrawlHistoryDetailModalProps> = ({
  open,
  record,
  loading,
  onCancel,
  activePlatform,
  colorPrimary,
}) => {
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

  const sourceName = getSourceName(record);
  const postContent = getPostContent(record);
  const recordUrl = getRecordUrl(record);
  const rawData = record?.raw_data;

  const followersCount = rawData?.number_of_followers ?? rawData?.profiles_followers ?? rawData?.followers;
  const likesCount = rawData?.number_of_likes ?? rawData?.likes;
  const commentsCount = rawData?.number_of_comments ?? rawData?.comments_amount;
  const resharesCount = rawData?.number_of_reshares ?? rawData?.reshare_amount;
  const sharesCount = rawData?.number_of_shares ?? rawData?.share_amount;
  const bio = rawData?.about_formatted ?? rawData?.biography;
  const isVerified = rawData?.verified || rawData?.is_verified;

  return (
    <Modal
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "95%" }}>
          <span style={{ fontSize: 18, fontWeight: "bold", color: colorPrimary }}>
            Chi tiết Record: #{record?.id}
          </span>
          {record?.scraper_type && (
            <Tag color="purple" style={{ textTransform: "uppercase" }}>
              {record?.scraper_type}
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={920}
      destroyOnClose
    >
      <div style={{ minHeight: 250, padding: "10px 0" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 10 }}>Đang tải chi tiết bản ghi...</div>
          </div>
        ) : record ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tên nguồn">
                <Space size="small">
                  <Text strong>{sourceName}</Text>
                  {isVerified && (
                    <Tag color="processing" icon={<CheckCircleFilled style={{ color: "#1890ff" }} />}>
                      Đã xác minh
                    </Tag>
                  )}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian cào">{formatTime(rawData?.post_time || rawData?.timestamp || record.created_at)}</Descriptions.Item>
              <Descriptions.Item label="Nền tảng">
                <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>
                  {activePlatform}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Loại Scraper">{record.scraper_type}</Descriptions.Item>

              {followersCount !== undefined && (
                <Descriptions.Item label="Số người theo dõi (Followers)">
                  {Number(followersCount).toLocaleString("vi-VN")}
                </Descriptions.Item>
              )}
              {rawData?.following !== undefined && (
                <Descriptions.Item label="Đang theo dõi (Following)">
                  {Number(rawData.following).toLocaleString("vi-VN")}
                </Descriptions.Item>
              )}
              {rawData?.posts_count !== undefined && (
                <Descriptions.Item label="Tổng số bài viết">{rawData.posts_count}</Descriptions.Item>
              )}
              {likesCount !== undefined && (
                <Descriptions.Item label="Lượt thích">{Number(likesCount).toLocaleString("vi-VN")}</Descriptions.Item>
              )}
              {commentsCount !== undefined && (
                <Descriptions.Item label="Bình luận">{Number(commentsCount).toLocaleString("vi-VN")}</Descriptions.Item>
              )}
              {resharesCount !== undefined && (
                <Descriptions.Item label="Lượt Reshare">{Number(resharesCount).toLocaleString("vi-VN")}</Descriptions.Item>
              )}
              {sharesCount !== undefined && (
                <Descriptions.Item label="Lượt Chia sẻ">{Number(sharesCount).toLocaleString("vi-VN")}</Descriptions.Item>
              )}
              {rawData?.views !== undefined && (
                <Descriptions.Item label="Lượt xem (Views)">{Number(rawData.views).toLocaleString("vi-VN")}</Descriptions.Item>
              )}
              {rawData?.website && (
                <Descriptions.Item label="Website">
                  <Link href={rawData.website} target="_blank" rel="noopener noreferrer">
                    {rawData.website}
                  </Link>
                </Descriptions.Item>
              )}
              {bio && (
                <Descriptions.Item label="Tiểu sử / Giới thiệu" span={2}>
                  {bio}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Nội dung bài / Preview" span={2}>
                {postContent}
              </Descriptions.Item>
              <Descriptions.Item label="Record URL" span={2}>
                {recordUrl && recordUrl !== "-" ? (
                  <Link href={recordUrl} target="_blank" rel="noopener noreferrer">
                    {recordUrl}
                  </Link>
                ) : (
                  "-"
                )}
              </Descriptions.Item>
              {record.error && (
                <Descriptions.Item label="Lỗi cào" span={2}>
                  <Text type="danger">{record.error}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Render List of Posts if raw_data.posts exists (Instagram/TikTok) */}
            {Array.isArray(rawData?.posts) && rawData.posts.length > 0 && (
              <Card
                title={`Danh sách bài viết đã thu thập (${rawData.posts.length} bài)`}
                size="small"
                type="inner"
                style={{ borderRadius: 8 }}
              >
                <Table
                  dataSource={rawData.posts}
                  rowKey={(p: any, idx?: number) => (p && typeof p === "object" ? p?.id : undefined) || String(idx ?? 0)}
                  pagination={{ pageSize: 5 }}
                  size="small"
                  columns={[
                    {
                      title: "Loại",
                      dataIndex: "content_type",
                      key: "content_type",
                      width: 85,
                      align: "center",
                      render: (type: string) => {
                        if (!type) return "-";
                        let color = "blue";
                        if (type === "Video") color = "purple";
                        if (type === "Carousel") color = "orange";
                        return <Tag color={color}>{type}</Tag>;
                      },
                    },
                    {
                      title: "Nội dung / Caption",
                      dataIndex: "caption",
                      key: "caption",
                      ellipsis: true,
                      render: (text: string) => text || "-",
                    },
                    {
                      title: "Thích",
                      dataIndex: "likes",
                      key: "likes",
                      width: 90,
                      align: "center",
                      render: (val: any) =>
                        typeof val === "number" ? val.toLocaleString("vi-VN") : val ?? "-",
                    },
                    {
                      title: "Bình luận",
                      dataIndex: "comments",
                      key: "comments",
                      width: 90,
                      align: "center",
                      render: (val: any) =>
                        typeof val === "number" ? val.toLocaleString("vi-VN") : val ?? "-",
                    },
                    {
                      title: "Ngày đăng",
                      dataIndex: "datetime",
                      key: "datetime",
                      width: 135,
                      render: (val: string) => formatTime(val),
                    },
                    {
                      title: "Thao tác",
                      dataIndex: "url",
                      key: "url",
                      width: 85,
                      align: "center",
                      render: (url: string, p: any) => (
                        <Space direction="vertical" size={2}>
                          {url && (
                            <Link href={url} target="_blank" rel="noopener noreferrer">
                              Xem bài
                            </Link>
                          )}
                          {p?.video_url && (
                            <Link href={p.video_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#722ed1" }}>
                              Xem Video
                            </Link>
                          )}
                          {!url && !p?.video_url && "-"}
                        </Space>
                      ),
                    },
                  ]}
                />
              </Card>
            )}

            {/* Render Threads List if raw_data.threads exists (Threads Profile) */}
            {Array.isArray(rawData?.threads) && rawData.threads.length > 0 && (
              <Card
                title={`Danh sách bài viết Threads (${rawData.threads.length} bài)`}
                size="small"
                type="inner"
                style={{ borderRadius: 8 }}
              >
                <Table
                  dataSource={rawData.threads}
                  rowKey={(t: any, idx?: number) => String(idx ?? 0)}
                  pagination={{ pageSize: 5 }}
                  size="small"
                  columns={[
                    {
                      title: "Nội dung Thread",
                      dataIndex: "post_content_formatted",
                      key: "post_content_formatted",
                      ellipsis: true,
                      render: (text: string, t: any) => text || t.post_content || "-",
                    },
                    {
                      title: "Thích",
                      dataIndex: "likes",
                      key: "likes",
                      width: 85,
                      align: "center",
                      render: (val: any) => typeof val === "number" ? val.toLocaleString("vi-VN") : val ?? "-",
                    },
                    {
                      title: "Bình luận",
                      dataIndex: "comments_amount",
                      key: "comments_amount",
                      width: 90,
                      align: "center",
                      render: (val: any) => typeof val === "number" ? val.toLocaleString("vi-VN") : val ?? "-",
                    },
                    {
                      title: "Reshare",
                      dataIndex: "reshare_amount",
                      key: "reshare_amount",
                      width: 85,
                      align: "center",
                      render: (val: any) => typeof val === "number" ? val.toLocaleString("vi-VN") : val ?? "-",
                    },
                    {
                      title: "Ngày đăng",
                      dataIndex: "post_date",
                      key: "post_date",
                      width: 135,
                      render: (val: string) => formatTime(val),
                    },
                  ]}
                />
              </Card>
            )}

            {/* Render Comments List if raw_data.comments exists (Threads Post Comments) */}
            {Array.isArray(rawData?.comments) && rawData.comments.length > 0 && (
              <Card
                title={`Danh sách bình luận (${rawData.comments.length} bình luận)`}
                size="small"
                type="inner"
                style={{ borderRadius: 8 }}
              >
                <Table
                  dataSource={rawData.comments}
                  rowKey={(c: any, idx?: number) => String(idx ?? 0)}
                  pagination={{ pageSize: 5 }}
                  size="small"
                  columns={[
                    {
                      title: "Người bình luận",
                      dataIndex: "commentor_profile_name",
                      key: "commentor_profile_name",
                      width: 200,
                      ellipsis: true,
                      render: (name: string, c: any) => {
                        const displayName = name || c.commentor_profile_url || "-";
                        return c.commentor_profile_url ? (
                          <Link href={c.commentor_profile_url} target="_blank" rel="noopener noreferrer">
                            {displayName}
                          </Link>
                        ) : (
                          displayName
                        );
                      },
                    },
                    {
                      title: "Nội dung bình luận",
                      dataIndex: "comment_content",
                      key: "comment_content",
                      ellipsis: true,
                      render: (text: string) => text || "-",
                    },
                    {
                      title: "Thích",
                      dataIndex: "number_of_likes",
                      key: "number_of_likes",
                      width: 80,
                      align: "center",
                      render: (val: any) => typeof val === "number" ? val.toLocaleString("vi-VN") : val ?? "-",
                    },
                    {
                      title: "Trả lời",
                      dataIndex: "number_of_replies",
                      key: "number_of_replies",
                      width: 80,
                      align: "center",
                      render: (val: any) => typeof val === "number" ? val.toLocaleString("vi-VN") : val ?? "-",
                    },
                  ]}
                />
              </Card>
            )}

            {record.script && (
              <Card
                title="Nội dung Transcript (Video Script)"
                size="small"
                type="inner"
                style={{ borderRadius: 8 }}
              >
                <Paragraph style={{ maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                  {record.script}
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
                  onClick={() => copyToClipboard(JSON.stringify(record.raw_data, null, 2))}
                >
                  Sao chép JSON
                </Button>
              }
            >
              <div style={{ maxHeight: 350, overflowY: "auto", backgroundColor: "#f5f5f5", padding: 10, borderRadius: 6 }}>
                <pre style={{ margin: 0, fontSize: 12 }}>
                  {JSON.stringify(record.raw_data, null, 2)}
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
  );
};
export default CrawlHistoryDetailModal;
