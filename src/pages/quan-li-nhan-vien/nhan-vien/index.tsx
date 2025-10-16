import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Popconfirm, Tooltip } from 'antd';
import FormNhanVien from './components/form';
import { formatISOToVietnamDate } from '@/utils/utils';

const NhanVienPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('quan-li-nhan-vien.nhan-vien');

	const columns: IColumn<MNhanVien.IRecord>[] = [
		{
			title: 'Mã nhân viên',
			dataIndex: 'maNhanVien',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Họ và tên',
			dataIndex: 'hoVaTen',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Sinh nhật',
			dataIndex: 'sinhNhat',
			width: 150,
			filterType: 'date',
			sortable: true,
			render: (val) => (val ? formatISOToVietnamDate(val) : ''),
		},
		{
			title: 'Ngày tuyển dụng',
			dataIndex: 'ngayTuyenDung',
			width: 160,
			filterType: 'date',
			sortable: true,
			render: (val) => (val ? formatISOToVietnamDate(val) : ''),
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDienThoai',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: MNhanVien.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa nhân viên này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='quan-li-nhan-vien.nhan-vien'
			title='Nhân viên'
			Form={FormNhanVien}
			buttons={{
				create: true,
			}}
		/>
	);
};

export default NhanVienPage;
