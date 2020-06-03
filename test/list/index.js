/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
        activeName: 1,
        activeName1: 0,
        pageNo:1,
        pageSize:10,
        isIos: false,
        isZx: false,
        tabs: null,
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
            },
            {
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
            },
            {
                name: 5,
                label: '手赚资讯'
            }
        ],
        tabsType: [
            {
                name: 0,
                label: '热门'
            }, {
                name: 1,
                label: '最新'
            }, {
                name: 2,
                label: '推荐'
            }
        ],
        applist: null
    },
    onLoad() {
        this.getSystem();
        this.initData(1, 0)
    },
    todetail() {
        swan.navigateTo({
            url: '/test/detail/detail'
        });
    },
    switchTab(e) {
        if (e.detail.name == 5) {
            this.setData({ isZx: true });
        } else {
            this.setData({ isZx: false });
        }
        this.setData({ activeName: e.detail.name, activeName1: 0 });
        this.initData(e.detail.name, 0);
    },
    switchTabType(e) {
        this.setData({ activeName1: e.detail.name });
        this.initData(this.data.activeName, e.detail.name);
    },
    initData(type, flag) {
        swan.request({
            url: 'http://192.168.8.84:8281/szw/list',
            data: { "type": type, "flag": flag,pageNo:this.data.pageNo,pageSize:this.data.pageSize },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                var applist = res.data.data;
                for (var i = 0; i < applist.length; i++) {
                    var time = applist[i].createtime;
                    applist[i].createtime = this.getDate(time * 1000)
                }
                this.setData({ applist: applist});
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
    getSystem() {
        swan.getSystemInfo({
            success: res => {
                if (res.system != 'Android') {
                    this.setData({ isIos: true, tabs: this.data.tabsIos })
                } else {
                    this.setData({ isIos: true, tabs: this.data.tabsAndroid, activeName: 2 })
                }
            },
            fail: err => {
                swan.showToast({
                    title: '获取失败'
                });
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
    gozxDetail() {
        swan.navigateTo({
            url: '/test/zxdetail/detail'
        });
    }
})
