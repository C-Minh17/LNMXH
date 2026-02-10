import { Divider, theme, Typography } from "antd"
import { useLocation } from "@umijs/max";
import StatisticSecurity from "./components/security";

const { Title } = Typography;

const StatisticEconomyAndWork = () => {
  const { token } = theme.useToken();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  return (
    <>
      <Title level={2} style={{ color: token.colorPrimary, marginLeft: 20 }}>An ninh trật tự và Quốc phòng{type === "external" ? "(bên ngoài)" : "(nội bộ)"}</Title>
      <StatisticSecurity />
    </>
  )
}

export default StatisticEconomyAndWork