(function() {
    Vue.component("vue-comments", {
        data: function() {
            return {
                heading: "comments",
                comments: "",
                username: "",
                commentsR: []
            };
        },
        props: ["imageId"],
        mounted: function() {
            var self = this;
            axios.get("/comments/" + this.imageId).then(results => {
                console.log(results.data);
                self.commentsR = results.data;
            });
        },
        methods: {
            commentsSubmit: function() {
                var self = this;
                axios
                    .post("/comments", {
                        image_id: self.imageId,
                        comment: self.comments,
                        username: self.username
                    })
                    .then(res => {
                        if (res.data.success) {
                            console.log(res.data);
                            self.commentsR.unshift(res.data.results);
                            self.comments = "";
                            self.username = "";
                        } else {
                            console.log("error");
                        }
                    })
                    .catch(err => {
                        console.log("err", err);
                    });
            }
        },
        template: "#modal-comments-template"
    });

    Vue.component("image-modal", {
        data: function() {
            return {
                title: "",
                url: ""
            };
        },
        props: ["imageId"],
        mounted: function() {
            var self = this;
            axios.get("/images/" + this.imageId).then(results => {
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
            imageId: 0
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
