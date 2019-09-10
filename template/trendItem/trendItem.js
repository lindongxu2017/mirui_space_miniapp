// template/trendItem/trendItem.js
const app = getApp()
import create from '../../utils/create'
create({
    /**
     * 组件的属性列表
     */
    properties: {
        itemInfo: {
            type: Object,
            value: null,
            observer: function (newVal, oldVal, changePath) {
                // console.log(newVal)
                this.setData({
                    info: newVal
                })
            }
        },
        showDel: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal, changePath) {
                // console.log(newVal, oldVal, changePath)
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        info: null,
        showReply: false,
        inputValue: '',
        to_uid: '',
        to_username: '',
        userInfo: null,
        myTrendsList: [],
        trendsList: []
    },

    attached() {
        // 在组件实例进入页面节点树时执行
        if (app.globalData.userInfo.id) {
            this.data.userInfo = app.globalData.userInfo
        } else {
            app.setUserInfo = () => {
                this.data.userInfo = app.globalData.userInfo
            }
        }
    },

    ready () {
        this.store.data.trendsList.map((item, index) => {
            if (item.community_id == this.data.info.community_id) {
                this.data.itemIndex = index
            }
        })
    },

    /**
     * 组件的方法列表
     */
    methods: {
        dolike () {
            let num = this.data.info.praiseCount
            if (this.data.info.is_laud == 1) {
                num--
            } else {
                num++
            }
            this.setData({
                'info.is_laud': this.data.info.is_laud == 1 ? 0 : 1,
                'info.praiseCount': num
            }, () => {
                // console.log(this.store)
                this.store.data.trendsList[this.data.itemIndex].is_laud = this.data.info.is_laud
                this.store.data.trendsList[this.data.itemIndex].praiseCount = this.data.info.praiseCount
                this.update()
            })
            
            app.fn.ajax('POST', {
                community_id: this.data.info.community_id,
                uid: app.globalData.userInfo.id
            }, app.api.trends.dolike, res => {

            })
        },

        del () {
            const self = this
            wx.showModal({
                title: '提示',
                content: '确认要删除该动态吗',
                success(res) {
                    if (res.confirm) {
                        // console.log('用户点击确定')
                        let id = self.data.info.community_id
                        app.fn.ajax('POST', {
                            uid: app.globalData.userInfo.id,
                            community_id: id
                        }, app.api.trends.del, res => {
							console.log(JSON.parse(JSON.stringify(self.store.data)), 11111);
						   
						    let trends_current = self.getCurrent(self.store.data.trendsList);
                            let myTrends_current = self.getCurrent(self.store.data.myTrendsList);
                            self.store.data.trendsList.splice(trends_current, 1);
                            self.store.data.myTrendsList.splice(myTrends_current, 1);
                            self.update();

							console.log(JSON.parse(JSON.stringify(self.store.data)), 11111);
                        })
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        },

        getCurrent (arr) {
            let current = 0
            arr.map((item, index) => {
                if (item.community_id == this.data.info.community_id) {
                    current = index
                }
            })
            return current
        },

        preView (e) {
            const self = this
            let src = e.currentTarget.dataset.src
            wx.previewImage({
                current: src,
                urls: self.data.info.img_arr
            })
        },
        onblur () {
            this.setData({
                showReply: false
            })
            this.triggerEvent('release', true)
        },
        oninput(event) {
            this.setData({
                inputValue: event.detail.value
            })
        },
        openInput () {
            this.setData({
                showReply: true,
                to_uid: '',
                to_username: ''
            })
            this.triggerEvent('release', false)
        },
        setUid (e) {
            let item = e.currentTarget.dataset.item
            this.setData({
                showReply: true,
                to_uid: item.to_uid == 0 ? item.uid : item.to_uid,
                to_username: item.to_username ? item.to_username : item.username
            })
            this.triggerEvent('release', false)
        },
        sendMessag () {

            if (this.data.inputValue == '') {
                return
            }

            let postData = {
                community_id: this.data.info.community_id,
                uid: app.globalData.userInfo.id,
                content: this.data.inputValue
            }
            if (this.data.to_uid) {
                postData.to_uid = this.data.to_uid
                if (this.data.to_uid == this.data.userInfo.id) {
                    this.setData({
                        showReply: false
                    })
                    wx.showToast({
                        title: '不能回复自己的评论',
                        icon: 'none'
                    })
                    return
                }
            }
            app.fn.ajax('POST', postData, app.api.trends.reply, res => {
                if (!this.data.userInfo || !this.data.userInfo.username) {
                    this.data.userInfo = app.globalData.userInfo
                }
                let message = {
                    username: this.data.userInfo.username,
                    uid: this.data.userInfo.id,
                    content: this.data.inputValue
                }
                if (this.data.to_uid) {
                    message.to_uid = this.data.to_uid
                    message.to_username = this.data.to_username
                }
                let arr = JSON.parse(JSON.stringify(this.data.info.comments))
                arr.push(message)
                // console.log(arr)
                this.setData({
                    'info.comments': arr
                }, () => {
                    this.setData({
                        to_uid: '',
                        to_username: '',
                        inputValue: ''
                    })
                    this.store.data.trendsList[this.data.itemIndex].comments = arr
                    this.update()
                })
            })
        }
    }
})
