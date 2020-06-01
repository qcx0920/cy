Page({
    data: {
        domain: "https://cs.4coin.top",
        url: ""
    },
    onLoad(options) {
    var key=options.key;
    var index=options.key.indexOf("/");
        this.setData({
            url: this.data.domain + key.substring(index,key.length)
        })
    }

})