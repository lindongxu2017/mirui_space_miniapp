// template/placeItem/placeItem.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        itemInfo: {
            type: Object,
            value: null,
            observer: function (newVal, oldVal, chengPath) {
                this.setData({
                    info: newVal
                })
            }
        },
		title: {
			type: String,
		},
    },

    /**
     * 组件的初始数据
     */
    data: {
        info: {
            imgUrl: '/icon/demo.jpg',
            distance: 3.5,
            name: '501会议室',
            capacity: 10,
            label: ['白板', '电视', '投影仪'],
            location: '广东省深圳市龙岗区坂田街道03富奇创意大厦601'
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
