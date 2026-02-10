import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { DeleteOutlined, EditOutlined, ExportOutlined } from "@ant-design/icons"
import { history, useModel } from "@umijs/max"
import { Button, message, Popconfirm, Tag, theme, Tooltip, Typography } from "antd"
import { useEffect, useMemo, useState } from "react"
import FormPostV2 from "./components/form"

const { Title } = Typography

const ManagePosts = () => {
  const { refreshKey, dataSource, dataSourceLoading, handleGetDataSource } = useModel("manage-post.manage-post")
  const { token } = theme.useToken()

  const [openModal, setOpenMadal] = useState<boolean>(false);
  const [methodForm, setMethodForm] = useState<"put" | "post">("post");

  const tableData = useMemo(() => {
    return ((dataSource || []).map((item, index) => (
      {
        id: index,
        value: item,
      }
    )))
  }, [dataSource])

  const columns: IColumn<any>[] = [
    {
      title: "Nguồn",
      dataIndex: "value",
      width: 400,
      filterType: 'string',
      sortable: true,
      align: "center",
      render: (_, record) => {
        return (
          <Tag color="blue" style={{ fontSize: '14px', padding: '5px 10px' }}>
            {record?.value}
          </Tag>
        )
      }
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_) => {
        return (
          <>
            <Tooltip title='Chỉnh sửa'>
              <Button onClick={() => {
                setMethodForm("put")
                setOpenMadal(true)
              }} type='link' icon={<EditOutlined />} />
            </Tooltip>
            <Tooltip title='Xóa'>
              <Popconfirm
                onConfirm={async () => {
                  // const res = await handleDeletePostV2(record.id)
                  // if (res) {
                  //   message.success("xóa bài viết thành công")
                  // } else {
                  //   message.error("xóa bài viết không thành công")
                  // }
                }}
                title='Bạn có chắc chắn muốn xóa bài viết này?'
                placement='topLeft'
              >
                <Button danger type='link' icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </>
        );
      },
    },
  ]
  useEffect(() => {
    handleGetDataSource()
  }, [refreshKey])


  return (
    <>
      {/* <FormPostV2 open={openModal} setOpen={setOpenMadal} method={methodForm} initialValues={postv2Detail} /> */}
      <Title level={2} style={{ color: token.colorPrimary, marginBottom: 50 }}>Quản lý bài viết</Title>
      <TableStaticData
        columns={columns}
        data={tableData || []}
        addStt={true}
        hasTotal
        loading={dataSourceLoading}
        hasCreate
        setShowEdit={() => {
          setMethodForm("post")
          setOpenMadal(true)
        }}
      />
    </>
  )
}

export default ManagePosts