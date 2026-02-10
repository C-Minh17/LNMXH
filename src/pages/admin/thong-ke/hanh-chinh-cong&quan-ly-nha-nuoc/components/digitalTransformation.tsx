import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { FilterOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocation, useModel } from "@umijs/max";
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react";

const { Title } = Typography;


const StatisticDigitalTransformation = () => {
  const { token } = theme.useToken()
  const { statisticDigitalTransformationEx, statisticDigitalTransformationIn, statisticDigitalTransformationLoading, handleStatisticDigitalTransformation, handleBackgroundTask, handleExtractDigitalTransformation } = useModel("statistic.statistic")
  const [statusExtract, setStatusExtract] = useState<string>()
  const [taskId, setTaskId] = useState<string | undefined>(() => {
    return sessionStorage.getItem("task_id_DigitalTransformation") || undefined;
  });

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  const dataSource = type === 'external' ? statisticDigitalTransformationEx : statisticDigitalTransformationIn;

  const updateTaskId = (id: string | undefined) => {
    setTaskId(id);
    if (id) {
      sessionStorage.setItem("task_id_DigitalTransformation", id);
    } else {
      sessionStorage.removeItem("task_id_DigitalTransformation");
    }
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState<MStatistic.QueryParamsFdi>({
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


  const columns: IColumn<MStatistic.IDigitalTransformation>[] = [
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
      render: (record: MStatistic.IDigitalTransformation) => {
        if (record.quarter) return `Q${record.quarter}`;
        if (record.month) return `T${record.month}`;
        return "N/A";
      }
    },
    {
      title: "Chỉ số DTI (DX Index)",
      dataIndex: "dx_index",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Chỉ số sẵn sàng (DX Readiness)",
      dataIndex: "dx_readiness_index",
      width: 180,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Chỉ số chính quyền điện tử",
      dataIndex: "egov_index",
      width: 180,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Dịch vụ công trực tuyến (Tổng)",
      dataIndex: "online_public_services",
      width: 180,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "DVCT Mức độ 3",
      dataIndex: "level3_services",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "DVCT Mức độ 4",
      dataIndex: "level4_services",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Tỷ lệ sử dụng DVCT (%)",
      dataIndex: "online_service_usage_rate",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Phủ sóng băng rộng (%)",
      dataIndex: "broadband_coverage",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Phủ sóng 5G (%)",
      dataIndex: "fiveg_coverage",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Tỷ lệ dùng Cloud (%)",
      dataIndex: "cloud_adoption_rate",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Mức độ CĐS doanh nghiệp SME",
      dataIndex: "sme_dx_adoption",
      width: 180,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "DN ứng dụng AI",
      dataIndex: "companies_using_ai",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "DN ứng dụng IoT",
      dataIndex: "companies_using_iot",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Đầu tư cho CĐS",
      dataIndex: "dx_investment",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Tăng năng suất từ CĐS (%)",
      dataIndex: "productivity_increase_from_dx",
      width: 180,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Tỷ lệ kỹ năng số (%)",
      dataIndex: "digital_literacy_rate",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Số dự án AI",
      dataIndex: "ai_projects",
      width: 130,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Số dự án IoT",
      dataIndex: "iot_projects",
      width: 130,
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
    //   render: (record: MStatistic.IDigitalTransformation) => {
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
    handleStatisticDigitalTransformation(params)
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
      <Title level={4} style={{ color: token.colorPrimary, marginBottom: 5 }}>Thống kê chuyển đổi số</Title>
      <TableStaticData
        columns={columns}
        data={dataSource || []}
        addStt={true}
        loading={statisticDigitalTransformationLoading}
        hasTotal
        otherButtons={[
          <>
            <Tooltip title={statusExtract === "COMPLETED" ? "Cập nhật dữ liệu mới" : "Đang cập nhật dữ liệu"}>
              <Button
                onClick={async () => {
                  const res = await handleExtractDigitalTransformation();
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

export default StatisticDigitalTransformation