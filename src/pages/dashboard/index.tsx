import { ReloadOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import { Button, Skeleton, Space, Typography } from "antd";
import React, { useEffect } from "react";
import GeneralOverview from "./components/GeneralOverview";
import PlatformStats from "./components/PlatformStats";
import DistributionBreakdown from "./components/DistributionBreakdown";
import PerSourceTable from "./components/PerSourceTable";

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
	const {
		crawlSourceDashboard,
		crawlSourceDashboardLoading,
		handleGetCrawlSourceDashboard,
	} = useModel("crawl-source.crawl-source");

	useEffect(() => {
		handleGetCrawlSourceDashboard();
	}, []);

	const sourcesData = crawlSourceDashboard?.sources;
	const recordsData = crawlSourceDashboard?.records;
	const perSourceList = crawlSourceDashboard?.per_source || [];

	return (
		<div style={{ padding: 24, maxWidth: 1500, margin: "0 auto" }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 24,
				}}
			>
				<div>
					<Title level={3} style={{ margin: 0 }}>
						Dashboard Thống Kê Tổng Quan Hệ Thống Crawler
					</Title>
					<Text type="secondary">
						Báo cáo chi tiết về các nguồn thu thập, số lượng bản ghi và trạng thái vận hành
					</Text>
				</div>
				<Button
					type="primary"
					icon={<ReloadOutlined />}
					loading={crawlSourceDashboardLoading}
					onClick={() => handleGetCrawlSourceDashboard()}
				>
					Tải lại dữ liệu
				</Button>
			</div>

			{crawlSourceDashboardLoading && !crawlSourceDashboard ? (
				<Skeleton active paragraph={{ rows: 10 }} />
			) : (
				<Space direction="vertical" size="large" style={{ width: "100%" }}>
					<div>
						<GeneralOverview sourcesData={sourcesData} recordsData={recordsData} />
					</div>

					<div>
						<PlatformStats recordsData={recordsData} />
					</div>

					<DistributionBreakdown sourcesData={sourcesData} />

					<PerSourceTable
						perSourceList={perSourceList}
						loading={crawlSourceDashboardLoading}
						onReload={() => handleGetCrawlSourceDashboard()}
					/>
				</Space>
			)}
		</div>
	);
};

export default DashboardPage;
