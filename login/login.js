import { contstantParam } from '../util/commConstants';

Page({
    data: {

    },
    onLoad() {
        swan.setEnableDebug({
            enableDebug: true
        });
    },
    login() {
        //检测用户是否
        this.getLoginInfo();
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
                        swan.navigateTo({
                            url: '/list/index'
                        });
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
    },
    checkLoginSession() {
        swan.checkSession({
            success: res => {
                console.log('checkSession success', res);
                return true;
            },
            fail: err => {
                console.log('checkSession fail', err);
                return false;
            }
        });
    }
});
