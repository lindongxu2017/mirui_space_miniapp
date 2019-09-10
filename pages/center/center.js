var app = getApp();
Page({
	data: {
		userInfo: {},
		link: [
			{ url: '', title: '我的企业', icon: '/icon/company.png', path: '/pages/myBusiness/myBusiness' },
			{ url: '', title: '我的发布', icon: '/icon/release.png', path: '/pages/myRelease/myRelease' },
			{ url: '', title: '我的合同', icon: '/icon/contract.png', path: '/pages/myContract/myContract' },
			{ url: '', title: '我的缴费', icon: '/icon/pay.png', path: '/pages/myPay/myPay' },
			{ url: '', title: '设备报修', icon: '/icon/repair.png', path: '/pages/repair/repair' },
            { url: '', title: '投诉建议', icon: '/icon/suggest.png', path: '/pages/complaintList/complaintList' },
			{ url: '', title: '邀请朋友', icon: '/icon/share.png', path: '/pages/share/share' },
			{ url: '', title: '手机号码', icon: '/icon/tel.png', path: '/pages/setTel/setTel' },
		]
	},
	onShow() {
		if (app.globalData.userInfo.id) {
			app.fn.ajax('POST', { uid: app.globalData.userInfo.id }, app.api.center.getUserInfo, res => {
				res.data.userInfo['id'] = res.data.uid;
				app.globalData.userInfo = res.data.userInfo;
				var data = { userInfo: app.globalData.userInfo };
				data['link[0].path'] = '/pages/myBusiness/myBusiness';
				if (app.globalData.userInfo.type == 1) data['link[0].path'] = '/pages/myBusiness2/myBusiness2';
				this.setData(data);
			});
		} else {
			app.userInfoReadyCallback = () => {
				var data = { userInfo: app.globalData.userInfo };
				if (app.globalData.userInfo.type == 1) data['link[0].path'] = '/pages/myBusiness2/myBusiness2';
				this.setData(data);
			};
		}
	},
});