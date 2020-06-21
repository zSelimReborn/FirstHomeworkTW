let PostManager = {
    field: document.querySelector("#new_post"),
    button: document.querySelector("#save-button"),
    postsList: document.querySelector(".posts-list"),

    init: function() {
        this.button.addEventListener("click", this.onClickSave);
        this.field.addEventListener("keyup", this.onPressEnter);  
    },

    onPressEnter: function(evt) {
        let that = PostManager;
        e = (evt)? evt : window.event;

        if (e.keyCode == 13) {
            that.savePost();
        }
    },

    onClickSave: function(evt) {
        let that = PostManager;

        that.savePost();
    },

    savePost: function() {
        let that = PostManager;
        
        let postContent = that.field.value;
        if (postContent.trim() === "") {
            return;
        }

        that.field.value = "";

        let post = that.newPost(postContent);
        that.postsList.append(post);
    },

    newPost: function(text) {
        let that = PostManager;

        let post = document.createElement("div");
        post.className = "post-it";
        post.onclick = that.onClickPost;

        let postContent = document.createElement("p");
        postContent.textContent = text;
        postContent.className = "post-it-content";

        let postRemove = document.createElement("button");
        postRemove.className = "remove-post-it";
        postRemove.textContent = "x";
        postRemove.onclick = that.onRemovePost;

        post.append(postContent);
        post.append(postRemove);

        return post;
    },

    newEditPost: function(text) {
        let that = PostManager;

        let textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        textarea.className = "edit-post-it";
        textarea.onkeyup = that.onEditPost;

        return textarea;
    },

    onEditPost: function(evt) {
        let that = PostManager;
        e = (evt)? evt : window.event;

        if (e.keyCode == 13) {
            if (this.value.trim() === "") {
                return;
            }

            this.parentNode.children[0].textContent = this.value;
            this.parentNode.classList.remove("editing");
            this.parentNode.children[0].style.display = "block";

            this.remove();
        }
    },

    onClickPost: function(evt) {
        let that = PostManager;

        if (this.classList.contains("editing")) {
            return;
        }

        let content = this.children[0];
        content.style.display = "none";

        let textarea = that.newEditPost(content.textContent);
        this.append(textarea);
        this.classList.add("editing");
    },

    onRemovePost: function(evt) {
        evt.stopPropagation();
        let parent = this.parentNode;
        parent.remove();
    }
};

window.PostManager = PostManager;