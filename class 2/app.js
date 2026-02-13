let SUPABASE_URL = "https://xzwwaqbuyodnxkvewprv.supabase.co";
let SUPABASE_ANON_KEY = "sb_publishable_p2iGkUXSOQWUuNt5_J1-mw_SOYtmGFa";
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
var cardbg = null;
var editId;

async function searchPosts() {
    let searchValue = document.getElementById("searchValue").value;
    var posts = document.getElementById("posts")
    posts.innerHTML = ""
    try {
        let query = supabase.from('post').select("*").order('id', { ascending: false })
        if (searchValue.trim()) {
            // query.ilike("title", `%${searchValue}%`)
             query = query.or(`title.ilike.%${searchValue}%, description.ilike.%${searchValue}%`) 
        } const { data, error } = await query
        console.log(data);
        if (data.length === 0) {
            posts.innerHTML = "No post found"
        }
        var posts = document.getElementById("posts");
        data.forEach(post => {
            posts.innerHTML += `
    <div class="card m-2">
        <div style="background-image: url(${post.img_url}); background-size: cover;" class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.description}</p>
        </div>
        <div class="ms-auto m-2">
            <button onclick="editPost(event)" class="btn myedit">Edit</button>
            <button onclick="deletePost(event , ${post.id})" class="btn mydelete">Delete</button>
        </div>
    </div>`
        })
        if (error) console.log("search ", error);

    } catch (error) {
        console.log(error);

    }
}



window.addEventListener("DOMContentLoaded", async () => {
    try {
        const { data, error } = await supabase.from('post').select("*").order('id', { ascending: false });
        if (error) {
            console.log("Supabase fetch error:", error);
            return;
        }
        console.log(data);

        data.forEach(post => {
            appendPostToDOM(post);
        });

    } catch (err) {
        console.log(err);
    }
});


function appendPostToDOM(post) {
    var posts = document.getElementById("posts");

    posts.innerHTML += `
    <div class="card m-2">
        <div style="background-image: url(${post.img_url}); background-size: cover;" class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.description}</p>
        </div>
        <div class="ms-auto m-2">
            <button onclick="editPost(event)" class="btn myedit">Edit</button>
            <button onclick="deletePost(event , ${post.id})" class="btn mydelete">Delete</button>
        </div>
    </div>`;
}

function editPost(event, id) {
    var card = event.target.parentNode.parentNode;
    var title = card.children[0].children[0].innerHTML;
    var description = card.children[0].children[1].innerHTML;
    document.getElementById("title").value = title;
    document.getElementById("description").value = description;
    card.remove();
    editId = id;
}

async function deletePost(event, id) {
    try {
        const { data, error } = await supabase.from("post").delete().eq("id", id)
        console.log(event);
        if (error) console.log("delete error", error);
        console.log(event.target.parentNode.parentNode);
        var card = event.target.parentNode.parentNode;
        card.remove()
    } catch (error) {
        console.log(error);

    }
}

async function post() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;

    if (title.trim() && description.trim() && cardbg) {
        try {
            const { data, error } = await supabase
                .from('post')
                .insert({ title, description, img_url: cardbg })
                .select("*");
            if (error) {
                console.log("Supabase insert error:", error);
                return;
            }
            console.log("Inserted:", data[0]);
            appendPostToDOM(data[0]);
            document.getElementById("title").value = "";
            document.getElementById("description").value = "";
            cardbg = null;
            document.querySelectorAll(".bgImg").forEach(img => img.classList.remove("selectedImg"));

        } catch (err) {
            console.log(err);
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Empty Post...",
            text: "Enter title, description & select an image",
        });
    }
}

function selectImg(src, event) {
    cardbg = src;
    document.querySelectorAll(".bgImg").forEach(img => img.classList.remove("selectedImg"));
    event.target.classList.add("selectedImg");
}
