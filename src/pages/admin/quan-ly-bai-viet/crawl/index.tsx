import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { ExportOutlined } from "@ant-design/icons"
import { useModel } from "@umijs/max"
import { Button, Col, Divider, Form, Input, Modal, Row, Space, Tag, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react"
import { Link } from "react-router"

const { Title, Text } = Typography

const ManagePosts = () => {
  const { postv2CrawlLoading, handleCrawlPostV2 } = useModel("manage-post.manage-post")
  const { token } = theme.useToken()
  const [postv2Crawl, setPostV2Crawl] = useState<MManagePostV2.IResults[]>()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postv2CrawlDetail, setPostV2CrawlDetail] = useState<MManagePostV2.IResults>()


  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  const onSearch = async (e: MManagePostV2.ICrawlInput) => {
    const dataPay = {
      ...e,
      max_results: 20,
      skip_existing: true,
      search_depth: "advanced",
    }
    const res = await handleCrawlPostV2(dataPay)
    setPostV2Crawl(res?.data?.tavily_results)
  }

  const columns: IColumn<MManagePostV2.IResults>[] = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 250,
      filterType: 'string',
      render: (value) => (
        truncateText(value, 50)
      )
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      width: 300,
      filterType: 'string',
      render: (value) => (
        truncateText(value, 50)
      )
    },
    {
      title: "Điểm",
      dataIndex: "score",
      width: 150,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: MManagePostV2.IResults) => {
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
        title={<Text>{postv2CrawlDetail?.title}</Text>}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text>
            Nguồn:&nbsp;
            <a href={postv2CrawlDetail?.url} target="_blank" rel="noreferrer" style={{ color: '#1890ff' }}>
              {postv2CrawlDetail?.url}
            </a>
          </Text>
          <Tag color="blue">Score: {postv2CrawlDetail?.score.toFixed(2)}</Tag>
          <Divider />
          <div>Nội dung:</div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {postv2CrawlDetail?.content}
          </div>
        </Space>
      </Modal>
      <Title level={2} style={{ color: token.colorPrimary, marginBottom: 50 }}>Quản lý bài viết</Title>
      <Form onFinish={onSearch}>
        <Row gutter={[10, 2]}>
          <Col sm={24} md={12}>
            <Form.Item name="query">
              <Input type="text" placeholder="Nhập thông tin tìm kiếm" />
            </Form.Item>
          </Col>
          <Col sm={6} md={6}>
            <Form.Item name="start_date" label="Từ: ">
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col sm={6} md={6}>
            <Form.Item name="end_date" label="Đến: ">
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col sm={12} md={24} style={{ textAlign: "end" }}>
            <Button htmlType="submit" type="primary" style={{ marginRight: 20 }}>Tìm kiếm</Button>
          </Col>
        </Row>
      </Form>
      <TableStaticData
        columns={columns}
        data={postv2Crawl || []}
        addStt={true}
        loading={postv2CrawlLoading}
      />
    </>
  )
}

export default ManagePosts