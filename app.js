const fn = require('./utils/util.js');
const api = require('./utils/api.js');
App({
    onLaunch() {
        fn.login();
		this.getMessageStatus();
		this.getUnpaidNumber();
    },
    globalData: {
        userInfo: {},
		result: {},
    },
    requestApi: 'https://miract.mymiract.com/app',
    fn, 
	api,
    latitude: '',
    longitude: '',
	superior_id: '',
	getMessageStatus() {
		var fn = () => {
			if (this.globalData.userInfo.id) {
				this.fn.ajax('POST', { uid: this.globalData.userInfo.id }, this.api.message.getUnread, res => {
					if (res.count > 0) {
						wx.showTabBarRedDot({ index: 3 });
					} else {
						wx.hideTabBarRedDot({ index: 3 });
					}
					setTimeout(() => {
						this.getMessageStatus();
					}, 3000);
				});
			} else {
				setTimeout(fn, 100);
			}
		};
		fn();
	},
	indexPage: null,
	unpaidNumber: 0,
	getUnpaidNumberTimer: null,
	getUnpaidNumber() {
		var fn = () => {
			if (this.globalData.userInfo.id) {
				clearTimeout(this.getUnpaidNumberTimer);
				this.fn.ajax('POST', { 
					uid: this.globalData.userInfo.id, 
					type: 2, 
				}, this.api.center.bills, res => {
					this.unpaidNumber = res.count;
					if (this.indexPage) this.indexPage.setData({ unpaidNumber: this.unpaidNumber });
					this.getUnpaidNumberTimer = setTimeout(() => {
						this.getUnpaidNumber();
					}, 3000);
				});
			} else {
				setTimeout(fn, 100);
			}
		};
		fn();
	},


	page1: [
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208406142&di=eb092ceb284e817ce440cae3a02119d5&imgtype=0&src=http%3A%2F%2Fk.zol-img.com.cn%2Fsjbbs%2F7692%2Fa7691515_s.jpg',
			title: '标题1',
			content: '内容1',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208709212&di=0758a0c1f4baee0ce3a2fc9702b0b99a&imgtype=0&src=http%3A%2F%2Fpic37.nipic.com%2F20140113%2F8800276_184927469000_2.png',
			title: '标题2',
			content: '内容2',
		},

		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776347&di=14400041080dfc3f03ea0cdb951f0173&imgtype=0&src=http%3A%2F%2Fpic15.nipic.com%2F20110628%2F1369025_192645024000_2.jpg',
			title: '标题3',
			content: '内容3',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776346&di=7242538919f694bb974e8d936160d097&imgtype=0&src=http%3A%2F%2Fpic37.nipic.com%2F20140110%2F17563091_221827492154_2.jpg',
			title: '标题4',
			content: '内容4',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776346&di=7ada11c117633b6fdfb7cc60b171778a&imgtype=0&src=http%3A%2F%2Fpic1.nipic.com%2F2009-02-17%2F200921701719614_2.jpg',
			title: '标题5',
			content: '内容5',
		},
	],
	page2: [
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776346&di=2033db75ec90767a9913737f1e8d35ec&imgtype=0&src=http%3A%2F%2Fimg3.redocn.com%2Ftupian%2F20150312%2Fhaixinghezhenzhubeikeshiliangbeijing_3937174.jpg',
			title: '标题6',
			content: '内容6',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776346&di=15371bca2d5fa24abcf231256fa8bde8&imgtype=0&src=http%3A%2F%2Fpic9.nipic.com%2F20100923%2F2531170_140325352643_2.jpg',
			title: '标题7',
			content: '内容7',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776345&di=0eb914dd4fca40f3dc0ebb727a1e82ec&imgtype=0&src=http%3A%2F%2Fpic25.nipic.com%2F20121205%2F10197997_003647426000_2.jpg',
			title: '标题8',
			content: '内容8',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776345&di=f5aa274569d507858b4a81436e237a08&imgtype=0&src=http%3A%2F%2Fpic32.nipic.com%2F20130902%2F13395269_103525238102_2.jpg',
			title: '标题9',
			content: '内容9',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776345&di=931d676bf7ee7b2d8a33decb8ae424b7&imgtype=0&src=http%3A%2F%2Fpic40.nipic.com%2F20140331%2F9469669_142840860000_2.jpg',
			title: '标题10',
			content: '内容10',
		},
	],

	page3: [
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776345&di=fe16ceecf86985bc5c343ef130c1e449&imgtype=0&src=http%3A%2F%2Fpic18.nipic.com%2F20120204%2F8339340_144203764154_2.jpg',
			title: '标题11',
			content: '内容11',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776345&di=44432c3ea61ee961f623d5750e98ae27&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F13%2F32%2F19%2F66p58PICnMg_1024.jpg',
			title: '标题12',
			content: '内容12',
		},

		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776344&di=863bebf05062f1d5b759616da8cc060d&imgtype=0&src=http%3A%2F%2Fpic41.nipic.com%2F20140513%2F9179121_111522012377_2.jpg',
			title: '标题13',
			content: '内容13',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776344&di=a30e97dbf4d7aa6c50ec5141f1a5f06a&imgtype=0&src=http%3A%2F%2Fpic9.nipic.com%2F20100827%2F5252423_161258496483_2.jpg',
			title: '标题14',
			content: '内容14',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776344&di=2b86899af8960eb908180376d0d89c50&imgtype=0&src=http%3A%2F%2Fpic31.nipic.com%2F20130719%2F9885883_095141604000_2.jpg',
			title: '标题15',
			content: '内容15',
		},
	],
	page4: [
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776344&di=5dd981388c5d627ef0a9685c9cc8e897&imgtype=0&src=http%3A%2F%2Fpic38.nipic.com%2F20140226%2F2457331_112835004364_2.jpg',
			title: '标题16',
			content: '内容16',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776343&di=7d7289a1ece1c0293d6f63029cb0fcfc&imgtype=0&src=http%3A%2F%2Fpic29.nipic.com%2F20130517%2F9252150_140653449378_2.jpg',
			title: '标题17',
			content: '内容17',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776343&di=ab7feb1e8dcbfea19dd40df4e3729b73&imgtype=0&src=http%3A%2F%2Fpic17.nipic.com%2F20111101%2F3094309_171235018306_2.jpg',
			title: '标题18',
			content: '内容18',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776343&di=8d2c047a20f194bbc4fd315807cd01e7&imgtype=0&src=http%3A%2F%2Fpic31.nipic.com%2F20130801%2F11604791_100539834000_2.jpg',
			title: '标题19',
			content: '内容19',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776343&di=8e71510536e4caf06129556bad5ea643&imgtype=0&src=http%3A%2F%2Fpic24.nipic.com%2F20120922%2F10898738_143746326185_2.jpg',
			title: '标题20',
			content: '内容20',
		},
	],
	page5: [
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776343&di=7df0e51f9d0ebc103c21d536f6eed1ad&imgtype=0&src=http%3A%2F%2Fpic31.nipic.com%2F20130706%2F12970162_195127182100_2.jpg',
			title: '标题21',
			content: '内容21',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776342&di=ffac4dca107458c02023bef33e2951e4&imgtype=0&src=http%3A%2F%2Fpic21.nipic.com%2F20120613%2F9254256_085130546175_2.jpg',
			title: '标题22',
			content: '内容22',
		},

		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776342&di=920fe2229a7e7b61af9c7b5858e84112&imgtype=0&src=http%3A%2F%2Fpic21.nipic.com%2F20120428%2F9821123_210731511131_2.jpg',
			title: '标题23',
			content: '内容23',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776342&di=2865f00d0deddb806aecaf21af5b1e21&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20120128%2FImg333056814.jpg',
			title: '标题24',
			content: '内容24',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776342&di=9055389bfd1a83b270e69cc4b7551fdd&imgtype=0&src=http%3A%2F%2Fi2.w.yun.hjfile.cn%2Fdoc%2F201303%2F78ebff0b-3b4b-4695-93b7-4b5f62312ce6_08.jpg',
			title: '标题25',
			content: '内容25',
		},
	],
	page6: [
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776341&di=054b1d84913e3749f8e78021014b4300&imgtype=0&src=http%3A%2F%2Fpic25.nipic.com%2F20121206%2F11483309_195705290102_2.jpg',
			title: '标题26',
			content: '内容26',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776341&di=e22d68cc1af5b88ce0bbe5591823f8c2&imgtype=0&src=http%3A%2F%2Fimage2.sina.com.cn%2Fcul%2Fupload%2F68%2F4036%2F20051123%2F856%2F171249%2F171255.jpg',
			title: '标题27',
			content: '内容27',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776341&di=882db0fe237b80a6c8c0b053b467f89c&imgtype=0&src=http%3A%2F%2Fpic18.nipic.com%2F20111214%2F6834314_092609528357_2.jpg',
			title: '标题28',
			content: '内容28',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776340&di=4fe186a5372c04f75872f6dff4670918&imgtype=0&src=http%3A%2F%2Fpic17.nipic.com%2F20111025%2F533255_215834243000_2.jpg',
			title: '标题29',
			content: '内容29',
		},
		{
			img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559208776331&di=4269c56ba9fe19d3f0df77fad18e4a7a&imgtype=0&src=http%3A%2F%2Fpic13.nipic.com%2F20110319%2F6787586_095428838000_2.jpg',
			title: '标题30',
			content: '内容30',
		},
	],
});
