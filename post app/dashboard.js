import supabase from "./supabase.js";

var cardbg;

// FETCH POSTS
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const { data, error } = await supabase.from('post').select("*");

        if (error) {
            console.log(error);
            return;
        }

        data.forEach(post => {
            var posts = document.getElementById("posts");

            posts.innerHTML += `
            <div class="card m-2">
                <div style="background-image: url(${post.img_url}); background-size: cover;" class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                </div>
                <div class="ms-auto m-2">
                    <button onclick="editPost(event)" class="btn myedit">Edit</button>
                    <button onclick="deletePost(event)" class="btn mydelete">Delete</button>
                </div>
            </div>`;
        });

    } catch (error) {
        console.log(error);
    }
});


// EDIT POST (UI only, no DB change)
function editPost(event) {
    var card = event.target.parentNode.parentNode;

    var title = card.children[0].children[0].innerHTML;
    var discription = card.children[0].children[1].innerHTML;

    document.getElementById("title").value = title;
    document.getElementById("discription").value = discription;

    card.remove();
}


// DELETE POST (UI only, no DB delete)
function deletePost(event) {
    var card = event.target.parentNode.parentNode;
    card.remove();
}


// ADD POST
async function post() {

    var title = document.getElementById("title").value;
    var discription = document.getElementById("discription").value;
    var posts = document.getElementById("posts");

    if (title.trim() && discription.trim()) {

        try {

            const { data, error } = await supabase
                .from('post')
                .insert([{
                    title: title,
                    description: discription,
                    img_url: cardbg
                }])
                .select("*");

            if (error) {
                console.log("Post error:", error);
                return;
            }

            posts.innerHTML += `
            <div class="card m-2">
                <div style="background-image: url(${cardbg}); background-size: cover;" class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${discription}</p>
                </div>
                <div class="ms-auto m-2">
                    <button onclick="editPost(event)" class="btn myedit">Edit</button>
                    <button onclick="deletePost(event)" class="btn mydelete">Delete</button>
                </div>
            </div>`;

            document.getElementById("title").value = "";
            document.getElementById("discription").value = "";

        } catch (error) {
            console.log(error);
        }

    } else {
        Swal.fire({
            icon: "error",
            title: "Empty Post...",
            text: "Enter title & description",
        });
    }
}


// SELECT IMAGE
function selectImg(src, event) {
    cardbg = src;

    var bgImg = document.querySelectorAll(".bgImg");

    for (var i = 0; i < bgImg.length; i++) {
        bgImg[i].classList.remove("selectedImg");
    }

    event.target.classList.add("selectedImg");
}


// MAKE FUNCTIONS GLOBAL
window.deletePost = deletePost;
window.editPost = editPost;
window.post = post;
window.selectImg = selectImg;