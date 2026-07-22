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
		name: 'Tổng quan',
		path: '/dashboard',
		component: './dashboard',
		icon: 'DashboardOutlined',
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
		name: "quan-ly-bai-viet-theo-nguon",
		path: "/social-sources/:data_type",
		component: "./quan-ly-nguon/quan-ly-bai-viet-theo-nguon",
		hideInMenu: true,
	},
	{
		name: "Quản lý crawl",
		path: "/quan-ly-crawl",
		icon: "CloudSyncOutlined",
		component: './Quan-ly-crawl/crawl-source',
	},
	{
		name: "Quản lý bài viết",
		path: "/quan-ly-bai-viet",
		icon: "FileTextOutlined",
		routes: [
			{
				path: '/quan-ly-bai-viet',
				redirect: '/quan-ly-bai-viet/internal',
			},
			{
				name: 'Nội bộ',
				path: '/quan-ly-bai-viet/internal',
				component: './quan-ly-bai-viet/internal',
			},
			{
				name: 'Bên ngoài',
				path: '/quan-ly-bai-viet/external',
				component: './quan-ly-bai-viet/external',
			},
			// {
			// 	name: 'Quản lý theo nguồn',
			// 	path: '/quan-ly-bai-viet/source',
			// 	component: './quan-ly-bai-viet/quan-ly-theo-nguon',
			// },
			// {
			// 	name: 'Quản lý nguồn',
			// 	path: '/quan-ly-bai-viet/quan-ly-nguon',
			// 	component: './quan-ly-bai-viet/quan-ly-nguon',
			// },
			// {
			// 	name: 'Tìm kiếm bài viết',
			// 	path: '/quan-ly-bai-viet/crawl',
			// 	component: './quan-ly-bai-viet/crawl',
			// },
		]
	},
	{
		name: "Danh sách nguồn",
		path: "/social-sources",
		icon: "AppstoreOutlined",
		component: './quan-ly-nguon',
	},
	// {
	// 	name: "Quản lý crawl",
	// 	path: "/quan-ly-crawl",
	// 	icon: "CopyOutlined",
	// 	routes: [
	// 		{
	// 			name: 'Nguồn crawl tin bài',
	// 			path: '/quan-ly-crawl/crawl-source',
	// 			component: './Quan-ly-crawl/crawl-source',
	// 		},
	// 		{
	// 			name: 'Crawl từ facebook',
	// 			path: '/quan-ly-crawl/crawl-facebook',
	// 			component: './Quan-ly-crawl/crawl-facebook',
	// 		},
	// 		{
	// 			name: 'Crawl từ tiktok',
	// 			path: '/quan-ly-crawl/crawl-tiktok',
	// 			component: './Quan-ly-crawl/crawl-tiktok',
	// 		},
	// 	]
	// }
	{
		name: "chi tiết bài viết",
		path: "/quan-ly-bai-viet/:post_id",
		component: "./quan-ly-bai-viet/bai-viet-chi-tiet",
		hideInMenu: true,
	},
	{
		name: "Thống kê bên ngoài",
		path: "/thong-ke/external",
		icon: "GlobalOutlined",
		routes: [
			{
				name: 'Kinh tế & việc làm',
				path: '/thong-ke/external/kinh-te&viec-lam',
				component: './thong-ke/kinh-te&viec-lam',
			},
			{
				name: 'Y tế & Chăm sóc sức khỏe',
				path: '/thong-ke/external/y-te&cham-soc-suc-khoe',
				component: './thong-ke/y-te&cham-soc-suc-khoe',
			},
			{
				name: 'Giáo dục & đào tạo',
				path: '/thong-ke/external/giao-duc&dao-tao',
				component: './thong-ke/giao-duc&dao-tao',
			},
			// {
			// 	name: 'Hạ tầng & giao thông',
			// 	path: '/thong-ke/external/ha-tang&giao-thong',
			// 	component: './thong-ke/ha-tang&giao-thong',
			// },
			// {
			// 	name: 'Môi trường & biến đổi khí hậu',
			// 	path: '/thong-ke/external/moi-truong&bien-doi-khi-hau',
			// 	component: './thong-ke/moi-truong&bien-doi-khi-hau',
			// },
			// {
			// 	name: 'An sinh xã hội & chính sách',
			// 	path: '/thong-ke/external/an-sinh-xa-hoi&chinh-sach',
			// 	component: './thong-ke/an-sinh-xa-hoi&chinh-sach',
			// },
			{
				name: 'An ninh trật tự & quốc phòng',
				path: '/thong-ke/external/an-ninh-trat-tu&quoc-phong',
				component: './thong-ke/an-ninh-trat-tu&quoc-phong',
			},
			{
				name: 'Hành chính công & quản lý nhà nước',
				path: '/thong-ke/external/hanh-chinh-cong&quan-ly-nha-nuoc',
				component: './thong-ke/hanh-chinh-cong&quan-ly-nha-nuoc',
			},
			{
				name: 'Xây dựng Đảng & hệ thống chính trị',
				path: '/thong-ke/external/xay-dung-dang&he-thong-chinh-tri',
				component: './thong-ke/xay-dung-dang&he-thong-chinh-tri',
			},
			{
				name: 'Văn hóa thể thao & đời sống tinh thần',
				path: '/thong-ke/external/van-hoa-the-thao&doi-song-tinh-than',
				component: './thong-ke/van-hoa-the-thao&doi-song-tinh-than',
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
				component: './thong-ke/kinh-te&viec-lam',
			},
			{
				name: 'Y tế & Chăm sóc sức khỏe',
				path: '/thong-ke/internal/y-te&cham-soc-suc-khoe',
				component: './thong-ke/y-te&cham-soc-suc-khoe',
			},
			{
				name: 'Giáo dục & đào tạo',
				path: '/thong-ke/internal/giao-duc&dao-tao',
				component: './thong-ke/giao-duc&dao-tao',
			},
			// {
			// 	name: 'Hạ tầng & giao thông',
			// 	path: '/thong-ke/internal/ha-tang&giao-thong',
			// 	component: './thong-ke/ha-tang&giao-thong',
			// },
			// {
			// 	name: 'Môi trường & biến đổi khí hậu',
			// 	path: '/thong-ke/internal/moi-truong&bien-doi-khi-hau',
			// 	component: './thong-ke/moi-truong&bien-doi-khi-hau',
			// },
			// {
			// 	name: 'An sinh xã hội & chính sách',
			// 	path: '/thong-ke/internal/an-sinh-xa-hoi&chinh-sach',
			// 	component: './thong-ke/an-sinh-xa-hoi&chinh-sach',
			// },
			{
				name: 'An ninh trật tự & quốc phòng',
				path: '/thong-ke/internal/an-ninh-trat-tu&quoc-phong',
				component: './thong-ke/an-ninh-trat-tu&quoc-phong',
			},
			{
				name: 'Hành chính công & quản lý nhà nước',
				path: '/thong-ke/internal/hanh-chinh-cong&quan-ly-nha-nuoc',
				component: './thong-ke/hanh-chinh-cong&quan-ly-nha-nuoc',
			},
			{
				name: 'Xây dựng Đảng & hệ thống chính trị',
				path: '/thong-ke/internal/xay-dung-dang&he-thong-chinh-tri',
				component: './thong-ke/xay-dung-dang&he-thong-chinh-tri',
			},
			{
				name: 'Văn hóa thể thao & đời sống tinh thần',
				path: '/thong-ke/internal/van-hoa-the-thao&doi-song-tinh-than',
				component: './thong-ke/van-hoa-the-thao&doi-song-tinh-than',
			},
		]
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
