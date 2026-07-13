import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  theme,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";

const { Title, Text } = Typography;

interface FormCrawlSourceProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  method: "post" | "put";
  initialValues?: MCrawlSource.IRecord;
}

const FormCrawlSource: React.FC<FormCrawlSourceProps> = ({
  open,
  setOpen,
  method,
  initialValues,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const {
    crawlSourceTypes,
    crawlSourceTypesLoading,
    loadingCrawlSource,
    handleCreateCrawlSource,
    handleUpdateCrawlSource,
    handleGetCrawlSourceTypes,
  } = useModel("crawl-source.crawl-source");

  const [selectedTypeKey, setSelectedTypeKey] = useState<string>("");

  // Determine active dynamic configuration fields based on selected platform + scraper type
  const activeFields = useMemo(() => {
    if (!selectedTypeKey) return [];
    const [platform, scraperType] = selectedTypeKey.split("::");
    const matched = crawlSourceTypes.find(
      (t) => t.platform === platform && t.scraper_type === scraperType
    );
    return matched?.fields || [];
  }, [selectedTypeKey, crawlSourceTypes]);

  // Fetch source types dynamic configuration schema when the modal opens
  useEffect(() => {
    if (open) {
      handleGetCrawlSourceTypes();
    }
  }, [open]);

  // Set initial fields values when modal opens or initial values change
  useEffect(() => {
    if (open) {
      if (method === "put" && initialValues) {
        const typeKey = `${initialValues.platform}::${initialValues.scraper_type}`;
        setSelectedTypeKey(typeKey);
        form.setFieldsValue({
          name: initialValues.name,
          description: initialValues.description,
          frequency_minutes: initialValues.frequency_minutes,
          limit_per_input: initialValues.limit_per_input,
          is_active: initialValues.is_active,
          type: typeKey,
          config: initialValues.config,
        });
      } else {
        setSelectedTypeKey("");
        form.resetFields();
        form.setFieldsValue({
          is_active: true,
          frequency_minutes: 720,
          limit_per_input: 0,
        });
      }
    }
  }, [open, initialValues, method, form]);
  const onFinish = async (values: any) => {
    const { name, description, frequency_minutes, limit_per_input, is_active, type, config } = values;
    const [platform, scraper_type] = type.split("::");

    const payload: MCrawlSource.ICreateSource = {
      name,
      description,
      frequency_minutes,
      limit_per_input: limit_per_input !== undefined ? limit_per_input : 0,
      is_active,
      config: config || {},
      platform,
      scraper_type,
    };

    let success = false;
    if (method === "post") {
      const res = await handleCreateCrawlSource(payload);
      if (res) success = true;
    } else if (method === "put" && initialValues) {
      const res = await handleUpdateCrawlSource(initialValues.id, payload);
      if (res) success = true;
    }

    if (success) {
      setOpen(false);
      form.resetFields();
    }
  };

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
          {method === "post" ? "Thêm cấu hình nguồn mới" : "Chỉnh sửa cấu hình nguồn"}
        </Title>
      }
      open={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      footer={null}
      width={650}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 20 }}
      >
        <Form.Item
          name="name"
          label="Tên nguồn thu thập"
          rules={[{ required: true, message: "Vui lòng nhập tên nguồn thu thập!" }]}
        >
          <Input placeholder="Ví dụ: Fanpage VTV24" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea placeholder="Mô tả chi tiết về nguồn dữ liệu..." rows={2} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="frequency_minutes"
              label="Tần suất cào (phút)"
              rules={[{ required: true, message: "Vui lòng nhập tần suất cào!" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} placeholder="Ví dụ: 720" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="limit_per_input"
              label="Giới hạn đầu vào"
              rules={[{ required: true, message: "Vui lòng nhập giới hạn đầu vào!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="Ví dụ: 50" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="is_active"
              label="Trạng thái hoạt động"
              valuePropName="checked"
            >
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="type"
          label="Loại nguồn & Bộ cào (Scraper Type)"
          rules={[{ required: true, message: "Vui lòng chọn loại nguồn cào!" }]}
        >
          <Select
            placeholder="Chọn nền tảng và bộ cào phù hợp"
            onChange={(value: string) => setSelectedTypeKey(value)}
            loading={crawlSourceTypesLoading}
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

        {/* Dynamic Configuration Group */}
        {activeFields.length > 0 && (
          <Card
            title="Cấu hình chi tiết bộ cào"
            size="small"
            style={{
              marginTop: 20,
              backgroundColor: "#fafafa",
              borderRadius: 8,
              border: "1px solid #f0f0f0",
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {activeFields.map((field) => {
              let inputComponent = (
                <Input placeholder={field.description || `Nhập ${field.label}`} />
              );
              if (field.type === "number") {
                inputComponent = (
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={field.description || `Nhập ${field.label}`}
                  />
                );
              } else if (field.type === "boolean") {
                inputComponent = <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />;
              }

              return (
                <Form.Item
                  key={field.name}
                  name={["config", field.name]}
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

        <div style={{ textAlign: "end", marginTop: 24 }}>
          <Button
            onClick={() => setOpen(false)}
            style={{ marginRight: 8, borderRadius: 6 }}
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loadingCrawlSource}
            icon={method === "post" ? <PlusCircleOutlined /> : <EditOutlined />}
            style={{ borderRadius: 6 }}
          >
            {method === "post" ? "Thêm mới" : "Lưu cấu hình"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormCrawlSource;
