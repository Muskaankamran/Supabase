import supabase from "./supabase.js";

var cardbg;

async function searchPosts() {
    var searchValue = document.getElementById("searchValue").value
    var posts = document.getElementById("posts");
    posts.innerHTML = "";
    try {
        let query = supabase.from("post").select("*").order('id', { ascending: false })
        if (searchValue.trim()) {
            // query = query.ilike("title", `%${searchValue}%`)
            query = query.or(`title.ilike.%${searchValue}%, discription.ilike.%${searchValue}%`)
        }
        const { data, error } = await query
        console.log(data);
        if (data.length === 0) {
            posts.innerHTML = `<h5>No Posts Found </h5>`
            alert("No posts found")
        }
        data.forEach((post) => {
            var posts = document.getElementById("posts");
            posts.innerHTML += `
           <div class="card m-2">
              <div style="background-image: url(${post.img_url}); background-size: cover;" class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.discription}</p>
              </div>
              <div class="ms-auto m-2">
                  <button onclick="editPost(event)" class="btn myedit">Edit</button>
                  <button onclick="deletePost(event)" class="btn mydelete">Delete</button>
               </div>
            </div>
            `;
        });
        if (error) console.log("Search error", error);
    }
    catch (error) {
        console.log(error);
    }
}




window.addEventListener("DOMContentLoaded", async () => {
    try {
        const { data, error } = await supabase.from('post').select("*");

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
                  <button onclick="editPost(event)" class="btn myedit">Edit</button>
                  <button onclick="deletePost(event)" class="btn mydelete">Delete</button>
               </div>
            </div>`;
        });

    } catch (error) {
        console.log(error);
    }
});

// Edit Post
function editPost(event) {
    var card = event.target.parentNode.parentNode;

    var title = card.children[0].children[0].innerHTML;
    var discription = card.children[0].children[1].innerHTML;

    document.getElementById("title").value = title;
    document.getElementById("discription").value = discription;

    card.remove();
}

// Delete Post
function deletePost(event) {
    var card = event.target.parentNode.parentNode;
    card.remove();
}

// Post Function
async function post() {

    var title = document.getElementById("title").value;
    var discription = document.getElementById("discription").value;

    var posts = document.getElementById("posts");

    if (title.trim() && discription.trim()) {

        try {

            const { data, error } = await supabase
                .from('post')
                .insert({
                    title,
                    discription: discription,
                    img_url: cardbg
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
        alert("Enter title & description");
    }
}

// Select Image
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