import { Divider, theme, Typography } from "antd"
import StatisticGrdp from "./components/grdp";
import StatisticFdi from "./components/fdi";
import { useLocation } from "@umijs/max";
import StatisticIip from "./components/iip";
import StatisticPii from "./components/pii";
import StatisticCpi from "./components/cpi";

const { Title } = Typography;

const StatisticEconomyAndWork = () => {
  const { token } = theme.useToken();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  return (
    <>
      <Title level={2} style={{ color: token.colorPrimary, marginLeft: 20 }}>Kinh tế & việc làm {type === "external" ? "(bên ngoài)" : "(nội bộ)"}</Title>
      <StatisticGrdp />
      <Divider />
      <StatisticFdi />
      <Divider />
      <StatisticIip />
      <Divider />
      <StatisticPii />
      <Divider />
      <StatisticCpi />
    </>
  )
}

export default StatisticEconomyAndWork