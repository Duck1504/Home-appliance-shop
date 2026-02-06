const productList = document.getElementById("productList");

const pageNumbers = document.getElementById("pageNumbers");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");

const brandCheckboxes = document.querySelectorAll(".filter-brand");
const priceCheckboxes = document.querySelectorAll(".filter-price");
const capacityCheckboxes = document.querySelectorAll(".filter-capacity");

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("categoryId");

const sortSelect = document.getElementById("sortSelect");

const PAGE_SIZE = 12;
let currentPage = 1;
let allProducts = [];
let filteredProducts = [];

if (!categoryId) {
  productList.innerHTML = "<p>Không có danh mục</p>";
  throw new Error("categoryId not found");
}

// =======================
// GỌI API
// =======================
fetch(`https://localhost:7250/api/products/by-category/${categoryId}`)
  .then((res) => {
    if (!res.ok) throw new Error("Load sản phẩm thất bại");
    return res.json();
  })
  .then((data) => {
    allProducts = data || [];
    filteredProducts = allProducts;
    currentPage = 1;
    renderPage();
  })
  .catch((err) => {
    console.error(err);
    productList.innerHTML = "<p>Lỗi tải sản phẩm</p>";
  });

// =======================
// RENDER THEO TRANG
// =======================
function renderPage() {
  productList.innerHTML = "";

  if (!allProducts.length) {
    productList.innerHTML = `
            <p class="col-span-full text-center text-gray-500">
                Danh mục này chưa có sản phẩm
            </p>`;
    pageNumbers.innerHTML = "";
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filteredProducts.slice(start, end);

  pageItems.forEach((p) => {
    let imageUrl = "images/no-image.png";

    if (Array.isArray(p.images) && p.images.length > 0) {
      const img = p.images.find((i) => i.isMain) || p.images[0];
      imageUrl = img.imageUrl?.startsWith("http")
        ? img.imageUrl
        : `https://localhost:7250${img.imageUrl}`;
    }

    productList.innerHTML += `
<a href="product_detail.html?id=${p.id}"
   class="border rounded-lg p-3 hover:shadow transition flex flex-col h-full">

    <img src="${imageUrl}"
        class="w-full h-40 object-cover rounded"
        onerror="this.src='images/no-image.png'">

    <h3 class="font-bold mt-2 line-clamp-2 flex-1">
        ${p.name}
    </h3>

    <p class="text-red-500 font-semibold mb-3">
        ${Number(p.price).toLocaleString("vi-VN")} ₫
    </p>

    <button onclick="event.preventDefault(); addToCart(${p.id})"
        class="mt-auto w-full bg-primary/10 hover:bg-primary
        text-primary hover:text-white font-medium text-sm py-2
        rounded-lg transition-colors flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-[18px]">
            add_shopping_cart
        </span>
        Thêm vào giỏ
    </button>
</a>
`;
  });

  renderPagination();
}

// =======================
// ADD TO CART (FIXED)
// =======================
function addToCart(productId) {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Chưa đăng nhập",
      text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      confirmButtonText: "Đăng nhập",
      showCancelButton: true,
      cancelButtonText: "Để sau",
      confirmButtonColor: "#137fec",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../authen/login.html";
      }
    });
    return;
  }

  authFetch("https://localhost:7250/api/cart", {
    method: "POST",
    body: JSON.stringify({
      productId: productId,
      quantity: 1,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã thêm vào giỏ hàng",
        timer: 1200,
        showConfirmButton: false,
      });
    })
    .catch(() => {
      Swal.fire("Lỗi", "Có lỗi khi thêm giỏ hàng", "error");
    });
}

// =======================
// RENDER PAGINATION
// =======================
function renderPagination() {
  pageNumbers.innerHTML = "";

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `
            size-10 rounded-lg border
            ${i === currentPage ? "bg-primary text-white" : ""}
        `;
    btn.onclick = () => goPage(i);
    pageNumbers.appendChild(btn);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// =======================
// PAGE CONTROL
// =======================
function goPage(page) {
  currentPage = page;
  renderPage();
}

prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
};

nextBtn.onclick = () => {
  const totalPages = Math.ceil(allProducts.length / PAGE_SIZE);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
};

[...brandCheckboxes, ...priceCheckboxes, ...capacityCheckboxes].forEach((cb) =>
  cb.addEventListener("change", applyFilters),
);
function applyFilters() {
  const selectedBrands = [...brandCheckboxes]
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  const selectedPrices = [...priceCheckboxes]
    .filter((cb) => cb.checked)
    .map((cb) => ({
      min: Number(cb.dataset.min),
      max: Number(cb.dataset.max ?? Infinity),
    }));

  const selectedCapacities = [...capacityCheckboxes]
    .filter((cb) => cb.checked)
    .map((cb) => ({
      min: Number(cb.dataset.min),
      max: Number(cb.dataset.max ?? Infinity),
    }));

  filteredProducts = allProducts.filter((p) => {
    const matchBrand =
      selectedBrands.length === 0 || selectedBrands.includes(p.nhanhieu);

    const matchPrice =
      selectedPrices.length === 0 ||
      selectedPrices.some((r) => p.price >= r.min && p.price <= r.max);
    const capacityValue = p.dungtich
      ? parseInt(p.dungtich) // "9 lít" → 9
      : 0;
    const matchCapacity =
      selectedCapacities.length === 0 ||
      selectedCapacities.some(
        (r) => capacityValue >= r.min && capacityValue <= r.max,
      );

    return matchBrand && matchPrice && matchCapacity;
  });
  currentPage = 1;
  renderPage();
}

sortSelect.addEventListener("change", () => {
  const value = sortSelect.value;

  switch (value) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;

    case "newest":
      filteredProducts.sort((a, b) => b.id - a.id);
      break;

    case "popular":
    default:
      // giữ nguyên
      break;
  }

  currentPage = 1;
  renderPage();
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const loginBtn = document.getElementById("loginBtn");
  const userInfo = document.getElementById("userInfo");
  const usernameSpan = document.getElementById("username");

  if (user) {
    // Đã đăng nhập
    loginBtn.classList.add("hidden");
    userInfo.classList.remove("hidden");
    userInfo.classList.add("flex");
    usernameSpan.innerText = user.username;
  } else {
    // Chưa đăng nhập
    loginBtn.classList.remove("hidden");
    userInfo.classList.add("hidden");
  }
});
