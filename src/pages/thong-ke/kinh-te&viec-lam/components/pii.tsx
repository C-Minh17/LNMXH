import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { FilterOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocation, useModel } from "@umijs/max";
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react";

const { Title } = Typography;


const StatisticPii = () => {
  const { token } = theme.useToken()
  const { statisticPiiEx, statisticPiiIn, statisticPiiLoading, handleStatisticPii, handleBackgroundTask, handleExtractPii } = useModel("statistic.statistic")
  const [statusExtract, setStatusExtract] = useState<string>()
  const [taskId, setTaskId] = useState<string | undefined>(() => {
    return sessionStorage.getItem("task_id_Pii") || undefined;
  });

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  const dataSource = type === 'external' ? statisticPiiEx : statisticPiiIn;

  const updateTaskId = (id: string | undefined) => {
    setTaskId(id);
    if (id) {
      sessionStorage.setItem("task_id_Pii", id);
    } else {
      sessionStorage.removeItem("task_id_Pii");
    }
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState<MStatistic.QueryParams2>({
    year: undefined,
    quarter: undefined,
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

  const columns: IColumn<MStatistic.IPii>[] = [
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
      width: 100,
      filterType: 'string',
    },
    {
      title: "Quý/Tháng",
      key: "time_period",
      width: 100,
      align: 'center',
      render: (record: any) => {
        if (record.quarter) return `Q${record.quarter}`;
        if (record.month) return `T${record.month}`;
        return "N/A";
      }
    },
    {
      title: "Chỉ số SXCN (PII)",
      dataIndex: "pii_overall",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"), // PII thường tính bằng % so với gốc
    },
    {
      title: "Tăng trưởng PII (%)",
      dataIndex: "pii_growth_rate",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Giá trị SXCN",
      dataIndex: "industrial_output_value",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Khai khoáng",
      dataIndex: "mining_index",
      width: 130,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Chế biến, chế tạo",
      dataIndex: "manufacturing_index",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "SX & PP Điện",
      dataIndex: "electricity_index",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Chế biến thực phẩm",
      dataIndex: "food_processing_index",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Dệt may",
      dataIndex: "textile_index",
      width: 130,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Điện tử",
      dataIndex: "electronics_index",
      width: 130,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "PII Nhà nước",
      dataIndex: "state_owned_pii",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "PII Ngoài nhà nước",
      dataIndex: "private_pii",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "PII Khu vực FDI",
      dataIndex: "fdi_pii",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Tỷ trọng chế biến (%)",
      dataIndex: "manufacturing_share",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Tỷ trọng CN cao (%)",
      dataIndex: "hightech_industry_share",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Hiệu suất sử dụng (%)",
      dataIndex: "capacity_utilization",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Năng suất lao động",
      dataIndex: "labor_productivity",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Số DN công nghiệp",
      dataIndex: "industrial_enterprises",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Lao động công nghiệp",
      dataIndex: "industrial_workers",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },

    {
      title: "Trạng thái",
      dataIndex: "data_status",
      width: 120,
      align: 'center',
      render: (val: string) => <span style={{ textTransform: 'capitalize' }}>{val}</span>
    },
    {
      title: "Nguồn dữ liệu",
      dataIndex: "data_source",
      width: 200,
      render: (value: string) => (
        value ? (
          <Typography.Link href={value} target="_blank" rel="noreferrer">
            {value.replace(/^https?:\/\//, '').substring(0, 20)}...
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

    // --- THAO TÁC (Fixed Right) ---
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   width: 80,
    //   fixed: 'right',
    //   render: (record: MStatistic.IIndustrial) => {
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
    handleStatisticPii(params)
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
              <Form.Item name="quarter" label="Quý">
                <Select placeholder="Chọn quý" allowClear>
                  <Select.Option value={1}>Quý 1</Select.Option>
                  <Select.Option value={2}>Quý 2</Select.Option>
                  <Select.Option value={3}>Quý 3</Select.Option>
                  <Select.Option value={4}>Quý 4</Select.Option>
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
      <Title level={4} style={{ color: token.colorPrimary, marginBottom: 5 }}>Thống kê chỉ số đổi mới sáng tạo {`(Pii)`}</Title>
      <TableStaticData
        columns={columns}
        data={dataSource || []}
        addStt={true}
        loading={statisticPiiLoading}
        hasTotal
        otherButtons={[
          <>
            <Tooltip title={statusExtract === "COMPLETED" ? "Cập nhật dữ liệu mới" : "Đang cập nhật dữ liệu"}>
              <Button
                onClick={async () => {
                  const res = await handleExtractPii();
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

export default StatisticPii