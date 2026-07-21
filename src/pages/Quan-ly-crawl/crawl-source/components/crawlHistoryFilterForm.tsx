import { Form, Input, Select } from "antd";
import React from "react";

interface CrawlHistoryFilterFormProps {
  form: any;
  activePlatform: string;
  onSearch: () => void;
}

const scraperOptionsMap: Record<string, { label: string; value: string }[]> = {
  facebook: [
    { label: "page-posts (Fanpage)", value: "page-posts" },
    { label: "group-posts (Group)", value: "group-posts" },
    { label: "profiles (Cá nhân)", value: "profiles" },
    { label: "pages-profiles (Page & Profile)", value: "pages-profiles" },
    { label: "reels (Video Reels)", value: "reels" },
  ],
  tiktok: [
    { label: "profiles (Profiles)", value: "profiles" },
    { label: "profiles-discover (Discover Search)", value: "profiles-discover" },
    { label: "posts (Video)", value: "posts" },
    { label: "posts-keyword (Discover Keyword)", value: "posts-keyword" },
    { label: "posts-profile (Discover Profile)", value: "posts-profile" },
    { label: "posts-discover (Discover Page)", value: "posts-discover" },
  ],
  instagram: [
    { label: "profiles_by_url (Profiles)", value: "profiles_by_url" },
    { label: "profiles_discover_user_name (Discover Username)", value: "profiles_discover_user_name" },
    { label: "posts_by_url (Posts)", value: "posts_by_url" },
  ],
  threads: [
    { label: "profiles_by_url (Profiles)", value: "profiles_by_url" },
    { label: "posts_by_url (Posts)", value: "posts_by_url" },
    { label: "posts_discover_profile (Discover Profile)", value: "posts_discover_profile" },
  ],
};

export const CrawlHistoryFilterForm: React.FC<CrawlHistoryFilterFormProps> = ({
  form,
  activePlatform,
  onSearch,
}) => {
  return (
    <Form
      form={form}
      layout="inline"
      onValuesChange={onSearch}
      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
    >
      <Form.Item name="scraper_type" style={{ marginBottom: 0 }}>
        <Select placeholder="Bộ cào" style={{ width: 180 }} allowClear>
          {(scraperOptionsMap[activePlatform] || []).map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="snapshot_id" style={{ marginBottom: 0 }}>
        <Input placeholder="Snapshot ID" style={{ width: 150 }} allowClear />
      </Form.Item>
      <Form.Item name="only_errors" style={{ marginBottom: 0 }}>
        <Select placeholder="Trạng thái cào" style={{ width: 140 }} allowClear>
          <Select.Option value="all">Tất cả</Select.Option>
          <Select.Option value="success">Thành công</Select.Option>
          <Select.Option value="errors">Chỉ record lỗi</Select.Option>
        </Select>
      </Form.Item>
      {activePlatform === "tiktok" && (
        <Form.Item name="has_script" style={{ marginBottom: 0 }}>
          <Select placeholder="Transcript" style={{ width: 140 }} allowClear>
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="true">Đã có</Select.Option>
            <Select.Option value="false">Chưa có</Select.Option>
          </Select>
        </Form.Item>
      )}
    </Form>
  );
};
export default CrawlHistoryFilterForm;
