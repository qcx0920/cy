import { apiurl } from '../util/commConstants';

Page({
    data: {
        pid: 487,
        isAll: false,
        downurl: "",
        intro: "",
        imgs: null,
        pageNo: 1,
        pageSize: 5,
        applist: null,
        appInfo: null,
        ismore: false,
        tabs: [],
        isIos: false,
        tabsAndroid: [
            {
                name: 2,
                label: '手机兼职'
            }, {
                name: 3,
                label: '阅读赚钱'
            }, {
                name: 4,
                label: '安卓赚钱'
            }, {
                name: 5,
                label: '手赚资讯'
            }
        ],
        tabsIos: [
            {
                name: 1,
                label: '苹果赚钱'
            }, {
                name: 2,
                label: '手机兼职'
            }, {
                name: 3,
                label: '阅读赚钱'
            }, {
                name: 5,
                label: '手赚资讯'
            }
        ],
    },
    onShow() {
        this.setPageInfo();
        this.getAllData();
    },
    onLoad() {
        this.getSystem();
        this.getList(true, 1);
    },
    onReachBottom(e) {
        this.getList(false, this.data.pageNo);
    },
    showAll() {
        var intro = this.data.appInfo.intro;
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
    getmore() {
        this.setData({ismore: !this.data.ismore});
    },
    getSystem() {
        swan.getSystemInfo({
            success: res => {
                if (res.system != 'Android') {
                    this.setData({ isIos: true, tabs: this.data.tabsIos })
                } else {
                    this.setData({ isIos: false, tabs: this.data.tabsAndroid})
                }
            }
        });
    },
    getAllData() {
        // 0正常 1资讯页面
        swan.request({
            url: apiurl + '/szw/infor',
            method: "post",
            data: { pid: this.data.pid, type: 0 },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                var imgstr = res.data.data.screenshot;
                var imgArr = imgstr.split(",");
                this.setData({ appInfo: res.data.data, imgs: imgArr });
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
            url: '/sz/zxdetail/detail?pid=' + e.currentTarget.dataset.pid
        });
    },
    getList(isNew, pageNo) {
        swan.request({
            url: apiurl + '/szw/list',
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
    setPageInfo() {
        // 0正常 1资讯页面
        swan.request({
            url: apiurl + '/szw/indexTitle',
            method: "post",
            data: { pid: this.data.pid, type: 0 },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                swan.setPageInfo({
                    title: res.data.data.title,
                    description: res.data.data.description,
                    keywords: res.data.data.keywords,
                })
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
    getDate(e) {
        //将字符串转换成时间格式
        var date = new Date(e);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDay();
        return year + "-" + month + "-" + day;
    }
});