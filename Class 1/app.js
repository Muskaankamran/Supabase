let SUPABASE_URL = "https://xzwwaqbuyodnxkvewprv.supabase.co";
let SUPABASE_ANON_KEY = "sb_publishable_p2iGkUXSOQWUuNt5_J1-mw_SOYtmGFa"
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
var cardbg;
window.addEventListener(DOMContentLoaded, async () => {
    try {
        const { data, error } = await supabase.from('post').select("*")
        console.log(data);
        data.forEach(post => {
            var posts = document.getElementById("posts");
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

        });
         if(error) console.log(error);

    }catch (error) {
    console.log(error);
    
  }
})
function editPost(event) {
    var card = event.target.parentNode.parentNode;
    var title = card.children[0].children[0].innerHTML;
    var discription = card.children[0].children[1].innerHTML;

    document.getElementById("title").value = title;
    document.getElementById("discription").value = discription;
    card.remove();
}
function deletePost(event) {
    var card = event.target.parentNode.parentNode;
    card.remove();
}
async function post() {
    var title = document.getElementById("title").value;
    var discription = document.getElementById("discription").value;
    var posts = document.getElementById("posts");

    if (title.trim() && discription.trim()) {
        try {
            const { data, error } = await supabase.from('post').insert({ title, description, img_url: cardbg }).select("*")
            console.log(data[0]);
        if (error) console.log("post error:" , error);
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
    }  else {
        Swal.fire({
            icon: "error",
            title: "Empty Post...",
            text: "Enter title & description",
        });
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
