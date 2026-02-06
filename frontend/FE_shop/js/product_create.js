function isAdmin() {
  return localStorage.getItem("role") === "Admin";
}
if (!isAdmin()) {
    Swal.fire(
        "Không có quyền",
        "Chỉ admin mới được thêm sản phẩm",
        "error"
    ).then(() => {
        window.location.href = "/index.html";
    });
}
// ================= DOM =================
const form = document.getElementById("productForm");
const imageInput = document.getElementById("imageInput");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const priceInput = document.getElementById("price");

// ================= STATE =================
let selectedFiles = [];

// ================= FORMAT GIÁ =================
priceInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
});

priceInput.addEventListener("blur", function () {
    if (this.value) {
        this.value = Number(this.value).toLocaleString("vi-VN");
    }
});

priceInput.addEventListener("focus", function () {
    this.value = this.value.replace(/\./g, "");
});

// ================= PREVIEW MULTIPLE IMAGES =================
imageInput.addEventListener("change", function () {
    const files = Array.from(this.files);

    files.forEach(file => {
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire("Ảnh quá lớn", "Tối đa 2MB", "warning");
            return;
        }

        selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = e => {
            const div = document.createElement("div");
            div.className = "relative";

            div.innerHTML = `
                <img src="${e.target.result}" class="w-full h-24 object-cover rounded">
                <button type="button"
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 text-xs">
                    ✕
                </button>
            `;

            div.querySelector("button").onclick = () => {
                selectedFiles = selectedFiles.filter(f => f !== file);
                div.remove();
            };

            imagePreviewContainer.appendChild(div);
        };

        reader.readAsDataURL(file);
    });

    // reset input để chọn lại cùng file
    this.value = "";
});

// ================= SUBMIT FORM =================
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const price = priceInput.value.replace(/\./g, "");
    const quantity = document.getElementById("quantity").value;
    const description = document.getElementById("description").value;
    const nhanhieu = document.getElementById("nhanhieu").value.trim();
    const kieutu = document.getElementById("kieutu").value.trim();
    const dungtich = document.getElementById("dungtich").value.trim();
    const kichthuoc = document.getElementById("kichthuoc").value.trim();
    const nangluongtieuthu = document.getElementById("nangluongtieuthu").value.trim();
    const trongluong = document.getElementById("trongluong").value.trim();
    const chatlieu = document.getElementById("chatlieu").value.trim();
    const namsx = document.getElementById("namsx").value.trim();
    const madein = document.getElementById("madein").value.trim();

    const categoryId = document.getElementById("categorySelect").value;

    if (!name || !price || !quantity || !categoryId) {
        Swal.fire("Thiếu thông tin", "Vui lòng nhập đầy đủ", "error");
        return;
    }

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Price", price);
    formData.append("Quantity", quantity);
    formData.append("Description", description);
    formData.append("CategoryId", categoryId);
    formData.append("nhanhieu", nhanhieu);
    formData.append("kieutu", kieutu);
    formData.append("dungtich", dungtich);
    formData.append("kichthuoc", kichthuoc);
    formData.append("nangluongtieuthu", nangluongtieuthu);
    formData.append("trongluong", trongluong);
    formData.append("chatlieu", chatlieu);
    formData.append("namsx", namsx);
    formData.append("madein", madein);

    // gửi nhiều ảnh
    selectedFiles.forEach(file => {
    formData.append("ImageFiles", file); // ✅ ĐÚNG TÊN DTO
});

    try {
        const res = await fetch("https://localhost:7250/api/products", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("BE error:", text);
            throw new Error("Fail");
        }

        Swal.fire("Thành công", "Đã thêm sản phẩm", "success");

        form.reset();
        imagePreviewContainer.innerHTML = "";
        selectedFiles = [];

    } catch (err) {
        console.error(err);
        Swal.fire("Lỗi", "Không thể thêm sản phẩm", "error");
    }
});

