import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import { Button, Card, Col, Form, Input, message, Modal, Row, Select, theme, Typography } from "antd"
import { useEffect } from "react";

interface IFormPostV2 {
  open: boolean,
  setOpen: (a: boolean) => void,
  method: "put" | "post",
  initialValues?: MManagePostV2.IRecord,
}

const { Title } = Typography;
const FormPostV2 = (props: IFormPostV2) => {
  const { open, setOpen, method, initialValues } = props;
  const { dataType, handleGetDataTypePostV2, loadingPostV2, handleCreatePostV2, handleEditPostV2 } = useModel("manage-post.manage-post")
  const { token } = theme.useToken()
  const [form] = Form.useForm()

  const onSubmit = async (e: MManagePostV2.IRecord) => {
    try {
      const dataFormat = {
        ...e,
        meta_data: JSON.parse(e.meta_data),
      }
      console.log(dataFormat)
      if (method === "post") {
        const res = await handleCreatePostV2(dataFormat)
        if (res) {
          message.success("Tạo bài viết mới thành công")
        }
      } else {
        const res = await handleEditPostV2(2, dataFormat)
        if (res) {
          message.success("Chỉnh sửa bài viết mới thành công")
        }
      }
      setOpen(false)
      form.resetFields()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (open) {
      if (method === "put" && initialValues) {
        form.setFieldsValue({
          ...initialValues,
          meta_data: initialValues.meta_data
            ? JSON.stringify(initialValues.meta_data, null, 2)
            : "",
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, method, form])

  useEffect(() => {
    handleGetDataTypePostV2()
  }, [])

  return (
    <>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
        footer
        width={700}
        title={<Title level={3} style={{ color: token.colorPrimary, textAlign: "center" }}>{method === "post" ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}</Title>}
      >
        <Card style={{
          maxHeight: 450,
          overflowY: "scroll",
          overflowX: "hidden",
        }}>
          <Form form={form} layout='vertical' onFinish={onSubmit} >
            <div>
              <Row gutter={[10, 8]}>
                <Col sm={24}>
                  <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                    <Input placeholder="Nhập tiêu đề" />
                  </Form.Item>
                </Col>
                <Col sm={24}>
                  <Form.Item name="content" label="Nội dung bài viết" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                    <Input.TextArea rows={3} placeholder="Nhập nội dung bài viết" />
                  </Form.Item>
                </Col>
                <Col sm={24}>
                  <Form.Item name="data_type" label="Kiểu dữ liệu" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                    <Select
                      options={[
                        { label: "string", value: "string" },
                        { label: "news", value: "news" },
                        { label: "transportation", value: "transportation" },
                        { label: "threads", value: "threads" },
                        { label: "newspaper", value: "newspaper" },
                        { label: "facebook", value: "facebook" },
                        { label: "tiktok", value: "tiktok" }
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24}>
                  <Form.Item name="url" label="Đường dẫn" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                    <Input placeholder="Nhập đường dẫn" />
                  </Form.Item>
                </Col>
                <Col sm={24}>
                  <Form.Item initialValue="internal" name="document_type" label="Kiểu tài liệu" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col sm={24}>
                  <Form.Item
                    name="meta_data"
                    label="meta_data(json)"
                    rules={[
                      { required: true, message: "Vui lòng không để trống" },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          try {
                            JSON.parse(value);
                            return Promise.resolve();
                          } catch (e) {
                            return Promise.reject(new Error("Định dạng JSON không hợp lệ!"));
                          }
                        },
                      },
                    ]}
                  >
                    <Input.TextArea rows={5} placeholder='Ví dụ: {"key": "value"}' />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div style={{ textAlign: "end" }}>
              <Button loading={loadingPostV2} icon={method === "post" ? <PlusCircleOutlined /> : <EditOutlined />} htmlType="submit" type="primary">{method === "post" ? "Thêm mới" : "Lưu chỉnh sửa"}</Button>
            </div>
          </Form>
        </Card>
      </Modal>
    </>
  )
}

export default FormPostV2