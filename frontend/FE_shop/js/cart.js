const cartList = document.querySelector(".flex.flex-col.gap-4");
const summaryText = document.querySelector("p.text-base");
const subtotalEl = document.querySelector(".text-primary.text-2xl");

const API_BASE = "https://localhost:7250/api/cart";

let cart = [];

/* =======================
   LOAD CART
======================= */
async function loadCart() {
  try {
    const res = await authFetch(API_BASE);
    if (!res.ok) throw new Error();

    cart = await res.json();
    renderCart();
  } catch {
    cartList.innerHTML = `<p class="text-red-500">Lỗi tải giỏ hàng</p>`;
  }
}

document.getElementById("goCheckoutBtn").addEventListener("click", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Chưa đăng nhập",
            text: "Vui lòng đăng nhập để thanh toán",
            confirmButtonText: "Đăng nhập",
            showCancelButton: true,
            cancelButtonText: "Để sau"
        }).then(result => {
            if (result.isConfirmed) {
                location.href = "/authen/login.html";
            }
        });
        return;
    }

    location.href = "../user/checkout.html";
});

/* =======================
   RENDER CART
======================= */
function renderCart() {
  cartList.innerHTML = "";

  if (!cart.length) {
    cartList.innerHTML = `<p class="text-gray-500">Giỏ hàng trống</p>`;
    summaryText.innerText = "Bạn có 0 sản phẩm trong giỏ hàng";
    subtotalEl.innerText = "0₫";
    return;
  }

  let total = 0;
  let totalQty = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    totalQty += item.quantity;

    const imgUrl = item.imageUrl?.startsWith("http")
      ? item.imageUrl
      : `https://localhost:7250${item.imageUrl}`;

    cartList.innerHTML += `
        <div
            class="group flex flex-col sm:flex-row gap-4 bg-white dark:bg-[#1a2632] p-4 rounded-xl shadow-sm border border-transparent hover:border-primary/20 transition-all">

            <!-- Image -->
            <div class="shrink-0">
                <div class="bg-center bg-no-repeat bg-cover rounded-lg w-24 h-24 sm:w-32 sm:h-32 bg-[#f0f2f4]"
                    style="background-image:url('${imgUrl}')">
                </div>
            </div>

            <!-- Content -->
            <div class="flex flex-1 flex-col justify-between">
                <div class="flex justify-between gap-4">
                    <div>
                        <h3 class="text-[#111418] dark:text-white text-lg font-bold leading-snug mb-1">
                            ${item.productName}
                        </h3>
                        <p class="text-[#617589] dark:text-[#9aaebd] text-sm">
                            Số lượng: ${item.quantity}
                        </p>
                    </div>

                    <!-- Delete -->
                    <button
                        onclick="removeItem(${item.productId})"
                        class="text-[#617589] hover:text-red-500 transition-colors p-1"
                        title="Xóa sản phẩm">
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>

                <div class="flex justify-between items-end mt-4">
                    <!-- Price -->
                    <div class="flex flex-col">
                        <span class="text-primary font-bold text-lg">
                            ${(item.price * item.quantity).toLocaleString("vi-VN")}₫
                        </span>
                        ${
                          item.oldPrice
                            ? `<span class="text-[#617589] text-xs line-through">
                                    ${item.oldPrice.toLocaleString("vi-VN")}₫
                                   </span>`
                            : ""
                        }
                    </div>

                    <!-- Quantity -->
                    <div class="flex items-center gap-1 bg-[#f0f2f4] dark:bg-[#2a3b4d] rounded-lg p-1">
                        <button
                            onclick="changeQty(${item.productId}, ${item.quantity - 1})"
                            class="size-8 flex items-center justify-center rounded-md bg-white dark:bg-[#101922]
                                   text-[#111418] dark:text-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                            <span class="material-symbols-outlined text-[16px]">remove</span>
                        </button>

                        <input
                            class="w-10 text-center bg-transparent border-none p-0
                                   text-[#111418] dark:text-white font-semibold focus:ring-0"
                            type="number"
                            value="${item.quantity}"
                            readonly />

                        <button
                            onclick="increaseQty(${item.productId}, ${item.quantity}, ${item.productQuantity})"

                            class="size-8 flex items-center justify-center rounded-md bg-white dark:bg-[#101922]
                                   text-[#111418] dark:text-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                            <span class="material-symbols-outlined text-[16px]">add</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
  });

  summaryText.innerText = `Bạn có ${totalQty} sản phẩm trong giỏ hàng`;
  subtotalEl.innerText = total.toLocaleString("vi-VN") + "₫";
}

function increaseQty(productId, currentQty, maxQty) {
  if (currentQty >= maxQty) return; // CHẶN Ở ĐÂY

  changeQty(productId, currentQty + 1);
}

/* =======================
   UPDATE QUANTITY
======================= */
async function changeQty(productId, quantity) {
  if (quantity <= 0) {
    removeItem(productId);
    return;
  }

  await authFetch(
    `${API_BASE}/quantity?productId=${productId}&quantity=${quantity}`,
    { method: "PUT" }
  );

  loadCart();
}

/* =======================
   REMOVE ITEM
======================= */
async function removeItem(productId) {
  await authFetch(`${API_BASE}/${productId}`, {
    method: "DELETE",
  });

  loadCart();
}

/* =======================
   INIT
======================= */
loadCart();
