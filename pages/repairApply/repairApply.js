// pages/repairApply/repairApply.js
const app = getApp()
import store from '../../store'
import create from '../../utils/create'
create(store, {

    data: {
        textareaVal: '',
        typeList: [],
        preViewList: [],
        selectValText: '请选择',
        selectVal: 0,
        imgs: []
    },

    onLoad(options) {
		if (app.globalData.userInfo.mobile.length != 11) {
			wx.showModal({
				title: '温馨提示',
				content: '绑定手机号码才能申请维修',
				confirmText: '去绑定',
				success: res => {
					if (res.confirm) {
						wx.redirectTo({
							url: '/pages/setTel/setTel?from=/pages/repairApply/repairApply',
						});
					} else {
						wx.navigateBack();
					}
				},
			});
		}
        this.getType();
    },
    
    onShow: function () {

    },

    getType () {
        app.fn.ajax('POST', {}, app.api.index.repairType, res => {
            // console.log(res)
            this.setData({
                typeList: res.data
            })
        })
    },

    bindPickerChange (event) {
        // console.log(event.detail)
        let index = event.detail.value
        this.setData({
            selectVal: this.data.typeList[index].warranty_type_id,
            selectValText: this.data.typeList[index].name
        })
    },

    inputText (event) {
        // console.log()
        this.setData({
            textareaVal: event.detail.value
        })
    },

    uploadImg () {
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

    upload(arr) {
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
                let imgArr = [].concat(self.data.imgs)
                imgArr.push(data.src)
                self.setData({
                    imgs: imgArr
                })
                arr.shift()
                if (arr.length > 0) {
                    self.upload(arr)
                }
            }
        })
    },

    preview (e) {
        const self = this
        let index = e.currentTarget.dataset.index
        wx.previewImage({
            current: self.data.preViewList[index], // 当前显示图片的http链接
            urls: self.data.preViewList // 需要预览的图片http链接列表
        })
    },

    del (e) {
        let index = e.currentTarget.dataset.index
        let arr = [].concat(this.data.preViewList)
        arr.splice(index, 1)
        let imgArr = [].concat(this.data.imgs)
        imgArr.splice(index, 1)
        this.setData({
            preViewList: arr,
            imgs: imgArr
        })
    },
    
    confirm () {
        console.log(this.data.selectVal)
        console.log(this.data.textareaVal)
        console.log(this.data.imgs)
        if (this.data.selectVal == '' || this.data.textareaVal == '') {
            wx.showToast({
                title: '请完善信息',
                icon: 'none'
            })
            return
        }
        app.fn.ajax('POST', {
            uid: app.globalData.userInfo.id,
            warranty_type_id: this.data.selectVal,
            describe: this.data.textareaVal,
            img_arr: this.data.imgs.join(',')
        }, app.api.index.applyRepair, res => {
            wx.showToast({
                title: '提交成功',
                icon: 'none'
            })
            this.getList()
        })
    },

    getList() {
        app.fn.ajax('POST', {
            uid: app.globalData.userInfo.id,
            page: 1,
            limit: 10
        }, app.api.index.repairList, res => {
            this.store.data.repairList = []
            this.store.data.repairList = this.store.data.repairList.concat(res.data)
            this.update()
            wx.navigateBack()
        })
    },
})