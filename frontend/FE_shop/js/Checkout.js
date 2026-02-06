document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://localhost:7250/api";
  const token = localStorage.getItem("token");
    const BACKEND_URL = "https://localhost:7250";
  if (!token) {
    location.href = "/authen/login.html";
    return;
  }

  let cartItems = [];
  const SHIPPING_FEE = 35000;

  async function loadCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert("Không load được giỏ hàng");
      return;
    }

    cartItems = await res.json();
    renderOrderSummary();
  }

  function renderOrderSummary() {
    const container = document.getElementById("orderItems");
    container.innerHTML = "";

    let subTotal = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.quantity * item.price;
      subTotal += itemTotal;

        const imgUrl = item.imageUrl
  ? (item.imageUrl.startsWith("http")
      ? item.imageUrl
      : `${BACKEND_URL}/${item.imageUrl}`)
  : "/img/no-image.png";

      container.innerHTML += `
    <div class="flex gap-3">
        <div class="h-16 w-16 rounded-lg overflow-hidden border">
            <img src="${imgUrl}" class="w-full h-full object-cover"/>
        </div>
        <div class="flex flex-col flex-1 justify-between">
            <div>
                <h3 class="text-sm font-semibold">${item.productName || "Sản phẩm"}</h3>
                <p class="text-xs text-gray-500">Số lượng: ${item.quantity}</p>
            </div>
            <p class="text-sm font-bold text-primary text-right">
                ${itemTotal.toLocaleString()}₫
            </p>
        </div>
    </div>
    `;
    });

    document.getElementById("subTotal").innerText =
      subTotal.toLocaleString() + "₫";

    document.getElementById("shippingFee").innerText =
      SHIPPING_FEE.toLocaleString() + "₫";

    document.getElementById("discount").innerText = "-0₫";

    document.getElementById("totalAmount").innerText =
      (subTotal + SHIPPING_FEE).toLocaleString() + "₫";
  }

  document.getElementById("checkoutBtn").addEventListener("click", async () => {
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const paymentMethod = document.querySelector(
      "input[name='payment']:checked",
    )?.value;

    if (!fullName) {
  Swal.fire("Thiếu thông tin", "Vui lòng nhập họ tên người nhận", "warning");
  return;
}

if (!phone) {
  Swal.fire("Thiếu thông tin", "Vui lòng nhập số điện thoại", "warning");
  return;
}

if (!/^(0[0-9]{9})$/.test(phone)) {
  Swal.fire("Sai định dạng", "Số điện thoại không hợp lệ", "error");
  return;
}

if (!address) {
  Swal.fire("Thiếu thông tin", "Vui lòng nhập địa chỉ giao hàng", "warning");
  return;
}

if (!paymentMethod) {
  Swal.fire("Thiếu thông tin", "Vui lòng chọn phương thức thanh toán", "warning");
  return;
}

    const body = { receiverName: fullName, phone, address, paymentMethod };

    const res = await fetch(`${API_BASE}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (!res.ok) {
      Swal.fire("Lỗi", result.message || "Thanh toán thất bại", "error");
      return;
    }

    Swal.fire("Thành công", "Đặt hàng thành công", "success").then(
      () => (window.location.href = "../user/order_success.html"),
    );
  });

  loadCart();
});
