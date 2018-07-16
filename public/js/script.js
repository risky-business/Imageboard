(function() {
    var app = new Vue({
        el: "#main",
        data: {
            images: []
        },
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(results) {
                self.images = results.data;
            });
        },
        methods: {
            changeToLeo: function() {
                this.greetee = "leonardo";
            }
        }
    });
    setTimeout(function() {
        app.heading = "this is a nightmare ahhhhhhhhhhhh";
    }, 2000);
    console.log(app);
})();
