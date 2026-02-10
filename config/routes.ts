export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
		],
	},

	// GROUP TITLE
	// {
	// 	name: 'DashboardGroup',
	// 	path: '/__group__/dashboard',
	// 	disabled: true,
	// },

	///////////////////////////////////

	// DEFAULT MENU
	{
		name: 'dashboard',
		path: '/dashboard',
		component: './dashboard',
		icon: 'HomeOutlined',
	},
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	// new config start

	{
		name: "Quản lý bài viết",
		path: "/quan-ly-bai-viet",
		icon: "CopyOutlined",
		routes: [
			{
				name: 'Nội bộ',
				path: '/quan-ly-bai-viet/internal',
				component: './admin/quan-ly-bai-viet/internal',
			},
			{
				name: 'Bên ngoài',
				path: '/quan-ly-bai-viet/external',
				component: './admin/quan-ly-bai-viet/external',
			},
			// {
			// 	name: 'Quản lý theo nguồn',
			// 	path: '/quan-ly-bai-viet/source',
			// 	component: './admin/quan-ly-bai-viet/quan-ly-theo-nguon',
			// },
			// {
			// 	name: 'Quản lý nguồn',
			// 	path: '/quan-ly-bai-viet/quan-ly-nguon',
			// 	component: './admin/quan-ly-bai-viet/quan-ly-nguon',
			// },
			{
				name: 'Tìm kiếm bài viết',
				path: '/quan-ly-bai-viet/crawl',
				component: './admin/quan-ly-bai-viet/crawl',
			},
		]
	},
	{
		name: "Quản lý nguồn",
		path: "/social-sources",
		icon: "AppstoreOutlined",
		component: './admin/quan-ly-nguon',
	},
	{
		name: "Thống kê bên ngoài",
		path: "/thong-ke/external",
		icon: "GlobalOutlined",
		routes: [
			{
				name: 'Kinh tế & việc làm',
				path: '/thong-ke/external/kinh-te&viec-lam',
				component: './admin/thong-ke/kinh-te&viec-lam',
			},
			{
				name: 'Y tế & Chăm sóc sức khỏe',
				path: '/thong-ke/external/y-te&cham-soc-suc-khoe',
				component: './admin/thong-ke/y-te&cham-soc-suc-khoe',
			},
			{
				name: 'Giáo dục & đào tạo',
				path: '/thong-ke/external/giao-duc&dao-tao',
				component: './admin/thong-ke/giao-duc&dao-tao',
			},
			// {
			// 	name: 'Hạ tầng & giao thông',
			// 	path: '/thong-ke/external/ha-tang&giao-thong',
			// 	component: './admin/thong-ke/ha-tang&giao-thong',
			// },
			// {
			// 	name: 'Môi trường & biến đổi khí hậu',
			// 	path: '/thong-ke/external/moi-truong&bien-doi-khi-hau',
			// 	component: './admin/thong-ke/moi-truong&bien-doi-khi-hau',
			// },
			// {
			// 	name: 'An sinh xã hội & chính sách',
			// 	path: '/thong-ke/external/an-sinh-xa-hoi&chinh-sach',
			// 	component: './admin/thong-ke/an-sinh-xa-hoi&chinh-sach',
			// },
			{
				name: 'An ninh trật tự & quốc phòng',
				path: '/thong-ke/external/an-ninh-trat-tu&quoc-phong',
				component: './admin/thong-ke/an-ninh-trat-tu&quoc-phong',
			},
			{
				name: 'Hành chính công & quản lý nhà nước',
				path: '/thong-ke/external/hanh-chinh-cong&quan-ly-nha-nuoc',
				component: './admin/thong-ke/hanh-chinh-cong&quan-ly-nha-nuoc',
			},
			{
				name: 'Xây dựng Đảng & hệ thống chính trị',
				path: '/thong-ke/external/xay-dung-dang&he-thong-chinh-tri',
				component: './admin/thong-ke/xay-dung-dang&he-thong-chinh-tri',
			},
			{
				name: 'Văn hóa thể thao & đời sống tinh thần',
				path: '/thong-ke/external/van-hoa-the-thao&doi-song-tinh-than',
				component: './admin/thong-ke/van-hoa-the-thao&doi-song-tinh-than',
			},
		]
	},
	{
		name: "Thống kê nội bộ",
		path: "/thong-ke/internal",
		icon: "BarChartOutlined",
		routes: [
			{
				name: 'Kinh tế & việc làm',
				path: '/thong-ke/internal/kinh-te&viec-lam',
				component: './admin/thong-ke/kinh-te&viec-lam',
			},
			{
				name: 'Y tế & Chăm sóc sức khỏe',
				path: '/thong-ke/internal/y-te&cham-soc-suc-khoe',
				component: './admin/thong-ke/y-te&cham-soc-suc-khoe',
			},
			{
				name: 'Giáo dục & đào tạo',
				path: '/thong-ke/internal/giao-duc&dao-tao',
				component: './admin/thong-ke/giao-duc&dao-tao',
			},
			// {
			// 	name: 'Hạ tầng & giao thông',
			// 	path: '/thong-ke/internal/ha-tang&giao-thong',
			// 	component: './admin/thong-ke/ha-tang&giao-thong',
			// },
			// {
			// 	name: 'Môi trường & biến đổi khí hậu',
			// 	path: '/thong-ke/internal/moi-truong&bien-doi-khi-hau',
			// 	component: './admin/thong-ke/moi-truong&bien-doi-khi-hau',
			// },
			// {
			// 	name: 'An sinh xã hội & chính sách',
			// 	path: '/thong-ke/internal/an-sinh-xa-hoi&chinh-sach',
			// 	component: './admin/thong-ke/an-sinh-xa-hoi&chinh-sach',
			// },
			{
				name: 'An ninh trật tự & quốc phòng',
				path: '/thong-ke/internal/an-ninh-trat-tu&quoc-phong',
				component: './admin/thong-ke/an-ninh-trat-tu&quoc-phong',
			},
			{
				name: 'Hành chính công & quản lý nhà nước',
				path: '/thong-ke/internal/hanh-chinh-cong&quan-ly-nha-nuoc',
				component: './admin/thong-ke/hanh-chinh-cong&quan-ly-nha-nuoc',
			},
			{
				name: 'Xây dựng Đảng & hệ thống chính trị',
				path: '/thong-ke/internal/xay-dung-dang&he-thong-chinh-tri',
				component: './admin/thong-ke/xay-dung-dang&he-thong-chinh-tri',
			},
			{
				name: 'Văn hóa thể thao & đời sống tinh thần',
				path: '/thong-ke/internal/van-hoa-the-thao&doi-song-tinh-than',
				component: './admin/thong-ke/van-hoa-the-thao&doi-song-tinh-than',
			},
		]
	},

	{
		name: "chi tiết bài viết",
		path: "/quan-ly-bai-viet/:post_id",
		component: "./admin/quan-ly-bai-viet/bai-viet-chi-tiet",
		hideInMenu: true,
	},


	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		path: '/*',
		component: './exception/404',
		layout: false,
	},
];
