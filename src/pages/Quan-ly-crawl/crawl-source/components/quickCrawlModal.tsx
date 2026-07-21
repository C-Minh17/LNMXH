import { PlayCircleOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  theme,
  Tooltip,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface QuickCrawlModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const targetFieldNames = ["url", "urls", "search_url", "search_keyword", "user_name", "profile_url", "URL"];

export const QuickCrawlModal: React.FC<QuickCrawlModalProps> = ({ open, setOpen }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  // Platform models
  const fbModel = useModel("crawl-facebook.crawl-facebook");
  const ttModel = useModel("crawl-tiktok.crawl-tiktok");
  const igModel = useModel("crawl-ig.crawl-ig");
  const thModel = useModel("crawl-threads.crawl-threads");

  // Crawl source types model
  const {
    crawlSourceTypes,
    crawlSourceTypesLoading,
    handleGetCrawlSourceTypes,
  } = useModel("crawl-source.crawl-source");

  const [selectedTypeKey, setSelectedTypeKey] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch source types dynamic configuration schema when modal opens
  useEffect(() => {
    if (open) {
      handleGetCrawlSourceTypes();
    }
  }, [open]);

  // Determine selected scraper type schema
  const matchedType = useMemo(() => {
    if (!selectedTypeKey) return null;
    const [platform, scraperType] = selectedTypeKey.split("::");
    return crawlSourceTypes.find(
      (t) => t.platform === platform && t.scraper_type === scraperType
    ) || null;
  }, [selectedTypeKey, crawlSourceTypes]);

  const fields = useMemo(() => matchedType?.fields || [], [matchedType]);

  // Find target input field (URL, keyword, etc.)
  const targetField = useMemo(() => {
    return fields.find((f) => targetFieldNames.includes(f.name)) || fields[0] || null;
  }, [fields]);

  const targetFieldName = targetField ? targetField.name : "url";
  const targetFieldLabel = targetField ? targetField.label : "Đường dẫn URL mục tiêu";

  // Configuration fields (excluding target field)
  const configFields = useMemo(() => {
    if (!targetField) return fields;
    return fields.filter((f) => f.name !== targetField.name);
  }, [fields, targetField]);

  // Reset form when modal state changes
  useEffect(() => {
    if (open) {
      setSelectedTypeKey("");
      form.resetFields();
    }
  }, [open, form]);

  const getPlaceholder = (platform: string, scraperType: string) => {
    const key = `${platform}::${scraperType}`.toLowerCase().replace(/_/g, "-");

    if (platform === "facebook") {
      if (key.includes("page-posts")) return "Ví dụ:\nhttps://www.facebook.com/LeBron/";
      if (key.includes("group-posts")) return "Ví dụ:\nhttps://www.facebook.com/groups/262681228448/";
      if (key.includes("profiles")) return "Ví dụ:\nhttps://www.facebook.com/tim.odonnell.50767";
      if (key.includes("pages-profiles")) return "Ví dụ:\nhttps://www.facebook.com/zuck/";
      if (key.includes("reels")) return "Ví dụ:\nhttps://www.facebook.com/MrBeast6000";
    }

    if (platform === "tiktok") {
      if (key.includes("profiles-discover")) return "Ví dụ:\nhttps://www.tiktok.com/search?lang=en&q=music";
      if (key.includes("profiles")) return "Ví dụ:\nhttps://www.tiktok.com/@fofimdme11";
      if (key.includes("posts-keyword")) return "Ví dụ:\n#artist\nmusic";
      if (key.includes("posts-profile")) return "Ví dụ:\nhttps://www.tiktok.com/@babyariel";
      if (key.includes("posts-discover")) return "Ví dụ:\nhttps://www.tiktok.com/discover/dog";
      if (key.includes("posts")) return "Ví dụ:\nhttps://www.tiktok.com/@mrbeast/video/7553327774983802143";
    }

    if (platform === "instagram") {
      if (key.includes("profiles-discover") || key.includes("user-name")) return "Ví dụ:\nzoobarcelona\nfcbarcelona";
      if (key.includes("profiles")) return "Ví dụ:\nhttps://www.instagram.com/cats_of_world_/";
      if (key.includes("posts")) return "Ví dụ:\nhttps://www.instagram.com/p/Cuf4sBMNqNr";
    }

    if (platform === "threads") {
      if (key.includes("posts-discover") || key.includes("discover-by-profile")) return "Ví dụ:\nhttps://www.threads.net/@elon_musk?hl=en";
      if (key.includes("profiles")) return "Ví dụ:\nhttps://www.threads.net/@abc7la";
      if (key.includes("posts")) return "Ví dụ:\nhttps://www.threads.net/@dividendology_yt/post/DML_enxRaOq?hl=en";
    }

    return "Nhập danh sách mục tiêu cần cào, mỗi dòng một URL/Từ khóa";
  };

  const submitCrawlTask = async (
    platform: string,
    scraperType: string,
    payload: any
  ) => {
    const key = scraperType.toLowerCase().replace(/_/g, "-");

    if (platform === "facebook") {
      if (key.includes("page-posts")) {
        return await fbModel.handleCrawlPagePosts(payload);
      } else if (key.includes("group-posts")) {
        return await fbModel.handleCrawlGroupPosts(payload);
      } else if (key.includes("pages-profiles")) {
        return await fbModel.handleCrawlPagesProfiles(payload);
      } else if (key.includes("profiles")) {
        return await fbModel.handleCrawlProfiles(payload);
      } else if (key.includes("reels")) {
        return await fbModel.handleCrawlReels(payload);
      }
    }

    if (platform === "tiktok") {
      if (key === "profiles") {
        return await ttModel.handleCrawlProfiles(payload);
      } else if (key.includes("profiles-discover") || key.includes("search-url")) {
        return await ttModel.handleDiscoverProfilesBySearchUrl(payload);
      } else if (key === "posts") {
        return await ttModel.handleCrawlPosts(payload);
      } else if (key.includes("keyword")) {
        return await ttModel.handleDiscoverPostsByKeyword(payload);
      } else if (key.includes("profile")) {
        return await ttModel.handleDiscoverPostsByProfileUrl(payload);
      } else if (key.includes("discover")) {
        return await ttModel.handleDiscoverPostsByUrl(payload);
      }
    }

    if (platform === "instagram") {
      if (key.includes("profiles-discover") || key.includes("user-name")) {
        return await igModel.handleDiscoverProfilesByUsername(payload);
      } else if (key.includes("profiles")) {
        return await igModel.handleCrawlProfiles(payload);
      } else if (key.includes("posts")) {
        return await igModel.handleCrawlPosts(payload);
      }
    }

    if (platform === "threads") {
      if (key.includes("profiles")) {
        return await thModel.handleCrawlProfiles(payload);
      } else if (key.includes("posts-discover") || key.includes("discover-by-profile")) {
        return await thModel.handleDiscoverPostsByProfile(payload);
      } else if (key.includes("posts")) {
        return await thModel.handleCrawlPosts(payload);
      }
    }

    throw new Error(`Nền tảng hoặc bộ cào không hỗ trợ chạy trực tiếp: ${platform} - ${scraperType}`);
  };

  const onFinish = async (values: any) => {
    if (!selectedTypeKey || !matchedType) return;
    const platform = selectedTypeKey.split("::")[0];

    const rawTargets = values.targets || "";
    const targetList = rawTargets
      .split("\n")
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    if (targetList.length === 0) {
      message.warning("Vui lòng nhập thông tin mục tiêu!");
      return;
    }

    setSubmitting(true);
    try {
      // Build input list
      const input = targetList.map((targetVal: string) => {
        const item: any = {};
        item[targetFieldName] = targetVal;

        configFields.forEach((field) => {
          const val = values[field.name];
          if (val === undefined || val === null) return;

          if (field.type === "date" || field.name.includes("date")) {
            if (platform === "facebook") {
              item[field.name] = dayjs(val).format("MM-DD-YYYY");
            } else {
              item[field.name] = dayjs(val).toISOString();
            }
          } else if (field.name === "posts_to_not_include" && typeof val === "string") {
            item[field.name] = val.split(",").map((s) => s.trim()).filter(Boolean);
          } else {
            item[field.name] = val;
          }
        });

        return item;
      });

      const payload = { input };
      const res = await submitCrawlTask(platform, matchedType.scraper_type, payload);

      if (res?.success) {
        setOpen(false);
        form.resetFields();
      }
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Lỗi khởi chạy crawl nhanh");
    } finally {
      setSubmitting(false);
    }
  };

  const isModelSubmitting =
    fbModel.crawlPagePostsLoading ||
    fbModel.crawlGroupPostsLoading ||
    fbModel.crawlProfilesLoading ||
    fbModel.crawlPagesProfilesLoading ||
    fbModel.crawlReelsLoading ||
    ttModel.crawlProfilesLoading ||
    ttModel.discoverProfilesBySearchUrlLoading ||
    ttModel.crawlPostsLoading ||
    ttModel.discoverPostsByKeywordLoading ||
    ttModel.discoverPostsByProfileUrlLoading ||
    ttModel.discoverPostsByUrlLoading ||
    igModel.crawlProfilesLoading ||
    igModel.discoverProfilesByUsernameLoading ||
    igModel.crawlPostsLoading ||
    thModel.crawlProfilesLoading ||
    thModel.crawlPostsLoading ||
    thModel.discoverPostsByProfileLoading ||
    submitting;

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
          Crawl dữ liệu nhanh (Direct Bright Data Scraper)
        </Title>
      }
      open={open}
      onCancel={() => {
        if (!isModelSubmitting) {
          setOpen(false);
          form.resetFields();
        }
      }}
      footer={null}
      width={650}
      destroyOnClose
      maskClosable={!isModelSubmitting}
      closable={!isModelSubmitting}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 20 }}
      >
        <Form.Item
          name="type"
          label="Nền tảng & Bộ cào (Scraper Type)"
          rules={[{ required: true, message: "Vui lòng chọn loại bộ cào!" }]}
        >
          <Select
            placeholder="Chọn nền tảng và bộ cào cần chạy"
            onChange={(value: string) => setSelectedTypeKey(value)}
            loading={crawlSourceTypesLoading}
            disabled={isModelSubmitting}
          >
            {crawlSourceTypes.map((item) => {
              const key = `${item.platform}::${item.scraper_type}`;
              return (
                <Select.Option key={key} value={key}>
                  <Text strong style={{ textTransform: "capitalize" }}>
                    {item.platform}
                  </Text>{" "}
                  - {item.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        {matchedType && (
          <>
            <Form.Item
              name="targets"
              label={`${targetFieldLabel} (Nhập danh sách, mỗi mục một dòng)`}
              rules={[{ required: true, message: `Vui lòng nhập ${targetFieldLabel}!` }]}
            >
              <TextArea
                rows={4}
                placeholder={getPlaceholder(matchedType.platform, matchedType.scraper_type)}
                disabled={isModelSubmitting}
              />
            </Form.Item>

            {configFields.length > 0 && (
              <Card
                title="Cấu hình nâng cao"
                size="small"
                style={{
                  marginTop: 20,
                  backgroundColor: "#fafafa",
                  borderRadius: 8,
                  border: "1px solid #f0f0f0",
                  maxHeight: 250,
                  overflowY: "auto",
                }}
              >
                {configFields.map((field) => {
                  let inputComponent = (
                    <Input placeholder={field.description || `Nhập ${field.label}`} disabled={isModelSubmitting} />
                  );
                  if (field.type === "number") {
                    inputComponent = (
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder={field.description || `Nhập ${field.label}`}
                        disabled={isModelSubmitting}
                      />
                    );
                  } else if (field.type === "boolean") {
                    inputComponent = (
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" disabled={isModelSubmitting} />
                    );
                  } else if (field.type === "date" || field.name.includes("date")) {
                    inputComponent = (
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder={field.description || `Chọn ${field.label}`}
                        disabled={isModelSubmitting}
                      />
                    );
                  }

                  return (
                    <Form.Item
                      key={field.name}
                      name={field.name}
                      label={
                        <span>
                          {field.label}{" "}
                          {field.description && (
                            <Tooltip title={field.description}>
                              <Text type="secondary" style={{ fontSize: 12, cursor: "help" }}>
                                (?)
                              </Text>
                            </Tooltip>
                          )}
                        </span>
                      }
                      valuePropName={field.type === "boolean" ? "checked" : "value"}
                      rules={[{ required: field.required, message: "Trường này là bắt buộc!" }]}
                    >
                      {inputComponent}
                    </Form.Item>
                  );
                })}
              </Card>
            )}
          </>
        )}

        <div style={{ textAlign: "end", marginTop: 24 }}>
          <Button
            onClick={() => {
              setOpen(false);
              form.resetFields();
            }}
            style={{ marginRight: 8, borderRadius: 6 }}
            disabled={isModelSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isModelSubmitting}
            icon={<PlayCircleOutlined />}
            style={{ borderRadius: 6 }}
          >
            {isModelSubmitting ? "Đang crawl..." : "Bắt đầu crawl nhanh"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
