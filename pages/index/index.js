const app = getApp()
import store from '../../store'
import create from '../../utils/create'
create(store, {
	data: {
		bannerList: [],
		accessList: [
			{ iconPath: '/icon/access-1.png', name: '预约参观' },
			{ iconPath: '/icon/access-2.png', name: '订会议室', path: '/pages/place/place?title=订会议室&nextTitle=会议室详情&type=2' },
			{ iconPath: '/icon/access-3.png', name: '订茶室', path: '/pages/place/place?title=订茶室&nextTitle=茶室详情&type=1' },
			{ iconPath: '/icon/access-4.png', name: '预订场地', path: '/pages/place/place?title=预订场地&nextTitle=场地详情&type=3' },
			{ iconPath: '/icon/access-5.png', name: '米瑞服务', path: '/pages/serviceList/serviceList' },
			{ iconPath: '/icon/access-6.png', name: '社区指南', path: '/pages/guide/guide' },
			{ iconPath: '/icon/access-7.png', name: '设备报修', path: '/pages/repair/repair' },
			{ iconPath: '/icon/access-9.png', name: '我的缴费', path: '/pages/myPay/myPay' },
		],
		bannerList2: [],
		trendsList: [],
	},
	onLoad(options) {
		if (options.id) app.superior_id = options.id;
		this.getBanner()
		this.getBanner2()
		if (app.globalData.userInfo.id) {
            if (this.store.data.trendsList.length == 0) {
                this.getList()
            }
		} else {
			app.userInfoReadyCallback = () => {
                if (this.store.data.trendsList.length == 0) {
                    this.getList()
                }
			}
		}
	},

	onShow() {
		app.indexPage = this;
		app.getUnpaidNumber();
	},

	onReachBottom: function () {

	},

	getBanner() {
		app.fn.ajax('POST', {}, app.api.index.banner, res => {
			this.setData({ bannerList: res.list });
		});
	},

	getBanner2() {
		app.fn.ajax('POST', { type: 3 }, app.api.discover.banner, res => {
			this.setData({
				bannerList2: res.data
			})
		})
	},

	getList() {
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			page: 1,
			limit: 10
		}, app.api.trends.list, res => {
			this.store.data.trendsList = res.data
			this.update()
		})
	},
	route() {
		var timer = setInterval(() => {
			if (app.globalData.userInfo.id) {
				app.fn.ajax('POST', { uid: app.globalData.userInfo.id }, app.api.index.is_yuyue, res => {
					wx.navigateTo({ url: res.data.is_data == 1 ? '/pages/appointmentVisit2/appointmentVisit2' : '/pages/appointmentVisit/appointmentVisit' });
				});
				clearInterval(timer);
			}
		}, 50);
	},
    
    onShareAppMessage: function (res) {
        return {
            title: '米瑞空间',
            path: '/pages/index/index'
        }
    }
})