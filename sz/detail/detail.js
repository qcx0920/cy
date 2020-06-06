import { apiurl } from '../util/commConstants';

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
    onShow() {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        this.setPageInfo(currentPage.options.pid);
    },
    onLoad(options) {
       this.getAllData(options.pid);
        this.getList(true, 1);
    },
    onReachBottom(e) {
        this.getList(false, this.data.pageNo);
    },
    showAll() {
        this.setData({ isAll: true});
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
    getAllData(pid) {
        // 0正常 1资讯页面
        swan.request({
            url: apiurl + '/szw/infor',
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
    setPageInfo(pid) {
        // 0正常 1资讯页面
        swan.request({
            url: apiurl + '/szw/indexTitle',
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
    },
    setTitle(newTitle) {
        swan.setNavigationBarTitle({
            title: newTitle
        });
    }
    
});