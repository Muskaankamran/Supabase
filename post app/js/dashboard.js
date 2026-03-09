import supabase from "./supabase.js";

var cardbg;

async function searchPosts() {
    var searchValue = document.getElementById("searchValue").value;
    var posts = document.getElementById("posts");
    posts.innerHTML = "";

    try {
        let query = supabase.from("post").select("*").order('id', { ascending: false });

        if (searchValue.trim()) {
            query = query.or(`title.ilike.%${searchValue}%,discription.ilike.%${searchValue}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.log("Search error", error);
            return;
        }

        if (!data || data.length === 0) {
            posts.innerHTML = `<h5>No Posts Found</h5>`;
            return;
        }

        data.forEach((post) => {
            posts.innerHTML += `
           <div class="card m-2">
              <div style="background-image: url(${post.img_url}); background-size: cover;" class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.discription}</p>
              </div>
              <div class="ms-auto m-2">
                  <button onclick="editPost(event, ${post.id})" class="btn myedit">Edit</button>
                  <button onclick="deletePost(event, ${post.id})" class="btn mydelete">Delete</button>
               </div>
            </div>`;
        });

    } catch (error) {
        console.log(error);
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const { data, error } = await supabase.from('post').select("*").order('id', { ascending: false });

        if (error) {
            console.log(error);
            return;
        }

        var posts = document.getElementById("posts");
        posts.innerHTML = "";

        data.forEach(post => {
            posts.innerHTML += `
         <div class="card m-2">
              <div style="background-image: url(${post.img_url}); background-size: cover;" class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.discription}</p>
              </div>
              <div class="ms-auto m-2">
                  <button onclick="editPost(event, ${post.id})" class="btn myedit">Edit</button>
                  <button onclick="deletePost(event, ${post.id})" class="btn mydelete">Delete</button>
               </div>
            </div>`;
        });

    } catch (error) {
        console.log(error);
    }
});
//edit
async function editPost(event, id) {

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        Swal.fire("Login Required", "You must login first!", "warning");
        return;
    }

    // check if post belongs to this user
    const { data, error } = await supabase
        .from("post")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id);

    if (!data || data.length === 0) {
        Swal.fire("Not Allowed", "You cannot edit this post!", "error");
        return;
    }

    var card = event.target.parentNode.parentNode;

    var title = card.children[0].children[0].innerHTML;
    var discription = card.children[0].children[1].innerHTML;

    document.getElementById("title").value = title;
    document.getElementById("discription").value = discription;

    card.remove();
}
//delete 
async function deletePost(event, id) {

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        Swal.fire("Login Required", "You must login to delete posts!", "warning");
        return;
    }

    const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This post will be deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes Delete"
    });

    if (!confirm.isConfirmed) return;

    const { data, error } = await supabase
        .from("post")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select();

    if (error) {
        Swal.fire("Error deleting post");
        return;
    }

    if (!data || data.length === 0) {
        Swal.fire("You cannot delete this post!");
        return;
    }

    var card = event.target.parentNode.parentNode;
    card.remove();

    Swal.fire("Deleted!", "Post removed successfully", "success");
}

async function post() {

    var title = document.getElementById("title").value;
    var discription = document.getElementById("discription").value;
    var posts = document.getElementById("posts");

    if (title.trim() && discription.trim()) {

        try {

            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                Swal.fire("You must login first!");
                return;
            }

            const { data, error } = await supabase
                .from('post')
                .insert({
                    title,
                    discription,
                    img_url: cardbg,
                    user_id: user.id
                })
                .select("*");

            if (error) {
                console.log("post error:", error);
                return;
            }

            posts.innerHTML += `
         <div class="card m-2">
              <div style="background-image: url(${cardbg}); background-size: cover;" class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${discription}</p>
              </div>
              <div class="ms-auto m-2">
                  <button onclick="editPost(event, ${data[0].id})" class="btn myedit">Edit</button>
                  <button onclick="deletePost(event, ${data[0].id})" class="btn mydelete">Delete</button>
               </div>
            </div>`;

            document.getElementById("title").value = "";
            document.getElementById("discription").value = "";

        } catch (error) {
            console.log(error);
        }

    } else {
        Swal.fire("Enter title & description");
    }
}

function selectImg(src, event) {

    cardbg = src;

    var bgImg = document.querySelectorAll(".bgImg");

    for (var i = 0; i < bgImg.length; i++) {
        bgImg[i].classList.remove("selectedImg");
    }

    event.target.classList.add("selectedImg");
}

window.searchPosts = searchPosts;
window.editPost = editPost;
window.deletePost = deletePost;
window.post = post;
window.selectImg = selectImg;