import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { DeleteOutlined, EditOutlined, ExportOutlined } from "@ant-design/icons"
import { history, useModel } from "@umijs/max"
import { Button, message, Popconfirm, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react"
import FormPostV2 from "./components/form"

const { Title } = Typography

const ManagePosts = () => {
  const { refreshKey, postFilterDocumentType, postFilterDocumentTypeLoading, handlePostFilterDocumentType, handleDeletePostV2, dataType, handleGetDataTypePostV2 } = useModel("manage-post.manage-post")
  const { token } = theme.useToken()

  const [openModal, setOpenMadal] = useState<boolean>(false);
  const [methodForm, setMethodForm] = useState<"put" | "post">("post");
  const [postv2Detail, setPostv2Detail] = useState<MManagePostV2.IRecord>();

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }
  function formatUpdatedAt(updated_at: number): string {
    const date = new Date(updated_at * 1000)

    return date.toLocaleString("vi-VN", {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  const columns: IColumn<MManagePostV2.IRecord>[] = [
    {
      title: "id",
      dataIndex: "id",
      width: 100,
      filterType: 'string',
      sortable: true,
      align: "center",
    },
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
      title: "Loại dữ liệu",
      dataIndex: "data_type",
      width: 150,
      filterType: 'select',
      filterData: dataType.map(item => (
        { label: item, value: item }
      ))
    },
    {
      title: "Loại tài liệu",
      dataIndex: "document_type",
      width: 150,
    },
    {
      title: "Loại báo",
      dataIndex: "meta_data",
      width: 200,
      filterType: 'string',
      render: (_, record) => (
        <div>{record?.meta_data?.type_newspaper}</div>
      )
    },
    {
      title: "Cập nhật",
      dataIndex: "updated_at",
      width: 200,
      filterType: "string",
      render: (value) => (
        formatUpdatedAt(value)
      )
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: MManagePostV2.IRecord) => {
        const handleClickRecord = () => {
          history.push(`/quan-ly-bai-viet/${record.id}`);
        };
        return (
          <>
            <Tooltip title='Xem chi tiết'>
              <Button icon={<ExportOutlined />} iconPosition='end' type='link' onClick={handleClickRecord} />
            </Tooltip>
            <Tooltip title='Chỉnh sửa'>
              <Button onClick={() => {
                setMethodForm("put")
                setPostv2Detail(record)
                setOpenMadal(true)
              }} type='link' icon={<EditOutlined />} />
            </Tooltip>
            <Tooltip title='Xóa'>
              <Popconfirm
                onConfirm={async () => {
                  const res = await handleDeletePostV2(record.id)
                  if (res) {
                    message.success("xóa bài viết thành công")
                  } else {
                    message.error("xóa bài viết không thành công")
                  }
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
    handlePostFilterDocumentType("external")
    handleGetDataTypePostV2()
  }, [refreshKey])

  return (
    <>
      <FormPostV2 open={openModal} setOpen={setOpenMadal} method={methodForm} initialValues={postv2Detail} />
      <Title level={2} style={{ color: token.colorPrimary, marginBottom: 50 }}>Quản lý bài viết</Title>
      <TableStaticData
        columns={columns}
        data={postFilterDocumentType || []}
        addStt={true}
        hasTotal
        loading={postFilterDocumentTypeLoading}
      // hasCreate
      // setShowEdit={() => {
      //   setMethodForm("post")
      //   setPostv2Detail(undefined)
      //   setOpenMadal(true)
      // }}
      />
    </>
  )
}

export default ManagePosts