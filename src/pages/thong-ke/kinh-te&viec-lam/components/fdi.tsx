import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { FilterOutlined, SyncOutlined } from "@ant-design/icons";
import { useLocation, useModel } from "@umijs/max";
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, theme, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react";

const { Title } = Typography;


const StatisticFdi = () => {
  const { token } = theme.useToken()
  const { statisticFdiEx, statisticFdiIn, statisticFdiLoading, handleStatisticFdi, handleBackgroundTask, handleExtractFdi } = useModel("statistic.statistic")
  const [statusExtract, setStatusExtract] = useState<string>()
  const [taskId, setTaskId] = useState<string | undefined>(() => {
    return sessionStorage.getItem("task_id_Fdi") || undefined;
  });

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  const dataSource = type === 'external' ? statisticFdiEx : statisticFdiIn;

  const updateTaskId = (id: string | undefined) => {
    setTaskId(id);
    if (id) {
      sessionStorage.setItem("task_id_Fdi", id);
    } else {
      sessionStorage.removeItem("task_id_Fdi");
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

  const columns: IColumn<MStatistic.IFdi>[] = [
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
      width: 100,
      align: 'center',
      filterType: 'number',
    },
    {
      title: "Kỳ dữ liệu",
      dataIndex: "period_label",
      width: 150,
      filterType: 'string',
      render: (val: string) => (
        val ? val : "N/A"
      ),
    },
    {
      title: "Giá trị thực tế",
      dataIndex: "actual_value",
      width: 150,
      render: (val: number) => (
        val ? val?.toLocaleString() : "N/A"
      ),
    },
    {
      title: "Giá trị dự báo",
      dataIndex: "forecast_value",
      width: 150,
      render: (val: number) => (
        val ? val?.toLocaleString() : "N/A"
      ),
    },
    {
      title: "Thay đổi YoY (%)",
      dataIndex: "change_yoy",
      width: 130,
      render: (val: number) => (
        val ? `${val}%` : "N/A"
      ),
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
      width: 200,
      filterType: 'string',
      render: (value: string) => (
        value ? (
          <Typography.Link href={value} target="_blank" rel="noreferrer">
            {value.length > 30 ? `${value.substring(0, 30)}...` : value}
          </Typography.Link>
        ) : "N/A"
      )
    },
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   width: 80,
    //   fixed: 'right',
    //   render: (record: MStatistic.IFdi) => {
    //     return (
    //       <>
    //         <Tooltip title='Xem chi tiết'>
    //           <Button
    //             icon={<ExportOutlined />}
    //             iconPosition='end'
    //             type='link'
    //             onClick={() => { console.log("Record detail:", record) }}
    //           />
    //         </Tooltip>
    //       </>
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    handleStatisticFdi(params)
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
      <Title level={4} style={{ color: token.colorPrimary, marginBottom: 5 }}>Thống kê thu hút kinh tế FDI</Title>
      <TableStaticData
        columns={columns}
        data={dataSource || []}
        addStt={true}
        loading={statisticFdiLoading}
        hasTotal
        otherButtons={[
          <>
            <Tooltip title={statusExtract === "COMPLETED" ? "Cập nhật dữ liệu mới" : "Đang cập nhật dữ liệu"}>
              <Button
                onClick={async () => {
                  const res = await handleExtractFdi();
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

export default StatisticFdi