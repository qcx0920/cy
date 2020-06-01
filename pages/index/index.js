/**
 * @file demo api for request
 * @author swan
 */

Page({
    data: {
        loading: true,
        lists: [],
        nowsence: 'test',
        activeName: "test",
        tabs: [{
            name: 'test',
            label: '健康'
        }, {
            name: 'test1',
            label: '养生'
        }, {
            name: 'test2',
            label: '运动'
        }]
    },
    onReady() {
        // 初始化请求数据
        this.initData("test", true);
    },
    initData(sceneP, isNew) {
        let loading = this.data.loading;
        if (loading) {
            this.setData('loading', false);
            let pstr = { uid: "", scene: sceneP, num: "12" };
            swan.request({
                url: 'https://order.haiyangqiu.com.cn/external/articles',
                data: { token: "wlshipin02", param: JSON.stringify(pstr) },
                success: res => {
                    if (isNew) {
                        this.setData({
                            lists: res.data.data.contents,
                            scene: sceneP
                        });
                    } else {
                        let lists = this.data.lists;
                        this.setData({
                            lists: lists.concat(res.data.data.contents),
                            scene: sceneP
                        });
                    }
                },
                fail: err => {
                    swan.showToast({
                        title: JSON.stringify(err)
                    });
                    console.log('request fail', err);
                },
                complete: () => {
                    this.setData('loading', true);
                }
            });
        }
    },
    scrolltolower() {
        this.initData(this.data.nowsence, false);
    },
    handleTap(e) {
        swan.navigateTo({
            url: '/pages/detail/detail?key=' + e.currentTarget.dataset.key
        });
    },
    tabsOne(e) {
        this.setData({ activeName: e.detail.name });
        this.initData(e.detail.name, true);
    }
});
