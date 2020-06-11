/**
 * @file index.js
 * @author swan
 */

import { contstantParam } from '../util/commConstants';
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
        tabLabels: ['首页', '苹果赚钱', '手机兼职', '阅读赚钱', '安卓赚钱', '手赚资讯'],
        applist: null,
        issearch: false,
        searchName: "",
        searchLists: [],
    },
    onShow() {
        this.setPageInfo();
    },
    onLoad() {
        this.getSystem();
        this.setTitle(this.data.tabLabels[this.data.activeName]);
        this.initData(1, 0, true, 1)
    },
    todetail(e) {
        //trendsflag  0没有生成详情页面  1已生成
        var trendsflag = e.currentTarget.dataset.trendsflag
        var pid = e.currentTarget.dataset.pid;
        var type =e.currentTarget.dataset.type;
        if (trendsflag == 0) {
            swan.navigateTo({
                url: contstantParam.detailPage + '?pid=' + e.currentTarget.dataset.pid
            });
        } else {
            swan.navigateTo({
                url: '/' + type + '/' + pid + '/' + pid
            });
        }
    },
    switchTab(e) {
        this.scrollToTop();
        if (e.detail.name == 5) {
            this.setData({ isZx: true });
        } else {
            this.setData({ isZx: false });
        }
        this.setData({ activeName: e.detail.name, activeName1: 0, issearch: false });
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
            url: contstantParam.apiurl + '/szw/list',
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
            url: contstantParam.zxDetailPage + '?pid=' + e.currentTarget.dataset.pid
        });
    },
    onReachBottom(e) {
        if (this.data.issearch) {
            this.searchData(this.data.searchName, this.data.pageNo, false);
        } else {
            this.initData(this.data.activeName, this.data.activeName1, false, this.data.pageNo);
        }
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
    },
    setPageInfo() {
        // 0正常 1资讯页面
        swan.request({
            url: contstantParam.apiurl + '/szw/indexTitle',
            method: "post",
            data: { pid: 0, type: 0 },
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
    searchInput(e) {
        var value = e.detail.value;
        if (value != null && value != "") {
            this.setData({ searchName: value })
        } else {
            this.setData({ searchName: "" });
        }
    },
    search() {
        var searchName = this.data.searchName;
        if (searchName != null && searchName != "") {
            this.searchData(searchName, 1, true);
        } else {
            this.setData({ searchLists: [] ,issearch:false});
        }
    },
    searchData(name, pageNo, isNew) {
        swan.request({
            url: contstantParam.apiurl + '/szw/list',
            data: { "name": name, "pageNo": pageNo, "pageSize": this.data.pageSize },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                var searchLists = res.data.data;
                if (searchLists.length > 0) {
                    for (var i = 0; i < searchLists.length; i++) {
                        var time = searchLists[i].createtime;
                        searchLists[i].createtime = this.getDate(time * 1000)
                    }
                    pageNo++;
                    if (isNew) {
                        this.setData({ searchLists: searchLists, pageNo: pageNo, issearch: true });
                    } else {
                        this.setData({ searchLists: this.data.searchLists.concat(searchLists), pageNo: pageNo, issearch: true });
                    }
                } else {
                    swan.showToast({
                        title: '没有搜索到内容'
                    });
                }
            },
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
                });
            }
        });
    }
})
