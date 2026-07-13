import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { FilterOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocation, useModel } from "@umijs/max";
import { Button, Col, Form, Input, InputNumber, Modal, Row, Tag, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react";

const { Title } = Typography;


const StatisticSipas = () => {
  const { token } = theme.useToken()
  const { statisticSipasEx, statisticSipasIn, statisticSipasLoading, handleStatisticSipas, handleBackgroundTask, handleExtractSipas } = useModel("statistic.statistic")
  const [statusExtract, setStatusExtract] = useState<string>()
  const [taskId, setTaskId] = useState<string | undefined>(() => {
    return sessionStorage.getItem("task_id_Sipas") || undefined;
  });

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  const dataSource = type === 'external' ? statisticSipasEx : statisticSipasIn;

  const updateTaskId = (id: string | undefined) => {
    setTaskId(id);
    if (id) {
      sessionStorage.setItem("task_id_Sipas", id);
    } else {
      sessionStorage.removeItem("task_id_Sipas");
    }
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState<MStatistic.QueryParams4>({
    year: undefined,
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


  const columns: IColumn<MStatistic.ISipas>[] = [
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
      title: "Quý/Tháng",
      key: "time_period",
      width: 100,
      align: 'center',
      render: (record: MStatistic.ISipas) => {
        if (record.quarter) return `Q${record.quarter}`;
        if (record.month) return `T${record.month}`;
        return "N/A";
      }
    },
    {
      title: "Chỉ số SIPAS",
      dataIndex: "sipas_score",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Tỷ lệ hài lòng (%)",
      dataIndex: "satisfaction_rate",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Xếp hạng QG",
      dataIndex: "rank_national",
      width: 120,
      align: 'center',
      render: (val: number) => (
        <Tag color="blue">{val !== null ? `#${val}` : "N/A"}</Tag>
      ),
    },
    {
      title: "Xếp hạng KV",
      dataIndex: "rank_regional",
      width: 120,
      align: 'center',
      render: (val: number) => (
        <Tag color="blue">{val !== null ? `#${val}` : "N/A"}</Tag>
      ),
    },
    {
      title: "Thay đổi YoY",
      dataIndex: "yoy_change",
      width: 130,
      align: 'right',
      render: (val: number) => (val !== null ? `${val > 0 ? '+' : ''}${val}%` : "N/A"),
    },
    {
      title: "Tiếp cận dịch vụ",
      dataIndex: "service_access_score",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Thủ tục hành chính",
      dataIndex: "procedure_simplicity_score",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Thái độ phục vụ",
      dataIndex: "staff_attitude_score",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Thời gian giải quyết",
      dataIndex: "processing_time_score",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Công khai minh bạch",
      dataIndex: "transparency_score",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Dịch vụ trực tuyến",
      dataIndex: "online_service_score",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Tiếp nhận phản ánh",
      dataIndex: "complaint_resolution_score",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Số cuộc khảo sát",
      dataIndex: "surveys_conducted",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Số người phản hồi",
      dataIndex: "respondents_count",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
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
    //   render: (record: MStatistic.ISipas) => {
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
    handleStatisticSipas(params)
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
      <Title level={4} style={{ color: token.colorPrimary, marginBottom: 5 }}>Thống kê hài lòng của người dân</Title>
      <TableStaticData
        columns={columns}
        data={dataSource || []}
        addStt={true}
        loading={statisticSipasLoading}
        hasTotal
        otherButtons={[
          <>
            <Tooltip title={statusExtract === "COMPLETED" ? "Cập nhật dữ liệu mới" : "Đang cập nhật dữ liệu"}>
              <Button
                onClick={async () => {
                  const res = await handleExtractSipas();
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

export default StatisticSipas