Component({ // eslint-disable-line
    properties: {
        list: {
            type: Array,
            value: []
        }
    },
    handleTap(e) {
        swan.navigateTo({
            url: '/pages/detail/detail?key='+e.currentTarget.dataset.key
        });
    }
});