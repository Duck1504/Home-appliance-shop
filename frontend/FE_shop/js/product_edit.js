function isAdmin() {
  return localStorage.getItem("role") === "Admin";
}
if (!isAdmin()) {
    Swal.fire(
        "Không có quyền",
        "Chỉ admin mới được chỉnh sửa sản phẩm",
        "error"
    ).then(() => {
        window.location.href = "/index.html";
    });
}
const API_URL = "https://localhost:7250/api/products";
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
    alert("Thiếu ID sản phẩm");
    location.href = "product_list_admin.html";
}

// DOM
const form = document.getElementById("productForm");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const categorySelect = document.getElementById("categorySelect");

let removeImage = false; // 👈 flag xóa ảnh

// ===== LOAD DỮ LIỆU CŨ =====
fetch(`${API_URL}/${productId}`)
    .then(res => {
        if (!res.ok) throw new Error("Load failed");
        return res.json();
    })
    .then(p => {
        document.getElementById("name").value = p.name;
        document.getElementById("price").value = p.price;
        document.getElementById("quantity").value = p.quantity;
        document.getElementById("description").value = p.description || "";
        categorySelect.value = p.categoryId;

        if (p.image) {
            imagePreview.src = `https://localhost:7250${p.image}`;
            imagePreview.classList.remove("hidden");
            uploadPlaceholder.classList.add("hidden");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Không load được dữ liệu cũ");
    });

// ===== PREVIEW ẢNH MỚI =====
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    removeImage = false;

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.classList.remove("hidden");
    uploadPlaceholder.classList.add("hidden");
});

// ===== NÚT XÓA ẢNH =====
function removeProductImage() {
    removeImage = true;
    imageInput.value = "";
    imagePreview.src = "";
    imagePreview.classList.add("hidden");
    uploadPlaceholder.classList.remove("hidden");
}

// ===== SUBMIT PUT =====
form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);

    if (imageInput.files.length > 0) {
        formData.append("ImageFile", imageInput.files[0]);
    }

    formData.append("RemoveImage", removeImage);

    fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        body: formData
    })
        .then(res => {
            if (!res.ok) throw new Error();
            alert("Cập nhật thành công");
            location.href = "product_list_admin.html";
        })
        .catch(() => alert("Cập nhật thất bại"));
});
    requireAdmin();