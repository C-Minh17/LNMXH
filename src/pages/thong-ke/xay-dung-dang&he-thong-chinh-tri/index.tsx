import { Divider, theme, Typography } from "antd"
import { useLocation } from "@umijs/max";
import StatisticCadreStatistics from "./components/cadreStatistics";

const { Title } = Typography;

const StatisticEconomyAndWork = () => {
  const { token } = theme.useToken();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  return (
    <>
      <Title level={2} style={{ color: token.colorPrimary, marginLeft: 20 }}>Xây dựng Đảng và Hệ thống chính trị{type === "external" ? "(bên ngoài)" : "(nội bộ)"}</Title>
      <StatisticCadreStatistics />
    </>
  )
}

export default StatisticEconomyAndWork