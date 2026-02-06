document.addEventListener("DOMContentLoaded", () => {
  const categoryList = document.getElementById("categoryList");

  const loginBtn = document.querySelector("button[onclick='goToLogin()']");
  const userInfo = document.getElementById("userInfo");
  const usernameEl = document.getElementById("username");

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  // ===== ÉP TRẠNG THÁI BAN ĐẦU =====
  if (loginBtn) loginBtn.classList.remove("hidden");
  if (userInfo) userInfo.classList.add("hidden");

  // ===== NẾU ĐÃ ĐĂNG NHẬP =====
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);

      if (loginBtn) loginBtn.classList.add("hidden");
      if (userInfo) userInfo.classList.remove("hidden");
      if (usernameEl) usernameEl.innerText = user.username;
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // ===== LOAD CATEGORY =====
  fetch("https://localhost:7250/api/categories")
    .then((res) => {
      if (!res.ok) throw new Error("Không load được category");
      return res.json();
    })
    .then((categories) => {
      categoryList.innerHTML = "";

      categories.forEach((cat) => {
        const imgUrl = cat.imageUrl.startsWith("http")
          ? cat.imageUrl
          : "https://localhost:7250/" + cat.imageUrl.replace(/^\/+/, "");

        categoryList.innerHTML += `
                    <a href="/user/product_list.html?categoryId=${cat.id}"
                       class="group flex flex-col gap-3 cursor-pointer">
                        <div class="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            <img src="${imgUrl}"
                                 class="w-full h-full object-cover group-hover:scale-110 transition" />
                        </div>
                        <p class="text-center font-bold text-sm">${cat.name}</p>
                    </a>
                `;
      });
    })
    .catch((err) => console.error(err));
});

// ===== NAV (BẮT BUỘC ĐỂ NGOÀI) =====
function goToLogin() {
  window.location.href = "/authen/login.html";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/index.html";
}
