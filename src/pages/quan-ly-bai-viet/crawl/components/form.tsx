import { DownloadOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import { Button, Card, Col, Flex, Form, Input, message, Modal, Row, Select, theme, Typography } from "antd"
import { useEffect } from "react";

const { Title } = Typography;

interface IFormCreatePostCrawl {
  data: MManagePostV2.ISearch,
  closeModal: () => void,
}

const FormCreatePostCrawl = (props: IFormCreatePostCrawl) => {
  const { data, closeModal } = props
  const { createPostCrawlLoading, handleCreateFromSearchPostV2, dataType, handleGetDataTypePostV2 } = useModel("manage-post.manage-post")
  const [form] = Form.useForm()

  const dataForm = {
    url: data.url,
    title: data.title,
    content: data.content,
    meta_data: JSON.stringify(data?.extracted_data?.meta_data, null, 2)
  }

  const createPostSearch = async (values: any) => {
    try {
      const payload = {
        ...values,
        meta_data: JSON.parse(values.meta_data),
      };

      const res = await handleCreateFromSearchPostV2(payload);

      if (res) {
        message.success("Tạo bài viết thành công!");
        form.resetFields();
        closeModal()
      } else {
        message.error("Tạo bài viết thất bại!");
      }

    } catch (error) {
      message.error("Có lỗi xảy ra!");
      console.log(error)
    }
  };

  useEffect(() => {
    handleGetDataTypePostV2()
  }, [])

  return (
    <>
      <Form form={form} onFinish={createPostSearch} initialValues={dataForm}>
        <div>
          <Row gutter={[10, 8]}>
            <Col sm={24}>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                <Input placeholder="Nhập tiêu đề" />
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item name="content" label="Nội dung bài viết" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                <Input.TextArea rows={5} placeholder="Nhập nội dung bài viết" />
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item name="url" label="Đường dẫn" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                <Input placeholder="Nhập đường dẫn" />
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item initialValue="external" name="document_type" label="Kiểu tài liệu" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item name="newspaper_type" label="Lĩnh vực" rules={[{ required: true, message: "Vui lòng không để trống" }]}>
                <Input placeholder="Nhập lĩnh vực" />
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item
                name="source"
                label="Nguồn"
                rules={[{ required: true, message: "Vui lòng chọn nguồn" }]}
              >
                <Select
                  placeholder="Chọn nguồn"
                  options={dataType?.map((item: string) => ({
                    label: item,
                    value: item,
                  }))}
                />
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
            <Col sm={24}>
              <Flex justify="center">
                <Button icon={<DownloadOutlined />} htmlType="submit" loading={createPostCrawlLoading} type="primary" size="large">lưu bài viết</Button>
              </Flex>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  )
}

export default FormCreatePostCrawl