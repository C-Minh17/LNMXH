import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { CodeOutlined, ExportOutlined, FileTextOutlined, LinkOutlined, SearchOutlined } from "@ant-design/icons"
import { useModel } from "@umijs/max"
import { Badge, Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Space, Tag, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react"
import FormCreatePostCrawl from "./components/form"

const { Title, Text } = Typography

const ManagePosts = () => {
  const { postv2SearchLoading, handleSearchPostV2 } = useModel("manage-post.manage-post")
  const { token } = theme.useToken()
  const [postv2Search, setPostV2Search] = useState<MManagePostV2.ISearch[]>()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postv2CrawlDetail, setPostV2CrawlDetail] = useState<MManagePostV2.ISearch>()

  const [isCreateMode, setIsCreateMode] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  const onSearch = async (e: MManagePostV2.ICrawlInput) => {
    const dataPay = {
      ...e,
      search_depth: "advanced",
    }
    const res = await handleSearchPostV2(dataPay)
    setPostV2Search(res?.data?.results as MManagePostV2.ISearch[])
  }

  const columns: IColumn<MManagePostV2.ISearch>[] = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 250,
      filterType: 'string',
      render: (value, record) => (
        truncateText(record?.title, 50)
      )
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      width: 300,
      filterType: 'string',
      render: (value, record) => (
        truncateText(record?.content, 50)
      )
    },
    {
      title: "Nguồn bài viết",
      dataIndex: "url",
      width: 300,
      filterType: 'string',
      render: (value, record) => (
        <Typography.Link href={value} target="_blank" rel="noreferrer">
          {truncateText(record?.url, 50)}
        </Typography.Link>
      )
    },
    {
      title: 'Score',
      dataIndex: 'tavily_score',
      key: 'tavily_score',
      width: 100,
      render: (score) => (
        <Text type={score > 0.8 ? 'success' : 'warning'}>
          {(score * 100).toFixed(2)}%
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'already_exists',
      key: 'already_exists',
      width: 120,
      align: "center",
      render: (exists) => (
        <Tag color={!exists ? 'success' : 'default'}>{exists ? 'Đã có' : 'Mới'}</Tag>
      ),
    },
    // {
    //   title: 'Meta Data',
    //   dataIndex: 'extracted_data',
    //   key: 'extracted_data',
    //   width: 200,
    //   render: (value, record) => (
    //     <pre style={{ margin: 0 }}>
    //       {JSON.stringify(record?.extracted_data?.meta_data, null, 2)}
    //     </pre>
    //   ),
    // },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (val, record) => {
        return (
          <>
            <Tooltip title='Xem chi tiết'>
              <Button icon={<ExportOutlined />} iconPosition='end' type='link' onClick={() => { setIsModalOpen(true); setPostV2CrawlDetail(record) }} />
            </Tooltip>
          </>
        );
      },
    },
  ]

  return (
    <>
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            <Text strong style={{ fontSize: 16 }}>Chi tiết bài viết</Text>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false), setIsCreateMode(false) }}
        width={700}
        footer={!isCreateMode ? [
          <>
            <Button type="primary" style={{ display: postv2CrawlDetail?.already_exists ? "none" : "" }} key="close" onClick={() => { setIsCreateMode(true) }}>
              Thêm mới
            </Button>
            <Button key="close" onClick={() => { setIsModalOpen(false), setIsCreateMode(false) }}>
              Đóng
            </Button>
          </>
        ] : false}
        centered
      >
        {!isCreateMode ?
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={4} style={{ marginBottom: 8 }}>
                {postv2CrawlDetail?.title}
              </Title>

              <Space wrap>
                <a href={postv2CrawlDetail?.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <LinkOutlined /> Xem nguồn gốc
                </a>
                <Divider type="vertical" />
                <Tag color={postv2CrawlDetail?.tavily_score ? postv2CrawlDetail?.tavily_score > 0.8 ? "success" : "warning" : ""}>
                  Score: {postv2CrawlDetail?.tavily_score?.toFixed(4)}
                </Tag>
                {postv2CrawlDetail?.already_exists && <Tag color="magenta">Đã tồn tại</Tag>}
              </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>Nội dung trích xuất:</Text>
              <div
                style={{
                  marginTop: 8,
                  padding: 12,
                  background: '#f9f9f9',
                  borderRadius: 6,
                  border: '1px solid #f0f0f0',
                  maxHeight: 300,
                  overflowY: 'auto',
                  lineHeight: '1.6'
                }}
              >
                {postv2CrawlDetail?.content}
              </div>
            </div>

            <div>
              <Space style={{ marginBottom: 8 }}>
                <CodeOutlined />
                <Text strong>Meta Data (JSON):</Text>
              </Space>

              <div style={{
                backgroundColor: '#282c34',
                color: '#abb2bf',
                padding: '12px',
                borderRadius: '6px',
                maxHeight: '250px',
                overflow: 'auto',
                fontSize: '12px',
                fontFamily: 'Menlo, Monaco, "Courier New", monospace'
              }}>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(postv2CrawlDetail?.extracted_data?.meta_data, null, 2)}
                </pre>
              </div>
            </div>

          </Space> :
          <FormCreatePostCrawl data={postv2CrawlDetail as MManagePostV2.ISearch} closeModal={() => { setIsModalOpen(false), setIsCreateMode(false) }} />
        }
      </Modal>
      <Title level={2} style={{ color: token.colorPrimary, marginBottom: 50, marginLeft: 15 }}>Tìm kiếm bài viết</Title>
      <Form onFinish={onSearch}>
        <Row gutter={[10, 2]}>
          <Col sm={24} md={12}>
            <Form.Item name="query">
              <Input type="text" placeholder="Nhập thông tin tìm kiếm" />
            </Form.Item>
          </Col>
          <Col sm={6} md={5}>
            <Form.Item name="start_date" label="Từ: ">
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col sm={6} md={5}>
            <Form.Item name="end_date" label="Đến: ">
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col sm={4} lg={2}>
            <Form.Item name="max_results" label="Số: ">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col sm={12} md={24} style={{ textAlign: "end" }}>
            <Button icon={<SearchOutlined />} htmlType="submit" type="primary" style={{ marginRight: 20 }}>Tìm kiếm</Button>
          </Col>
        </Row>
      </Form>
      <TableStaticData
        columns={columns}
        data={postv2Search || []}
        addStt={true}
        loading={postv2SearchLoading}
      />
    </>
  )
}

export default ManagePosts