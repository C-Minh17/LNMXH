import { Divider, theme, Typography } from "antd"

import { useLocation } from "@umijs/max";
import StatisticDigitalTransformation from "./components/digitalTransformation";
import StatisticParIndex from "./components/parIndex";
import StatisticSipas from "./components/sipas";

const { Title, Text } = Typography;

const StatisticEconomyAndWork = () => {
  const { token } = theme.useToken();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  return (
    <>
      <Title level={2} style={{ color: token.colorPrimary, marginLeft: 20 }}>Hành chính công và quản lý nhà nước {type === "external" ? "(bên ngoài)" : "(nội bộ)"}</Title>
      <StatisticDigitalTransformation />
      <Divider />
      <StatisticParIndex />
      <Divider />
      <StatisticSipas />
    </>
  )
}

export default StatisticEconomyAndWork