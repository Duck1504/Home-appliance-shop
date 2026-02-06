// ================= AUTH COMMON =================

function getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
    return !!localStorage.getItem("token");
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.href = "/authen/login.html";
}
function isAdmin() {
    const user = getUser();
    return user && user.role === "Admin";
}
function renderAuthUI() {
    const loginBtn = document.getElementById("loginBtn");
    const userInfo = document.getElementById("userInfo");
    const usernameEl = document.getElementById("username");
    const adminLink = document.getElementById("adminLink");

    const user = getUser();

    console.log("USER:", user); 
    console.log("IS ADMIN:", isAdmin());

    if (isLoggedIn()) {
        const user = getUser();

        loginBtn?.classList.add("hidden");
        userInfo?.classList.remove("hidden");

        if (usernameEl && user) {
            usernameEl.innerText = user.username;
        }
        if (adminLink && isAdmin()) {
            adminLink.classList.remove("hidden");
        } else {
            adminLink?.remove();
        }
    } else {
        loginBtn?.classList.remove("hidden");
        userInfo?.classList.add("hidden");
        adminLink?.remove();
    }
}

// tự chạy khi load trang
document.addEventListener("DOMContentLoaded", renderAuthUI);

function requireAdmin() {
    if (!isLoggedIn()) {
        location.href = "/authen/login.html";
        return;
    }
    if (!isAdmin()) {
        Swal.fire(
            "Không có quyền",
            "Bạn không phải admin",
            "error"
        ).then(() => location.href = "/index.html");
    }
}