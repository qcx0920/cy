import { contstantParam } from '../util/commConstants';
Page({
    data: {
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
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        this.setPageInfo(currentPage.options.pid);
    },
    onLoad(options) {
        this.getSystem();
        this.getAllData(options.pid);
        this.getList(true, 1);
    },
    onReachBottom(e) {
        this.getList(false, this.data.pageNo);
    },
    showAll() {
        this.setData({ isAll: !this.data.isAll });
    },
    down(e) {
        this.setClipboardData(e.currentTarget.dataset.url);
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
    getAllData(pid) {
        // 0正常 1资讯页面
        swan.request({
            url: contstantParam.apiurl + '/szw/infor',
            method: "post",
            data: { pid: pid, type: 0 },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                var appInfo = res.data.data;
                var time = appInfo.createtime;
                appInfo.createtime = this.getDate(time * 1000);
                var imgstr = appInfo.screenshot;
                var imgArr = imgstr.split(",");
                this.setData({ appInfo: appInfo, imgs: imgArr });
            },
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
                });
                console.log('request fail', err);
            },
            complete: () => {
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
            url: contstantParam.zxDetailPage+'?pid=' + e.currentTarget.dataset.pid
        });
    },
    getList(isNew, pageNo) {
        swan.request({
            url: contstantParam.apiurl + '/szw/list',
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
                    pageNo++;
                    if (isNew) {
                        this.setData({ applist: applist, pageNo: pageNo });
                    } else {
                        this.setData({ applist: this.data.applist.concat(applist), pageNo: pageNo });
                    }
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
            }
        });

    },
    setPageInfo(pid) {
        // 0正常 1资讯页面
        swan.request({
            url: contstantParam.apiurl + '/szw/indexTitle',
            method: "post",
            data: { pid: pid, type: 0 },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                swan.setPageInfo({
                    title: res.data.data.title,
                    description: res.data.data.description,
                    keywords: res.data.data.keywords,
                });
                this.setTitle(res.data.data.title);

            },
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
                });
                console.log('request fail', err);
            },
            complete: () => {
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
    },
    setTitle(newTitle) {
        swan.setNavigationBarTitle({
            title: newTitle
        });
    },
    toast(title, icon = 'none') {
        swan.showToast({ duration: 5000, title, icon });
    }

});