import { sampleProfilePic } from '@/services/base/constant';
import { Login } from '@/services/base/typing';
import { Avatar, Grid, Skeleton, theme } from 'antd';

const { useBreakpoint } = Grid;

interface IPageHeaderContentProps {
	currentUser: Login.IUser;
}

export const PageHeaderContent = ({ currentUser }: IPageHeaderContentProps) => {
	const loading = currentUser && Object.keys(currentUser).length;
	const { token } = theme.useToken();
	const screens = useBreakpoint();

	if (!loading) {
		return (
			<Skeleton
				avatar
				paragraph={{
					rows: 1,
				}}
				active
			/>
		);
	}

	const isMobile = !screens.sm;

	return (
		<div
			style={{
				display: isMobile ? 'block' : 'flex',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					flex: '0 1 72px',
				}}
			>
				<Avatar
					size='large'
					src={currentUser.picture || sampleProfilePic}
					style={{
						marginBottom: 0,
						display: 'block',
						width: '72px',
						height: '72px',
						borderRadius: '72px',
					}}
				/>
			</div>
			<div
				style={{
					position: 'relative',
					top: '4px',
					flex: '1 1 auto',
					marginLeft: isMobile ? 0 : 24,
					color: token.colorTextSecondary,
					lineHeight: '22px',
				}}
			>
				<div
					style={{
						marginBottom: '12px',
						color: token.colorTextHeading,
						fontWeight: '500',
						fontSize: '20px',
						lineHeight: '28px',
					}}
				>
					Xin chào {currentUser.name} 👋
					<br />
					<span
						style={{
							fontWeight: 400,
							color: token.colorTextSecondary,
						}}
					>
						Cùng luyên tập lập trình nào!
					</span>
				</div>
				<div>
					{currentUser.preferred_username} | {currentUser.email}
				</div>
			</div>
		</div>
	);
};
