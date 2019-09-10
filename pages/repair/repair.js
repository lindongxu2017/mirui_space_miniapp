// pages/repair/repair.js
const app = getApp()
import store from '../../store'
import create from '../../utils/create'
create(store, {

    data: {
        repairList: [],
        loading: false,
        finish: false,
        noData: false
    },

    onLoad: function (options) {
        this.store.data.repairList = []
        this.update()
        this.getList()
    },

    onShow: function () {

    },

    getList () {
        if (this.data.loading || this.data.finish) {
            return
        }
        this.data.loading = true
        app.fn.ajax('POST', {
            uid: app.globalData.userInfo.id,
            page: Math.ceil(this.data.repairList.length / 10) + 1,
            limit: 10
        }, app.api.index.repairList, res => {
            this.data.loading = false
            this.store.data.repairList = this.store.data.repairList.concat(res.data)
            this.update()
            if (this.store.data.repairList >= res.count) {
                this.data.finish = true
            }
            if (this.store.data.repairList == 0) {
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