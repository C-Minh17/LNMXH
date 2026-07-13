import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd"

interface IFormFilter {
  params?: MManagePostV2.IParamPost,
  setParams?: (a: MManagePostV2.IParamPost) => void,
  setOpenFilter?: (a: boolean) => void,
}
const FormFilterParams = (props: IFormFilter) => {
  const { params, setParams, setOpenFilter } = props
  const [form] = Form.useForm()

  const onSubmit = (e: MManagePostV2.IParamPost) => {
    setParams?.(e)
    form.resetFields
    setOpenFilter?.(false)
  }
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={params}
      onFinish={onSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="sort_by" label="sort_by">
            <Input
              style={{ width: '100%' }}
              placeholder="VD: id"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="order" label="order">
            <Select
              options={[
                { label: "Giảm dần", value: "desc" },
                { label: "Tăng dần", value: "asc" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="page_size" label="page_size">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="VD: 10"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="page" label="page">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="VD: 1, 2, 3"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={24} style={{ textAlign: "center", marginTop: 10 }}>
          <Button type="primary" htmlType="submit">Áp dụng</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default FormFilterParams