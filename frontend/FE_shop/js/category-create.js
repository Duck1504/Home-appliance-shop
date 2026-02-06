function isAdmin() {
  return localStorage.getItem("role") === "Admin";
}
if (!isAdmin()) {
    Swal.fire(
        "Không có quyền",
        "Chỉ admin mới được thêm danh mục",
        "error"
    ).then(() => {
        window.location.href = "/index.html";
    });
}
const form = document.getElementById("categoryForm");
const nameInput = document.getElementById("categoryName");
const imageInput = document.getElementById("categoryImage");
const imagePreview = document.getElementById("imagePreview");

/* ================= PREVIEW IMAGE ================= */
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    // check dung lượng (2MB)
    if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
            icon: "warning",
            title: "Ảnh quá lớn",
            text: "Dung lượng ảnh tối đa 2MB",
        });
        this.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
});

/* ================= SUBMIT FORM ================= */
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!name) {
        Swal.fire({
            icon: "error",
            title: "Thiếu thông tin",
            text: "Vui lòng nhập tên danh mục",
        });
        return;
    }

    const formData = new FormData();
    formData.append("Name", name);

    if (imageFile) {
        formData.append("ImageFile", imageFile);
    }

    fetch("https://localhost:7250/api/categories", {
        method: "POST",
        body: formData
    })
        .then(res => {
            if (!res.ok) throw new Error("Tạo danh mục thất bại");
            return res.json();
        })
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Danh mục đã được tạo",
                timer: 2000,
                showConfirmButton: false
            });

            form.reset();
            imagePreview.classList.add("hidden");
        })
        .catch(err => {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể thêm danh mục",
            });
        });
});
