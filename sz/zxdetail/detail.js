
import {apiurl} from '../util/commConstants';

Page({
    data: {
        appInfo: null,
        htmlSnip:``
    },
    onLoad(options) {
        var pid = options.pid;
        // 监听页面加载的生命周期函数
        this.getAllData(pid)
    },
    getAllData(pid) {
        // 0正常 1资讯页面
        swan.request({
            url: apiurl+'/szw/infor',
            method: "post",
            data: { pid: pid, type: 1 },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                var appInfo = res.data.data;
                var time = appInfo.createtime;
                appInfo.createtime = this.getDate(time * 1000);
                var content=`<div>`+appInfo.content.replace('<img','<img style="width:100%;height:100%; "')+`</div>`;
                this.setData({ appInfo: appInfo, htmlSnip:content});
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