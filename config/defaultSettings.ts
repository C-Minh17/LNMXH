import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const defaultSettings: LayoutSettings & {
	logo?: string;
	siderWidth: number;
} = {
	navTheme: 'light',
	layout: 'mix',
	contentWidth: 'Fluid',
	fixedHeader: true,
	fixSiderbar: true,
	colorWeak: false,
	logo: '/logo-text.svg',
	iconfontUrl: '',
	siderWidth: 220,
};

export default defaultSettings;
