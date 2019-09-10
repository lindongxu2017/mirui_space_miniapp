// template/repair/repair.js
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
                this.setData({
                    info: newVal
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        info: {},
        showItem: true,
        itemIndex: ''
    },

    ready () {
        this.store.data.repairList.map((item, index) => {
            if (item.warranty_claim_id == this.data.info.warranty_claim_id) {
                this.data.itemIndex = index
            }
        })
    },

    /**
     * 组件的方法列表
     */
    methods: {
        cancelPre () {
            const self = this
            wx.showModal({
                title: '提示',
                content: '是否取消该申请',
                success(res) {
                    if (res.confirm) {
                        self.cancel()
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        },
        cancel () {
            // console.log(this.data.info)
            app.fn.ajax('POST', {
                warranty_claim_id: this.data.info.warranty_claim_id
            }, app.api.index.cancelRepair, res => {
                this.store.data.repairList.splice(this.data.itemIndex, 1)
                this.update()
            })
        },
        preview (e) {
            const self = this
            let index = e.currentTarget.dataset.index
            wx.previewImage({
                current: self.data.info.img_arr[index],
                urls: self.data.info.img_arr
            })
        }
    }
})
