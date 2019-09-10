// template/contractItem/contractItem.js
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
            avatar: '/icon/demo.jpg',
            title: '510租赁户合同',
            lease: '江南烟雨',
            phone: '18718571732',
            startTime: '2019/01/01',
            endTime: '2019/03/01',
            deposit: '4860.00',
            rent: '2840'
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
