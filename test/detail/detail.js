Page({
    data: {
        isAll: false,
        downurl: "",
        intro: "",
        imgs:null
    },
    onLoad(){
    },
    showAll() {
        this.setData({ isAll: true });
        
    },
    packUp() {
        this.setData({ isAll: false })
    },
    down(e) {
        this.setClipboardData(e.currentTarget.dataset.url);
    },
    toast(title, icon = 'none') {
        swan.showToast({ duration: 5000, title, icon });
    },
    getAllData() {
    // 0正常 1资讯页面
        swan.request({
            url: 'http://192.168.8.84:8281/szw/infor',
            method: "post",
            data: { pid: 487,type:0},
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                var intro = res.data.data.intro;
                this.setData({ intro: intro.substring(51, intro.length) });
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
    },
    setClipboardData(text) {
        swan.setClipboardData({
            data: text,
            success: () => {
                swan.showToast({
                    title: '复制成功'
                });
            },
            fail: err => {
                swan.showToast({
                    title: '复制失败'
                });
            }
        });
    },
    gozxDetail() {
        swan.navigateTo({
            url: '/test/zxdetail/detail'
        });
    }
});