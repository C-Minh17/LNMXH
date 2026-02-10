import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { FilterOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocation, useModel } from "@umijs/max";
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react";

const { Title } = Typography;


const StatisticHighschoolGraduationDetail = () => {
  const { token } = theme.useToken()
  const { statisticHighschoolGraduationDetailEx, statisticHighschoolGraduationDetailIn, statisticHighschoolGraduationDetailLoading, handleStatisticHighschoolGraduationDetail, handleBackgroundTask, handleExtractHighschoolGraduationDetail } = useModel("statistic.statistic")
  const [statusExtract, setStatusExtract] = useState<string>()
  const [taskId, setTaskId] = useState<string | undefined>(() => {
    return sessionStorage.getItem("task_id_HighschoolGraduationDetail") || undefined;
  });

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  const dataSource = type === 'external' ? statisticHighschoolGraduationDetailEx : statisticHighschoolGraduationDetailIn;

  const updateTaskId = (id: string | undefined) => {
    setTaskId(id);
    if (id) {
      sessionStorage.setItem("task_id_HighschoolGraduationDetail", id);
    } else {
      sessionStorage.removeItem("task_id_HighschoolGraduationDetail");
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


  const columns: IColumn<MStatistic.IHighschoolGraduationDetail>[] = [
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
    },
    {
      title: "Kỳ thi/Thời gian",
      key: "time_period",
      width: 120,
      align: 'center',
      render: (record: MStatistic.IHighschoolGraduationDetail) => {
        if (record.quarter) return `Q${record.quarter}`;
        if (record.month) return `T${record.month}`;
        return "N/A";
      }
    },

    {
      title: "Tổng thí sinh",
      dataIndex: "total_candidates",
      width: 140,
      align: 'center',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Số đỗ tốt nghiệp",
      dataIndex: "passed_candidates",
      width: 140,
      align: 'center',
      render: (val: number) => (val !== null ? val.toLocaleString() : "N/A"),
    },
    {
      title: "Tỷ lệ tốt nghiệp (%)",
      dataIndex: "graduation_rate",
      width: 150,
      align: 'center',
      render: (val: number) => (val !== null ? `${val.toFixed(2)}%` : "N/A"),
    },

    {
      title: "Điểm TB chung",
      dataIndex: "average_score",
      width: 130,
      align: 'center',
      render: (val: number) => (val !== null ? val.toFixed(2) : "N/A"),
    },
    {
      title: "Điểm Toán",
      dataIndex: "math_avg_score",
      width: 120,
      align: 'center',
      render: (val: number) => (val !== null ? val.toFixed(2) : "N/A"),
    },
    {
      title: "Điểm Văn",
      dataIndex: "literature_avg_score",
      width: 120,
      align: 'center',
      render: (val: number) => (val !== null ? val.toFixed(2) : "N/A"),
    },
    {
      title: "Điểm Anh",
      dataIndex: "english_avg_score",
      width: 120,
      align: 'center',
      render: (val: number) => (val !== null ? val.toFixed(2) : "N/A"),
    },

    {
      title: "Tỷ lệ Giỏi (%)",
      dataIndex: "excellent_rate",
      width: 130,
      align: 'center',
      render: (val: number) => (val !== null ? `${val.toFixed(2)}%` : "N/A"),
    },
    {
      title: "Tỷ lệ Trượt (%)",
      dataIndex: "fail_rate",
      width: 130,
      align: 'center',
      render: (val: number) => (val !== null ? `${val.toFixed(2)}%` : "N/A"),
    },
    {
      title: "Xếp hạng Quốc gia",
      dataIndex: "rank_national",
      width: 140,
      align: 'center',
      render: (val: number) => (val !== null ? `#${val}` : "N/A"),
    },
    {
      title: "Xếp hạng Khu vực",
      dataIndex: "rank_regional",
      width: 140,
      align: 'center',
      render: (val: number) => (val !== null ? `#${val}` : "N/A"),
    },
    {
      title: "Thay đổi YoY",
      dataIndex: "yoy_change",
      width: 130,
      align: 'center',
      render: (val: number) => (val !== null ? `${val > 0 ? '+' : ''}${val}%` : "N/A"),
    },

    {
      title: "Ghi chú",
      dataIndex: "notes",
      width: 200,
      render: (val: string) => (
        <Tooltip title={val}>
          <span style={{
            display: 'block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}>
            {val || "N/A"}
          </span>
        </Tooltip>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "data_status",
      width: 120,
      align: 'center',
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

    // --- THAO TÁC (Fixed Right) ---
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   width: 80,
    //   fixed: 'right',
    //   render: (record: MStatistic.IEducation) => {
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
    handleStatisticHighschoolGraduationDetail(params)
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
      <Title level={4} style={{ color: token.colorPrimary, marginBottom: 5 }}>Thống kê tốt nghiệp THPT</Title>
      <TableStaticData
        columns={columns}
        data={dataSource || []}
        addStt={true}
        loading={statisticHighschoolGraduationDetailLoading}
        hasTotal
        otherButtons={[
          <>
            <Tooltip title={statusExtract === "COMPLETED" ? "Cập nhật dữ liệu mới" : "Đang cập nhật dữ liệu"}>
              <Button
                onClick={async () => {
                  const res = await handleExtractHighschoolGraduationDetail();
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

export default StatisticHighschoolGraduationDetail