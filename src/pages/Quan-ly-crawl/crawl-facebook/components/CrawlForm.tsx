import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, theme } from "antd";
import React, { useState } from "react";

const { TextArea } = Input;

interface CrawlFormProps {
  loading: boolean;
  onSubmit: (values: any) => Promise<boolean>;
}

export const CrawlForm: React.FC<CrawlFormProps> = ({ loading, onSubmit }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [scraperType, setScraperType] = useState<string>("page-posts");

  const getPlaceholder = () => {
    switch (scraperType) {
      case "page-posts":
        return "Ví dụ: https://www.facebook.com/LeBron/";
      case "group-posts":
        return "Ví dụ: https://www.facebook.com/groups/262681228448/";
      case "profiles":
        return "Ví dụ: https://www.facebook.com/tim.odonnell.50767";
      case "pages-profiles":
        return "Ví dụ: https://www.facebook.com/zuck/";
      case "reels":
        return "Ví dụ: https://www.facebook.com/MrBeast6000";
      default:
        return "";
    }
  };

  const scraperOptions = [
    { label: "Facebook Page Posts (Cào bài viết Fanpage)", value: "page-posts" },
    { label: "Facebook Group Posts (Cào bài viết Group)", value: "group-posts" },
    { label: "Facebook Profiles (Cào Profile cá nhân)", value: "profiles" },
    { label: "Facebook Pages & Profiles (Cào Page & Profile)", value: "pages-profiles" },
    { label: "Facebook Reels (Cào video Reels)", value: "reels" },
  ];

  const handleFinish = async (values: any) => {
    const success = await onSubmit({ ...values, scraper_type: scraperType });
    if (success) {
      form.setFieldValue("urls", "");
    }
  };

  return (
    <Card
      title={
        <Space>
          <PlayCircleOutlined style={{ color: token.colorPrimary }} />
          <span>Khởi chạy Task thu thập dữ liệu mới</span>
        </Space>
      }
      style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          num_of_posts: 10,
          scraper_type: "page-posts",
        }}
      >
        <Form.Item
          label="Loại thu thập Facebook (Bright Data Scraper Type)"
          name="scraper_type"
        >
          <Select
            onChange={(val) => {
              setScraperType(val);
              form.resetFields(["urls", "posts_to_not_include", "user_to_not_include"]);
            }}
            options={scraperOptions}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Đường dẫn URL mục tiêu"
          name="urls"
          rules={[{ required: true, message: "Vui lòng nhập URL cần cào!" }]}
        >
          <TextArea rows={2} placeholder={getPlaceholder()} size="large" />
        </Form.Item>

        {(scraperType === "page-posts" ||
          scraperType === "group-posts" ||
          scraperType === "reels") && (
            <Card
              title="Cấu hình nâng cao"
              size="small"
              style={{
                backgroundColor: "#fafafa",
                borderRadius: 8,
                marginBottom: 24,
                border: "1px solid #f0f0f0",
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Thời gian bắt đầu (start_date)" name="start_date">
                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Thời gian kết thúc (end_date)" name="end_date">
                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>
              </Row>

              {scraperType === "page-posts" && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Số lượng bài viết tối đa/URL" name="num_of_posts">
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="ID bài viết loại trừ (Cách nhau bằng dấu phẩy)"
                      name="posts_to_not_include"
                    >
                      <Input placeholder="ví dụ: 12345, 67890" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {scraperType === "group-posts" && (
                <Form.Item label="User cần loại trừ (user_to_not_include)" name="user_to_not_include">
                  <Input placeholder="Nhập tên người dùng hoặc ID cần bỏ qua" />
                </Form.Item>
              )}
            </Card>
          )}

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<PlayCircleOutlined />}
          size="large"
          block
          style={{ height: 48, borderRadius: 8, fontWeight: "bold" }}
        >
          {loading ? "Đang gửi yêu cầu cào..." : "Gửi yêu cầu thu thập dữ liệu"}
        </Button>
      </Form>
    </Card>
  );
};

export default CrawlForm;
