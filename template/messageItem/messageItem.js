// template/messageItem/messageItem.js
Component({
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
        info: {
            // title: '缴费成功通知缴费成功通知缴费成功通知缴费成功通知缴费成功通知',
            // create_time: '05.03  13：06',
            // content: '您的资料已成功通过了我们的系统审核，请耐心等待 仿款通知！',
            // status: 1
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
