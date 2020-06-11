
import { contstantParam } from '../util/commConstants';

Page({
    data: {
        appInfo: null,
        htmlSnip: ``,
        isAll:false,
        pageNo: 1,
        pageSize: 15,
        applist: null,
    },
    onShow() {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        this.setPageInfo(currentPage.options.pid);
    },
    onLoad(options) {
        var pid = options.pid;
        // 监听页面加载的生命周期函数
        this.getAllData(pid);
        this.getList(true,1);
    },
    getAllData(pid) {
        // 0正常 1资讯页面
        swan.request({
            url: contstantParam.apiurl + '/szw/infor',
            method: "post",
            data: { pid: pid, type: 1 },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                var appInfo = res.data.data;
                var time = appInfo.createtime;
                appInfo.createtime = this.getDate(time * 1000);
                var content = `<div>` + appInfo.content.replace('<img', '<img style="width:100%;height:100%; "') + `</div>`;
                this.setData({ appInfo: appInfo, htmlSnip: content });
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
    showAll() {
        this.setData({ isAll: !this.data.isAll });
    },
    gozxDetail(e) {
        swan.navigateTo({
            url: contstantParam.zxDetailPage + '?pid=' + e.currentTarget.dataset.pid
        });
    }
});