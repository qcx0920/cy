import { contstantParam } from '../util/commConstants';

Page({
    data: {
        
    },
    onLoad() {
        swan.setEnableDebug({
            enableDebug: true
        });
        this.authorize();
    },
    authorize() {
        let scope = ""
        swan.authorize({
            scope,
            success: res => {
                swan.showToast({
                    title: '授权后登录',
                    icon: 'none'
                });
            },
            fail: err => {
                if (err.errCode === 10003) {
                    swan.showToast({
                        title: '返回页面',
                        icon: 'none'
                    });
                }
            }
        });
    },
    login(){
        //检测用户是否
    },
    getLoginInfo() {
        swan.login({
            success: res => {
                console.log('login success', res);
                let code = res.code;
                this.getUserInfo(code);
            },
            fail: err => {
                console.log('login fail', err);
            }
        });


        // swan.checkSession({
        //     success: res => {
        //         console.log('checkSession success', res);
        //         this.setData({ desc: res });
        //         swan.showToast({
        //             title: '您已登录',
        //             icon: 'none'
        //         });
        //     },
        //     fail: err => {
        //         console.log('checkSession fail', err);
        //         this.setData({ desc1: err.toString });

        //     }
        // });
    },
    getUserInfo(code) {
        swan.getUserInfo({
            success: res => {
                //swan.openSetting({});
                let userInfo = res.data;
                console.log('getUserInfo ', userInfo);
                swan.request({
                    url: contstantParam.apiurl + '/szw/getDecrypt',
                    method: "post",
                    data: { code: code, userStr: userInfo },
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    success: res => {
                        swan.showToast({
                            title: "登录成功:" + res
                        });
                        console.log('request ', res);
                    },
                    fail: err => {
                        swan.showToast({
                            title: "网络异常,请重试!"
                        });
                        console.log('request fail', err);
                    },
                    complete: () => {
                    }
                });
            },
            fail: err => {
                console.log('getUserInfo err', err);
                swan.showToast({
                    title: '请先授权',
                    icon: 'none'
                });
            }
        });
    }
});
