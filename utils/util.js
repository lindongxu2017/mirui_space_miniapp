
const requestApi = 'https://miract.mymiract.com/app';
var fn = {
	ajax: function (method, data, api, callback, error) {
		// wx.showLoading({
		//     title: '加载中...',
		// })
		wx.request({
			url: requestApi + api,
			data,
			method,
			header: {
				'content-type': 'application/x-www-form-urlencoded' // 默认值
			},
			success(res) {
				// console.log(res.data)
				fn.requestSatus(callback, error, res.data)
			},
			fail(error) {
				console.log(error)
			},
			complete() {
				// wx.hideLoading()
			}
		})
	},
	requestSatus: function (callback, error, res) {
		var code = parseInt(res.code) // 0异常 1成功
		switch (code) {
			case 1:
				if (callback) callback(res)
				break
			case 0:
				if (error) {
					error(res)
				} else {
					wx.showToast({
						title: res.msg,
						icon: 'none',
					});
				}
		}
	},
	login() {
		wx.login({
			success: result => {
				// 发送 result.code 到后台换取 openId, sessionKey, unionId
				// console.log(result)
				wx.getSetting({
					success: res => {
						if (res.authSetting['scope.userInfo']) {
							// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
							wx.getUserInfo({
								success: res => {
									const app = getApp()
									// console.log(res)
									// 可以将 res 发送给后台解码出 unionId
									// app.globalData.userInfo = res.userInfo
									// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
									// 所以此处加入 callback 以防止这种情况
									var data = {
										code: result.code,
										userinfo: res.rawData
									};
									if (app.superior_id) data.pid = app.superior_id;
									wx.request({
										method: 'POST',
										url: requestApi + '/user/getUserInfo',
										data: data,
										header: {
											'content-type': 'application/x-www-form-urlencoded' // 默认值
										},
										success(response) {
											app.globalData.userInfo = response.data.data.userInfo;
											app.globalData.result = response.data.data.userInfo.result;
											app.globalData.userInfo.id = response.data.data.uid;
											// app.globalData.userInfo.id = 25;
											if (app.userInfoReadyCallback) {
												app.userInfoReadyCallback(res)
											}
											if (app.setUserInfo) {
												app.setUserInfo(res)
											}
										}
									})
								}
							})
						} else {
							wx.navigateTo({
								url: '/pages/wxAuth/wxAuth',
							})
						}
					}
				})
			}
		})
	},
}

module.exports = fn