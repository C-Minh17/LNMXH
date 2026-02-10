import { Divider, theme, Typography } from "antd"
import { useLocation } from "@umijs/max";
import StatisticCultureLifestyle from "./components/CultureLifestyle";

const { Title } = Typography;

const StatisticEconomyAndWork = () => {
  const { token } = theme.useToken();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  return (
    <>
      <Title level={2} style={{ color: token.colorPrimary, marginLeft: 20 }}>Văn hóa, Thể thao và Đời sống tinh thần{type === "external" ? "(bên ngoài)" : "(nội bộ)"}</Title>
      <StatisticCultureLifestyle />
    </>
  )
}

export default StatisticEconomyAndWork