Page({
    data: {
        isAll: false,
        downurl: "",
        intro: "",
        imgs: null,
        pageNo: 1,
        pageSize: 5,
        applist: null,
        appInfo: null
    },
    onLoad() {
        this.getList(true, 1);
        this.getAllData();
    },
    onReachBottom(e) {
        this.getList(false, this.data.pageNo);
    },
    showAll() {
        var intro = appInfo.intro;
        this.setData({ isAll: true, intro: intro.substring(51, intro.length) });
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
            data: { pid: 487, type: 0 },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                var imgstr = res.data.data.screenshot;
                var imgArr =imgstr.split(",");
                console.log(imgArr);
                this.setData({ appInfo : res.data.data,imgs:imgArr });
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
    gozxDetail(e) {
        swan.navigateTo({
            url: '/test/zxdetail/detail?pid='+e.currentTarget.dataset.pid
        });
    },
    getList(isNew, pageNo) {
        swan.request({
            url: 'http://192.168.8.84:8281/szw/list',
            data: { "type": 5, "flag": 0, "pageNo": pageNo, "pageSize": this.data.pageSize },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                var applist = res.data.data;
                if (applist.length > 0) {
                    for (var i = 0; i < applist.length; i++) {
                        var time = applist[i].createtime;
                        applist[i].createtime = this.getDate(time * 1000)
                    }
                    if (isNew) {
                        this.setData({ applist: applist });
                    } else {
                        this.setData({ applist: this.data.applist.concat(applist) });
                    }
                    pageNo++;
                    this.setData({ pageNo: pageNo });
                } else {
                    swan.showToast({
                        title: '没有新的内容了'
                    });
                }
            },
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
                });
            },
            complete: () => {
                this.setData('loading', true);
            }
        });

    },
    getDate(e) {
        //将字符串转换成时间格式
        var date = new Date(e);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDay();
        return year + "-" + month + "-" + day;
    }
});