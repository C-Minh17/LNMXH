import { Divider, theme, Typography } from "antd"
import { useLocation } from "@umijs/max";
import StatisticHighschoolGraduationDetail from "./components/StatisticHighschoolGraduation";
import StatisticTvetEmployment from "./components/StatisticTvetEmployment";


const { Title, Text } = Typography;

const StatisticEconomyAndWork = () => {
  const { token } = theme.useToken();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const type = pathSegments[2];
  return (
    <>
      <Title level={2} style={{ color: token.colorPrimary, marginLeft: 20 }}>Giáo dục và Đào tạo {type === "external" ? "(bên ngoài)" : "(nội bộ)"}</Title>
      <StatisticHighschoolGraduationDetail />
      <Divider />
      <StatisticTvetEmployment />
    </>
  )
}

export default StatisticEconomyAndWork