// pages/trendsRelease/trendsRelease.js
const app = getApp()
import store from '../../store'
import create from '../../utils/create'
create(store, {

    /**
     * 页面的初始数据
     */
    data: {
        preViewList: [],
        textareaVal: '',
        imgArr: [],

		loading: false,
    },

    onLoad: function (options) {

    },

    onShow: function () {

    },

    uploadImg() {
        const self = this
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                let arr = self.data.preViewList.concat(tempFilePaths)
                self.setData({ preViewList: arr })
                self.upload(tempFilePaths)
            }
        })
    },

    upload (arr) {
        const self = this
        wx.uploadFile({
            url: app.requestApi + '/Base/uploadOnePic', // 仅为示例，非真实的接口地址
            filePath: arr[0],
            name: 'image',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                const data = JSON.parse(res.data)
                let imgArr = [].concat(self.data.imgArr)
                imgArr.push(data.src)
                self.setData({
                    imgArr
                })
                arr.shift()
                if (arr.length > 0) {
                    self.upload(arr)
                }
            }
        })
    },

    preview(e) {
        const self = this
        let index = e.currentTarget.dataset.index
        wx.previewImage({
            current: self.data.preViewList[index], // 当前显示图片的http链接
            urls: self.data.preViewList // 需要预览的图片http链接列表
        })
    },

    del(e) {
        let index = e.currentTarget.dataset.index
        let arr = [].concat(this.data.preViewList)
        let imgArr = [].concat(this.data.imgArr)
        arr.splice(index, 1)
        imgArr.splice(index, 1)
        this.setData({
            preViewList: arr,
            imgArr
        })
    },

    bindinput (e) {
        this.setData({ textareaVal: e.detail.value })
    },

    confirm () {
        if (this.data.textareaVal == '') {
            wx.showToast({
                title: '请输入发布内容',
                icon: 'none'
            })
            return false
        }
		if (this.data.loading) return;
		this.data.loading = true;
        app.fn.ajax('POST', {
            content: this.data.textareaVal,
            img_arr: this.data.imgArr.join(','),
            uid: app.globalData.userInfo.id
        }, app.api.trends.release, res => {
            wx.showToast({
                title: '发布成功',
                icon: 'none'
            })
            this.store.data.trendsList = [];
			this.store.data.myTrendsList = [];
            this.getList2()
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
	getList2() {
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			page: 1,
			limit: 10
		}, app.api.center.myPublish, res => {
			this.store.data.myTrendsList = res.data
            this.update()
            this.getList()
			this.data.loading = false;
            wx.navigateBack()
		})
	}
})