const form = document.getElementById("registerForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // ===== VALIDATE =====
    if (!username || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp");
        return;
    }

    // ===== DATA GỬI LÊN API =====
    const data = {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
    };

    try {
        const res = await fetch("https://localhost:7250/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const msg = await res.text();
            alert(msg);
            return;
        }

        alert("🎉 Đăng ký thành công!");
        window.location.href = "login.html"; // nếu có trang login
    }
    catch (err) {
        console.error(err);
        alert("Lỗi kết nối server");
    }
});
