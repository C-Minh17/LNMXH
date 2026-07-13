import { Divider, theme, Typography } from "antd"
import { useLocation } from "@umijs/max";
import StatisticHealthStatistics from "./components/health";

const { Title } = Typography;

const StatisticEconomyAndWork = () => {
  const { token } = theme.useToken();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  return (
    <>
      <Title level={2} style={{ color: token.colorPrimary, marginLeft: 20 }}>Y tế và chăm sóc sức khỏe {type === "external" ? "(bên ngoài)" : "(nội bộ)"}</Title>
      <StatisticHealthStatistics />
      <Divider />
    </>
  )
}

export default StatisticEconomyAndWork