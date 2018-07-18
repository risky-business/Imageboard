(function() {
    Vue.component("vue-comments", {
        data: function() {
            return {
                message: "HELLO THERE MATE"
            };
        },
        template: "<div>{{message}}</div>"
    });

    Vue.component("image-modal", {
        data: function() {
            return {
                title: "title",
                url: ""
            };
        },
        props: ["id"],
        mounted: function() {
            var self = this;
            axios.get("/images/" + this.id).then(results => {
                console.log(results);
                console.log(self.anything);
                self.title = results.data.title;
                self.url = results.data.url;
            });
        },
        template: "#image-template",
        methods: {
            close: function() {
                this.$emit("myevent", "hellotheremate");
            }
        }
    });

    var app = new Vue({
        el: "#main",
        data: {
            imageToUpload: {
                title: "",
                desc: "",
                username: ""
            },
            images: [],
            imageId: null
        },
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(results) {
                self.images = results.data;
            });
        },
        methods: {
            showModal: function(id) {
                this.imageId = id;
            },
            remove: function() {
                this.imageId = null;
            },
            imageSelected: function(e) {
                this.imageFile = e.target.files[0];
            },

            upload: function() {
                console.log(this.imageFile);
                var formData = new FormData();
                formData.append("file", this.imageFile);
                formData.append("title", this.imageToUpload.title);
                formData.append("desc", this.imageToUpload.desc);
                formData.append("username", this.imageToUpload.username);
                axios.post("/upload", formData).then(function(res) {
                    if (res.data.success) {
                        app.images.unshift(res.data.image);
                    }
                });
            }
        }
    });
})();
