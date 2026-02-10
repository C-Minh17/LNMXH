import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Divider, Skeleton, Space } from 'antd';
import { PageHeaderContent } from './components/page-header-content';

const DashboardPage = () => {
	const { initialState } = useModel('@@initialState');

	if (!initialState || !initialState.currentUser) {
		return (
			<PageContainer>
				<Skeleton
					avatar
					paragraph={{
						rows: 3,
					}}
					active
				/>
			</PageContainer>
		);
	}

	const currentUser = initialState.currentUser;

	return (
		<>
			Trang chủ
		</>
	);
};

export default DashboardPage;
