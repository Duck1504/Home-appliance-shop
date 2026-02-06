const CATEGORY_API = "https://localhost:7250/api/categories";

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
});

async function loadCategories() {
    const select = document.getElementById("categorySelect");

    try {
        const response = await fetch(CATEGORY_API);

        if (!response.ok) {
            throw new Error("Không lấy được danh mục");
        }

        const categories = await response.json();

        categories.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;      // hoặc c.categoryId
            option.textContent = c.name; // hoặc c.categoryName
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Lỗi load category:", error);
        alert("Không thể tải danh mục từ server");
    }
}
