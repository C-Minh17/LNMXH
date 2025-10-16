import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormNhanVien = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('quan-li-nhan-vien.nhan-vien');
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MNhanVien.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item
							name='maNhanVien'
							label='Mã nhân viên'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input placeholder='Nhập mã nhân viên' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							name='hoVaTen'
							label='Họ và tên'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập họ và tên' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item name='sinhNhat' label='Sinh nhật' rules={[...rules.required]}>
							<MyDatePicker placeholder='Chọn sinh nhật' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item name='ngayTuyenDung' label='Ngày tuyển dụng' rules={[...rules.required]}>
							<MyDatePicker placeholder='Chọn ngày tuyển dụng' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							name='soDienThoai'
							label='Số điện thoại'
							rules={[...rules.required, ...rules.text, ...rules.length(10)]}
						>
							<Input placeholder='Nhập số điện thoai' />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={24}>
						<div className='form-footer'>
							<Space>
								<Button loading={formSubmiting} htmlType='submit' type='primary'>
									{!edit ? 'Thêm mới' : 'Lưu lại'}
								</Button>
								<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
							</Space>
						</div>
					</Col>
				</Row>
			</Form>
		</Card>
	);
};

export default FormNhanVien;
