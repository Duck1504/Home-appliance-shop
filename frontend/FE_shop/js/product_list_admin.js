function isAdmin() {
  return localStorage.getItem("role") === "Admin";
}
if (!isAdmin()) {
    Swal.fire(
        "Không có quyền",
        "Chỉ admin mới được xem danh sách sản phẩm",
        "error"
    ).then(() => {
        window.location.href = "/index.html";
    });
}
const API_URL = "https://localhost:7250/api/products";
const tbody = document.getElementById("productTableBody");
const brandCheckboxes = document.querySelectorAll(".filter-brand");
const priceCheckboxes = document.querySelectorAll(".filter-price");
const capacityCheckboxes = document.querySelectorAll(".filter-capacity");

/* ===== Pagination ===== */
let allProducts = [];
let currentPage = 1;
const pageSize = 5;
let filteredProducts = [];

/* ===== Fetch data ===== */
fetch(API_URL)
    .then(res => {
        if (!res.ok) throw new Error("Không load được sản phẩm");
        return res.json();
    })
    .then(products => {
        allProducts = products;
        filteredProducts = allProducts;      // LƯU TOÀN BỘ
        renderPage();                // render trang đầu
        renderPagination();          // render nút phân trang
    })
    .catch(err => {
        console.error(err);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-6 text-gray-500">
                    Không tải được dữ liệu
                </td>
            </tr>`;
    });

/* ===== Render theo trang ===== */
function renderPage() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageProducts = filteredProducts.slice(start, end);
    renderProducts(pageProducts);
}

/* ===== Render bảng ===== */
function renderProducts(products) {
    tbody.innerHTML = "";

    if (!products || products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-6 text-gray-500">
                    Chưa có sản phẩm
                </td>
            </tr>`;
        return;
    }

    products.forEach(p => {
        const imageUrl = p.image
            ? "https://localhost:7250" + p.image
            : "https://via.placeholder.com/150";

        tbody.innerHTML += `
        <tr>
            <td class="px-6 py-4">
                <img src="${imageUrl}" class="w-12 h-12 object-cover rounded-lg">
            </td>

            <td class="px-6 py-4">
                <div class="flex flex-col">
                    <span class="font-bold">${p.name}</span>
                    <span class="text-xs text-gray-500">SKU: ${p.sku ?? "-"}</span>
                </div>
            </td>

            <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    ${p.categoryName ?? "-"}
                </span>
            </td>

            <td class="px-6 py-4 font-bold">
                ${formatPrice(p.price)}
            </td>

            <td class="px-6 py-4 font-bold">
                ${p.quantity === 0
                    ? `<span class="text-red-600">Hết hàng</span>`
                    : p.quantity}
            </td>

            <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                    <button onclick="editProduct(${p.id})"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button onclick="deleteProduct(${p.id})"
                        class="p-2 text-red-600 hover:bg-red-50 rounded">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        </tr>`;
    });
}

/* ===== Pagination UI ===== */
function renderPagination() {
    const pagination = document.getElementById("pagination");
    const info = document.getElementById("paginationInfo");

    pagination.innerHTML = "";

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / pageSize);

    if (total === 0) {
        info.textContent = "Không có sản phẩm";
        return;
    }

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);
    info.textContent = `Hiển thị ${startItem} - ${endItem} trên ${total} sản phẩm`;

    /* Prev */
    pagination.innerHTML += `
        <button onclick="changePage(${currentPage - 1})"
            class="p-2 rounded-lg border
            ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}"
            ${currentPage === 1 ? "disabled" : ""}>
            <span class="material-symbols-outlined text-sm">chevron_left</span>
        </button>`;

    /* Page numbers */
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <button onclick="changePage(${i})"
                class="w-8 h-8 rounded-lg text-xs font-bold
                ${i === currentPage
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200"}">
                ${i}
            </button>`;
    }

    /* Next */
    pagination.innerHTML += `
        <button onclick="changePage(${currentPage + 1})"
            class="p-2 rounded-lg border
            ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}"
            ${currentPage === totalPages ? "disabled" : ""}>
            <span class="material-symbols-outlined text-sm">chevron_right</span>
        </button>`;
}

/* ===== Change page ===== */
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderPage();
    renderPagination();
}

/* ===== Helpers ===== */
function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "₫";
}

function editProduct(id) {
    window.location.href = `product_edit_admin.html?id=${id}`;
}

function deleteProduct(id) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error("Xóa thất bại");
            location.reload();
        })
        .catch(() => alert("Không xóa được sản phẩm"));
}

/* ===== Filter ===== */
[...brandCheckboxes, ...priceCheckboxes, ...capacityCheckboxes]
    .forEach(cb => cb.addEventListener("change", applyFilters));

    function applyFilters() {
    // ===== LẤY GIÁ TRỊ ĐÃ CHỌN =====
    const selectedBrands = [...brandCheckboxes]
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const selectedPrices = [...priceCheckboxes]
        .filter(cb => cb.checked)
        .map(cb => ({
            min: Number(cb.dataset.min),
            max: Number(cb.dataset.max)
        }));

    const selectedCapacities = [...capacityCheckboxes]
        .filter(cb => cb.checked)
        .map(cb => ({
            min: Number(cb.dataset.min),
            max: Number(cb.dataset.max)
        }));

    // ===== LỌC SẢN PHẨM =====
    filteredProducts = allProducts.filter(p => {

        /* --- Thương hiệu --- */
        const matchBrand =
            selectedBrands.length === 0 ||
            selectedBrands.includes(p.nhanhieu);

        /* --- Giá --- */
        const matchPrice =
            selectedPrices.length === 0 ||
            selectedPrices.some(r =>
                p.price >= r.min && p.price <= r.max
            );

        /* --- Dung tích --- */
        const matchCapacity =
            selectedCapacities.length === 0 ||
            selectedCapacities.some(r =>
                p.dungtich >= r.min && p.dungtich <= r.max
            );

        return matchBrand && matchPrice && matchCapacity;
    });

    // reset page
    currentPage = 1;
    renderPage();
    renderPagination();
}
