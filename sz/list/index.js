/**
 * @file index.js
 * @author swan
 */

import {apiurl} from '../util/commConstants';
Page({
    data: {
        activeName: 1,
        activeName1: 0,
        pageNo: 1,
        pageSize: 10,
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
        tabLabels:['首页','苹果赚钱','手机兼职','阅读赚钱','安卓赚钱','手赚资讯'],
        applist: null
    },
    onLoad() {
        this.getSystem();
        this.setTitle(this.data.tabLabels[this.data.activeName]);
        this.initData(1, 0, true, 1)
    },
    todetail() {
        swan.navigateTo({
            url: '/sz/detail/detail'
        });
    },
    switchTab(e) {
    this.setTitle(this.data.tabLabels[e.detail.name]);
        this.scrollToTop();
        if (e.detail.name == 5) {
            this.setData({ isZx: true });
        } else {
            this.setData({ isZx: false });
        }
        this.setData({ activeName: e.detail.name, activeName1: 0 });
        this.initData(e.detail.name, 0, true, 1);
    },
    switchTabType(e) {
        this.scrollToTop();
        this.setData({ activeName1: e.detail.name });
        this.initData(this.data.activeName, e.detail.name, true, 1);
    },
    initData(type, flag, isNew, pageNo) {
        //console.log("type:"+type+"flag:"+flag+"isNew:"+isNew+"pageNo:"+pageNo);
        swan.request({
            url: apiurl+'/szw/list',
            data: { "type": type, "flag": flag, "pageNo": pageNo, "pageSize": this.data.pageSize },
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
    getSystem() {
        swan.getSystemInfo({
            success: res => {
                if (res.system != 'Android') {
                    this.setData({ isIos: true, tabs: this.data.tabsIos })
                } else {
                    this.setData({ isIos: true, tabs: this.data.tabsAndroid, activeName: 2 })
                }
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
    gozxDetail(e) {
        swan.navigateTo({
            url: '/sz/zxdetail/detail?pid=' + e.currentTarget.dataset.pid
        });
    },
    onReachBottom(e) {
        this.initData(this.data.activeName, this.data.activeName1, false, this.data.pageNo);
    },
    scrollToTop() {
        swan.pageScrollTo({
            scrollTop: 0,
            duration: 300
        });
    },
    setTitle(newTitle) {
        swan.setNavigationBarTitle({
            title: newTitle
        });
    }
})
