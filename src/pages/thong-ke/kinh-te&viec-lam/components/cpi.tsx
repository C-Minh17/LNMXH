import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { FilterOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocation, useModel } from "@umijs/max";
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react";

const { Title } = Typography;


const StatisticCpi = () => {
  const { token } = theme.useToken()
  const { statisticCpiEx, statisticCpiIn, statisticCpiLoading, handleStatisticCpi, handleBackgroundTask, handleExtractCpi } = useModel("statistic.statistic")
  const [statusExtract, setStatusExtract] = useState<string>()
  const [taskId, setTaskId] = useState<string | undefined>(() => {
    return sessionStorage.getItem("task_id_Cpi") || undefined;
  });

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  const dataSource = type === 'external' ? statisticCpiEx : statisticCpiIn;

  const updateTaskId = (id: string | undefined) => {
    setTaskId(id);
    if (id) {
      sessionStorage.setItem("task_id_Cpi", id);
    } else {
      sessionStorage.removeItem("task_id_Cpi");
    }
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState<MStatistic.QueryParams3>({
    year: undefined,
    month: undefined,
    province: undefined,
    skip: 0,
    limit: 50,
  });
  const handleFilterSubmit = () => {
    form.validateFields().then((values) => {
      const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (value === null || value === '') {
          acc[key] = undefined;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      setParams((prev) => ({
        ...prev,
        ...cleanedValues,
        skip: 0,
      }));
      setOpenFilter(false);
    });
  };

  const columns: IColumn<MStatistic.ICpi>[] = [
    {
      title: "Tỉnh/Thành phố",
      dataIndex: "province",
      width: 180,
      filterType: 'string',
      fixed: 'left',
    },
    {
      title: "Năm",
      dataIndex: "year",
      width: 80,
      align: 'center',
      filterType: 'number',
      fixed: 'left',
    },
    {
      title: "Kỳ dữ liệu",
      dataIndex: "period_type",
      width: 120,
      filterType: 'string',
      render: (val: string) => (val ? val : "N/A"),
    },
    {
      title: "Quý/Tháng",
      key: "time_period",
      width: 100,
      align: 'center',
      render: (record: MStatistic.ICpi) => {
        if (record.quarter) return `Q${record.quarter}`;
        if (record.month) return `T${record.month}`;
        return "N/A";
      }
    },
    {
      title: "CPI (Chung)",
      dataIndex: "actual_value",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "CPI Lõi",
      dataIndex: "core_cpi",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Lạm phát (%)",
      dataIndex: "inflation_rate",
      width: 130,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Thay đổi YoY (%)",
      dataIndex: "change_yoy",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Thay đổi QoQ (%)",
      dataIndex: "change_qoq",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Thay đổi MoM (%)",
      dataIndex: "change_mom",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "CPI Hàng ăn",
      dataIndex: "cpi_food",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "CPI Nhà ở & VLXD",
      dataIndex: "cpi_housing",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "CPI Giao thông",
      dataIndex: "cpi_transport",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "CPI Giáo dục",
      dataIndex: "cpi_education",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "CPI Y tế",
      dataIndex: "cpi_healthcare",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Quyền số (Rổ hàng hóa)",
      dataIndex: "basket_weights",
      width: 180,
      render: (val: string) => (
        val ? (
          <Tooltip title={val}>
            <span style={{
              display: 'block',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}>
              {val}
            </span>
          </Tooltip>
        ) : "N/A"
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "data_status",
      width: 120,
      align: 'center',
      render: (val: string) => (val ? <span style={{ textTransform: 'capitalize' }}>{val}</span> : "N/A"),
    },
    {
      title: "Nguồn dữ liệu",
      dataIndex: "data_source",
      width: 180,
      render: (value: string) => (
        value ? (
          <Typography.Link href={value} target="_blank" rel="noreferrer">
            Nguồn tin
          </Typography.Link>
        ) : "N/A"
      )
    },
    {
      title: "Cập nhật lần cuối",
      dataIndex: "last_updated",
      width: 160,
      align: 'center',
      render: (val: string) => (val ? new Date(val).toLocaleDateString('vi-VN') : "N/A"),
    },
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   width: 80,
    //   fixed: 'right',
    //   render: (record: MStatistic.ICpi) => {
    //     return (
    //       <>
    //         <Tooltip title='Xem chi tiết'>
    //           <Button
    //             icon={<ExportOutlined />}
    //             iconPosition='end'
    //             type='link'
    //             onClick={() => { console.log("Detail:", record) }}
    //           />
    //         </Tooltip>
    //       </>
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    handleStatisticCpi(params)
  }, [statusExtract, params])

  useEffect(() => {
    if (taskId) {
      handleBackgroundTask(taskId).then(res => setStatusExtract(res.status));
    }
  }, [])

  useEffect(() => {
    if (!taskId || statusExtract === "COMPLETED" || statusExtract === "FAILED") {
      return;
    }
    const intervalId = setInterval(async () => {
      try {
        const res = await handleBackgroundTask(taskId);
        setStatusExtract(res.status);
        if (res.status === "COMPLETED") {
          updateTaskId(undefined);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra task:", error);
        clearInterval(intervalId);
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, [taskId, statusExtract, handleBackgroundTask]);

  return (
    <>
      <Modal
        title="Bộ lọc dữ liệu"
        open={openFilter}
        onOk={handleFilterSubmit}
        onCancel={() => setOpenFilter(false)}
        okText="Áp dụng"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={params}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="year" label="Năm">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Nhập năm (VD: 2024)"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="month" label="Tháng">
                <Select placeholder="Chọn tháng" allowClear>
                  <Select.Option value={1}>Tháng 1</Select.Option>
                  <Select.Option value={2}>Tháng 2</Select.Option>
                  <Select.Option value={3}>Tháng 3</Select.Option>
                  <Select.Option value={4}>Tháng 4</Select.Option>
                  <Select.Option value={5}>Tháng 5</Select.Option>
                  <Select.Option value={6}>Tháng 6</Select.Option>
                  <Select.Option value={7}>Tháng 7</Select.Option>
                  <Select.Option value={8}>Tháng 8</Select.Option>
                  <Select.Option value={9}>Tháng 9</Select.Option>
                  <Select.Option value={10}>Tháng 10</Select.Option>
                  <Select.Option value={11}>Tháng 11</Select.Option>
                  <Select.Option value={12}>Tháng 12</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="skip" label="Skip">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder=""
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="limit" label="Số lượng (cả nội bộ và bên ngoài)">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Nhập số lượng"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="province" label="Tỉnh/thành phố">
                <Input
                  style={{ width: '100%' }}
                  placeholder="Nhập tỉnh/thành phố"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Title level={4} style={{ color: token.colorPrimary, marginBottom: 5 }}>Thống kê chỉ số giá tiêu dùng {`(Cpi)`}</Title>
      <TableStaticData
        columns={columns}
        data={dataSource || []}
        addStt={true}
        loading={statisticCpiLoading}
        hasTotal
        otherButtons={[
          <>
            <Tooltip title={statusExtract === "COMPLETED" ? "Cập nhật dữ liệu mới" : "Đang cập nhật dữ liệu"}>
              <Button
                onClick={async () => {
                  const res = await handleExtractCpi();
                  if (res?.task_id) {
                    updateTaskId(res.task_id);
                    setStatusExtract("PENDING");
                  }
                }}
                disabled={statusExtract === "PENDING" || statusExtract === "PROCESSING" ? true : false}
              >
                <SyncOutlined spin={statusExtract === "PENDING" || statusExtract === "PROCESSING" ? true : false} />
              </Button>
            </Tooltip>
            <Tooltip title="Bộ lọc">
              <Button
                onClick={async () => {
                  setOpenFilter(true)
                }}
                icon={<FilterOutlined />}
              >
              </Button>
            </Tooltip>
          </>
        ]}
      />
    </>
  )
}

export default StatisticCpi