import { contstantParam } from '../util/commConstants';
Page({
    data: {
        isAll: false,
        downurl: "",
        intro: "",
        imgs: null,
        pageNo: 1,
        pageSize: 15,
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
        issearch: false,
        searchLists: [],
        searchName: '',
        tabLabels: ['首页', '苹果赚钱', '手机兼职', '阅读赚钱', '安卓赚钱', '手赚资讯'],
        value: '',
        focus: false,
        hasResult: false,
        showEmptyResult: false,
        blur: true,
        commentText: "",
        comments: null,
        userInfo:null,
        commentPage:0
    },
    changemore(e) {
        this.setData({ ismore: false })
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
        this.getComments(options.pid);
    },
    showAll() {
        this.setData({ isAll: !this.data.isAll });
    },
    down(e) {
        this.setClipboardData(e.currentTarget.dataset.url);
    },
    getmore() {
        this.setData({ ismore: !this.data.ismore });
    },
    getSystem() {
        swan.getSystemInfo({
            success: res => {
                if (res.system.search('Android') <= -1) {
                    this.setData({ isIos: true, tabs: this.data.tabsIos })
                } else {
                    this.setData({ isIos: false, tabs: this.data.tabsAndroid })
                }
            }
        });
    },
    changetab(e) {
        swan.navigateTo({
            url: '/list/index?an=' + e.currentTarget.dataset.name
        });
    },
    gozxList() {
        swan.navigateTo({
            url: '/list/index?an=' + 5
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
            url: contstantParam.zxDetailPage + '?pid=' + e.currentTarget.dataset.pid
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
                        title: '没有更多内容了'
                    });
                }
            },
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
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
    setTitle(newTitle) {
        swan.setNavigationBarTitle({
            title: newTitle
        });
    },
    toast(title, icon = 'none') {
        swan.showToast({ duration: 5000, title, icon });
    },
    todetail(e) {
        //trendsflag  0没有生成详情页面  1已生成
        var trendsflag = e.currentTarget.dataset.trendsflag
        var pid = e.currentTarget.dataset.pid;
        if (trendsflag == 0) {
            swan.navigateTo({
                url: contstantParam.detailPage + '?pid=' + e.currentTarget.dataset.pid
            });
        } else {
            swan.navigateTo({
                url: '/' + pid + '/' + pid
            });
        }
    },
    onReachBottom(e) {
        var searchName = this.data.searchName;
        if (searchName != null && searchName != "") {
            this.searchData(searchName, this.data.pageNo, false);
        }
    },
    searchFocus(e) {
        this.setData({
            focus: true
        });
    },
    searchInput(e) {
        const value = e.detail.value;
        this.setData({
            value,
            hasResult: false,
            showEmptyResult: false
        });
        if (value != null && value != "") {
            this.setData({ searchName: value })
        } else {
            this.setData({ searchName: "" });
        }
    },
    searchConfirm(e) {
        var searchName = this.data.searchName;
        if (searchName != null && searchName != "") {
            this.searchData(searchName, 1, true);
            this.setData({
                showEmptyResult: true,
                hasHistory: true
            });
        } else {
            this.setData({ searchLists: [], issearch: false });
        }
    },
    searchBlur(e) {
        this.setData({
            focus: false
        });
    },
    searchClear() {
        this.setData({
            value: '',
            hasResult: false,
            showEmptyResult: false
        });
    },
    openShare() {
        swan.openShare({
            title: this.data.appInfo.name,
            content: this.data.appInfo.description,
            path: "/" + this.data.appInfo.type + "/" + this.data.appInfo.pid + "/" + this.data.appInfo.pid,
            imageUrl: this.data.appInfo.logo,
            success: res => {
                swan.showToast({
                    title: '分享成功',
                    icon: 'none'
                });
                console.log('openShare success', res);
            },
            fail: err => {
                console.log('openShare fail', err);
            }
        });
    },
    addComment(commentText) {
        swan.request({
            url: contstantParam.apiurl + '/szw/addComment',
            data: { "uid": this.data.userInfo.pid, "taskid": this.data.appInfo.pid, "type": 0, "comment": commentText },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                if (res.data.code == "200") {
                    swan.showToast({
                        title: "发表成功"
                    });
                    this.setData({commentText:""});
                    this.getComments(this.data.appInfo.pid);
                } else {
                    console.log("addComment res:" + JSON.stringify(res.data))
                    swan.showToast({
                        title: "发表失败"
                    });
                }
            },
            fail: err => {
                console.log("addComment err:" + JSON.stringify(err))

            }
        });
    },
    commentInput(e) {
        const value = e.detail.value;
        if (value != null && value != "") {
            this.setData({ commentText: value })
        } else {
            this.setData({ commentText: "" });
        }
    },
    commentConfirm(e) {
        //判断用户是否登录
        var islogin = this.isLogin()
        if (islogin) {
            var commentText = this.data.commentText;
            if (commentText != null && commentText != "") {
                this.addComment(commentText);
            }
        } else {
            swan.showToast({
                title: "登录后评论"
            });
            swan.navigateTo({
                url: "/login/login"
            });
        }
    },
    getComments(pid) {
        let pageNo=this.data.commentPage;
        swan.request({
            url: contstantParam.apiurl + '/szw/commentList',
            data: { "taskid": pid, "type": 0, "page": pageNo, "pagesize": 5 },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: "post",
            success: res => {
                if (res.data.code == "200") {
                    var comments = res.data.data;
                    for (var i = 0; i < comments.length; i++) {
                        var time = comments[i].createtime;
                        comments[i].createtime = this.getDateymdhms(time * 1000)
                    }
                    pageNo++;
                    this.setData({ comments: res.data.data,commentPage:pageNo })
                } else {
                    console.log("getComments res:" + JSON.stringify(res.data))
                    swan.showToast({
                        title: "获取评论失败"
                    });
                }
            },
            fail: err => {
                console.log("addComment err:" + JSON.stringify(err))

            }
        });
    },
    getDateymdhms(e) {
        //将字符串转换成时间格式
        var date = new Date(e);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sen = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sen;
    },
    isLogin() {
        if(this.data.userInfo){
           return true;
        }
        let loginInfo = this.getStorage(contstantParam.xcxUserInfo);
        if (loginInfo) {
            this.setData({userInfo:loginInfo});
            return true;
        }
        return false;
    },
    getStorage(key) {
        let result = "";
        swan.getStorage({
            key,
            success: res => {
                const data = res.data;
                if (data) {
                    result = data;
                }

            },
            fail: err => {
                console.log("获取存储信息错误:" + JSON.stringify(err));
            }
        });
        return result;
    }
});