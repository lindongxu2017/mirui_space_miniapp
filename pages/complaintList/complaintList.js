const app = getApp()
import store from '../../store'
import create from '../../utils/create'
create(store, {

	data: {
		complaintList: [],
		loading: false,
		finish: false,
		noData: false
	},

	

	onShow: function () {
		this.store.data.complaintList = []
		this.update()
		this.getList()
	},

	getList() {
		if (this.data.loading || this.data.finish) {
			return
		}
		this.data.loading = true
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			page: Math.ceil(this.data.complaintList.length / 10) + 1,
			limit: 10
		}, app.api.index.complaintList, res => {
			this.data.loading = false
			this.store.data.complaintList = this.store.data.complaintList.concat(res.data)
			this.update()
			if (this.store.data.complaintList >= res.count) {
				this.data.finish = true
			}
			if (this.store.data.complaintList == 0) {
				this.setData({
					noData: true
				})
			}
		})
	},

    /**
     * 页面上拉触底事件的处理函数
     */
	onReachBottom: function () {
		this.getList()
	},
})