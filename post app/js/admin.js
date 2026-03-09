import supabase from "../supabase.js";

// 🔐 Check Admin
async function checkAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if(!user || user.user_metadata.role !== "admin") {
    alert("Access Denied");
    window.location.href = "/";
  }
}
checkAdmin();

// 📊 Load Stats
async function loadStats() {
  const { data: posts } = await supabase.from("post").select("*");
  const { data: users } = await supabase.from("users").select("*");
  document.getElementById("totalPosts").innerText = posts.length;
  document.getElementById("totalUsers").innerText = users.length;
}
loadStats();

// 📄 Load All Posts
async function loadPosts() {
  const { data, error } = await supabase.from("post").select("*").order("id",{ascending:false});
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";
  if(!data || data.length===0){ postsContainer.innerHTML="<h4>No posts available</h4>"; return; }
  data.forEach(post=>{
    postsContainer.innerHTML+=`
      <div class="post-card">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        ${post.img_url ? `<img src="${post.img_url}">` : ""}
        <div class="action-buttons">
          <button onclick="deletePost(${post.id})">Delete</button>
        </div>
      </div>
    `;
  });
}

// 🗑 Delete Post
async function deletePost(id) {
  const { error } = await supabase.from("post").delete().eq("id", id);
  if(error){ alert("Error deleting post"); } else { alert("Post deleted"); loadPosts(); loadStats(); }
}

// 👥 Load Users
async function loadUsers() {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML=`
    <h2 class="page-title">Manage Users</h2>
    <table class="users-table">
      <thead>
        <tr>
          <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
        </tr>
      </thead>
      <tbody id="usersTableBody"></tbody>
    </table>
  `;
  const { data, error } = await supabase.from("users").select("*").order("id",{ascending:false});
  const tbody = document.getElementById("usersTableBody");
  data.forEach((user,index)=>{
    tbody.innerHTML+=`
      <tr>
        <td>${index+1}</td>
        <td>${user.name||"-"}</td>
        <td>${user.email}</td>
        <td>${user.phone||"-"}</td>
        <td class="action-buttons">
          <button onclick="viewUserPosts('${user.id}')">Posts</button>
          <button onclick="deleteUser('${user.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// 🔍 View User Posts
async function viewUserPosts(userId){
  const mainContent=document.getElementById("mainContent");
  const { data, error } = await supabase.from("post").select("*").eq("user_id", userId);
  mainContent.innerHTML=`<h2>User Posts</h2>`;
  data.forEach(post=>{
    mainContent.innerHTML+=`
      <div class="post-card">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        ${post.img_url? `<img src="${post.img_url}">` : ""}
      </div>
    `;
  });
}

// 🗑 Delete User
async function deleteUser(userId){
  if(!confirm("Delete this user?")) return;
  const { data, error } = await supabase.from("users").delete().eq("id", userId);
  if(error){ alert("Error deleting user"); } else { alert("User deleted"); loadUsers(); loadStats(); }
}

// 🚪 Logout
async function logout() {
  const { error } = await supabase.auth.signOut();
  if(!error) window.location.href="/";
}

// UI Navigation
window.showDashboard = loadStats;
window.showPosts = loadPosts;
window.loadUsers = loadUsers;
window.deletePost = deletePost;
window.viewUserPosts = viewUserPosts;
window.deleteUser = deleteUser;
window.logout = logout;

// Initial Load
loadPosts();