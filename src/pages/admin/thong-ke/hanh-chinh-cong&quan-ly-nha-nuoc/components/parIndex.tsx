import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { FilterOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocation, useModel } from "@umijs/max";
import { Button, Col, Form, Input, InputNumber, Modal, Row, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react";

const { Title } = Typography;


const StatisticParIndex = () => {
  const { token } = theme.useToken()
  const { statisticParIndexEx, statisticParIndexIn, statisticParIndexLoading, handleStatisticParIndex, handleBackgroundTask, handleExtractParIndex } = useModel("statistic.statistic")
  const [statusExtract, setStatusExtract] = useState<string>()
  const [taskId, setTaskId] = useState<string | undefined>(() => {
    return sessionStorage.getItem("task_id_ParIndex") || undefined;
  });

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  const dataSource = type === 'external' ? statisticParIndexEx : statisticParIndexIn;

  const updateTaskId = (id: string | undefined) => {
    setTaskId(id);
    if (id) {
      sessionStorage.setItem("task_id_ParIndex", id);
    } else {
      sessionStorage.removeItem("task_id_ParIndex");
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


  const columns: IColumn<MStatistic.IParIndex>[] = [
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
      render: (record: MStatistic.IParIndex) => {
        if (record.quarter) return `Q${record.quarter}`;
        if (record.month) return `T${record.month}`;
        return "N/A";
      }
    },
    {
      title: "Điểm chỉ số PAR",
      dataIndex: "par_index_score",
      width: 140,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Xếp hạng QG",
      dataIndex: "rank_national",
      width: 120,
      align: 'center',
      render: (val: number) => (val !== null ? `#${val}` : "N/A"),
    },
    {
      title: "Xếp hạng KV",
      dataIndex: "rank_regional",
      width: 120,
      align: 'center',
      render: (val: number) => (val !== null ? `#${val}` : "N/A"),
    },
    {
      title: "Thay đổi YoY",
      dataIndex: "yoy_change",
      width: 130,
      align: 'right',
      render: (val: number) => (val !== null ? `${val > 0 ? '+' : ''}${val}%` : "N/A"),
    },
    {
      title: "Cải cách thể chế",
      dataIndex: "institutional_reform_score",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Cải cách TTHC",
      dataIndex: "admin_procedure_score",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Cải cách tổ chức bộ máy",
      dataIndex: "organizational_reform_score",
      width: 180,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Cải cách chế độ công vụ",
      dataIndex: "civil_service_reform_score",
      width: 180,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Cải cách tài chính công",
      dataIndex: "public_finance_reform_score",
      width: 180,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Xây dựng CP điện tử",
      dataIndex: "egovernment_reform_score",
      width: 180,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Tác động đến XH",
      dataIndex: "citizen_impact_score",
      width: 150,
      align: 'right',
      render: (val: number) => (val !== null ? val.toLocaleString('vi-VN', { minimumFractionDigits: 2 }) : "N/A"),
    },
    {
      title: "Tỷ lệ hồ sơ 1 cửa (%)",
      dataIndex: "onestop_processing_rate",
      width: 160,
      align: 'right',
      render: (val: number) => (val !== null ? `${val}%` : "N/A"),
    },
    {
      title: "Số TTHC đơn giản hóa",
      dataIndex: "simplified_procedures_count",
      width: 180,
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
    //   render: (record: MStatistic.IParIndex) => {
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
    handleStatisticParIndex(params)
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
      <Title level={4} style={{ color: token.colorPrimary, marginBottom: 5 }}>Thống kê chỉ số Cải cách hành chính</Title>
      <TableStaticData
        columns={columns}
        data={dataSource || []}
        addStt={true}
        loading={statisticParIndexLoading}
        hasTotal
        otherButtons={[
          <>
            <Tooltip title={statusExtract === "COMPLETED" ? "Cập nhật dữ liệu mới" : "Đang cập nhật dữ liệu"}>
              <Button
                onClick={async () => {
                  const res = await handleExtractParIndex();
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

export default StatisticParIndex