const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    Swal.fire("Thiếu thông tin", "Vui lòng nhập email và mật khẩu", "warning");
    return;
  }

  try {
    Swal.fire({
      title: "Đang đăng nhập...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const res = await fetch("https://localhost:7250/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Email hoặc mật khẩu không đúng");

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    // 🔐 LƯU TOÀN BỘ THÔNG TIN CẦN DÙNG
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId); // ✅ CỰC KỲ QUAN TRỌNG
    localStorage.setItem("role", data.role);

    localStorage.setItem("user", JSON.stringify({
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role
    }));

    Swal.fire({
      icon: "success",
      title: "Đăng nhập thành công",
      text: `Xin chào ${data.username}`,
      timer: 1200,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "/index.html";
    });

  } catch (err) {
    Swal.fire("Đăng nhập thất bại", err.message, "error");
  }
});
