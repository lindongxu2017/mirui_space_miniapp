// template/serviceItem/serviceItem.js
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
        info: {}
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
