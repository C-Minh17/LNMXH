import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from "antd";
import React, { useState } from "react";

const { TextArea } = Input;

interface CrawlFormProps {
  loading: boolean;
  onSubmit: (values: any) => Promise<boolean>;
}

export const CrawlForm: React.FC<CrawlFormProps> = ({ loading, onSubmit }) => {
  const [form] = Form.useForm();
  const [scraperType, setScraperType] = useState<string>("profiles");

  const getPlaceholder = () => {
    switch (scraperType) {
      case "profiles":
        return `Ví dụ: https://www.tiktok.com/@fofimdme11`;
      case "profiles-discover":
        return `Ví dụ: https://www.tiktok.com/search?lang=en&q=music`;
      case "posts":
        return `Ví dụ: https://www.tiktok.com/@mrbeast/video/7553327774983802143`;
      case "posts-keyword":
        return `Ví dụ: #artist hoặc music`;
      case "posts-profile":
        return `Ví dụ: https://www.tiktok.com/@babyariel`;
      case "posts-discover":
        return `Ví dụ: https://www.tiktok.com/discover/dog`;
      default:
        return "";
    }
  };

  const scraperOptions = [
    { label: "Crawl profile theo URL (TikTok Profiles by URL)", value: "profiles" },
    { label: "Discover profile theo search URL", value: "profiles-discover" },
    { label: "Crawl video theo URL (TikTok Posts by URL)", value: "posts" },
    { label: "Discover video theo Keyword / Hashtag", value: "posts-keyword" },
    { label: "Discover video theo Profile URL", value: "posts-profile" },
    { label: "Discover video theo trang Discover", value: "posts-discover" },
  ];

  const handleFinish = async (values: any) => {
    const success = await onSubmit({ ...values, scraper_type: scraperType });
    if (success) {
      form.setFieldValue("urls", "");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        num_of_posts: 14,
        what_to_collect: "Posts & Reposts",
        with_script: false,
      }}
    >
      <Form.Item
        label="Loại thu thập TikTok (Bright Data Scraper Type)"
        name="scraper_type"
        initialValue="profiles"
      >
        <Select
          onChange={(val) => {
            setScraperType(val);
            form.resetFields(["urls", "country"]);
          }}
          options={scraperOptions}
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={
          scraperType === "posts-keyword"
            ? "Từ khóa / Hashtag mục tiêu"
            : "Đường dẫn URL mục tiêu"
        }
        name="urls"
        rules={[{ required: true, message: "Vui lòng nhập thông tin cần cào!" }]}
      >
        <TextArea rows={2} placeholder={getPlaceholder()} size="large" />
      </Form.Item>

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
        {(scraperType === "profiles" ||
          scraperType === "profiles-discover" ||
          scraperType === "posts" ||
          scraperType === "posts-keyword") && (
          <Form.Item
            label="Mã quốc gia (Ví dụ: US, VN - tùy chọn)"
            name="country"
          >
            <Input placeholder="Mặc định để trống" />
          </Form.Item>
        )}

        {(scraperType === "posts" ||
          scraperType === "posts-keyword" ||
          scraperType === "posts-profile" ||
          scraperType === "posts-discover") && (
          <Form.Item name="with_script" valuePropName="checked">
            <Checkbox>Lấy transcript / phụ đề (with_script)</Checkbox>
          </Form.Item>
        )}

        {scraperType === "posts-profile" && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Số lượng video tối đa" name="num_of_posts">
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loại video cần thu thập" name="what_to_collect">
                <Select
                  options={[
                    { label: "Posts & Reposts", value: "Posts & Reposts" },
                    { label: "Posts", value: "Posts" },
                    { label: "Reposts", value: "Reposts" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Card>

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
  );
};
export default CrawlForm;
