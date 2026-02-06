document.addEventListener("DOMContentLoaded", () => {
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
  Swal.fire("Lỗi", "Không tìm thấy sản phẩm", "error");
  throw new Error("Missing product id");
}

const mainImage = document.getElementById("mainImage");
const thumbList = document.getElementById("thumbList");

fetch(`https://localhost:7250/api/products/${productId}`)
  .then(res => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(p => {
    console.log("API DATA:", p);
    renderImages(p.images);
    renderInfo(p);
  })
  .catch(() => {
    Swal.fire("Lỗi", "Không tải được dữ liệu sản phẩm", "error");
  });

function renderImages(images) {
  thumbList.innerHTML = "";

  if (!images || images.length === 0) {
    mainImage.src = "images/no-image.png";
    return;
  }

  const mainImg =
    images.find(i => i.isMain)?.imageUrl || images[0].imageUrl;

  mainImage.src = formatImage(mainImg);

  images.forEach((img, index) => {
    const btn = document.createElement("button");
    btn.className =
      "relative flex h-24 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 hover:ring-2 hover:ring-primary";

    const image = document.createElement("img");
    image.src = formatImage(img.imageUrl);
    image.className = "h-full w-full object-cover rounded-lg";

    if (img.isMain) {
      btn.classList.add("ring-2", "ring-primary");
    }

    btn.onclick = () => {
      mainImage.src = formatImage(img.imageUrl);

      document
        .querySelectorAll("#thumbList button")
        .forEach(b => b.classList.remove("ring-2", "ring-primary"));

      btn.classList.add("ring-2", "ring-primary");
    };

    btn.appendChild(image);
    thumbList.appendChild(btn);
  });
}

function formatImage(url) {
  if (!url) return "images/no-image.png";
  return url.startsWith("http")
    ? url
    : `https://localhost:7250${url}`;
}

function renderInfo(p) {
  document.getElementById("productName").innerText = p.name;
  document.getElementById("productPrice").innerText =
    p.price.toLocaleString("vi-VN") + " ₫";

  document.getElementById("productDesc").innerText =
    p.description || "Chưa có mô tả";

  document.getElementById("kieutu").innerText = p.kieutu || "-";
  document.getElementById("nhanhieu").innerText = p.nhanhieu || "-";
  document.getElementById("dungtich").innerText = p.dungtich || "-";
  document.getElementById("kichthuoc").innerText = p.kichthuoc || "-";
  document.getElementById("nangluong").innerText = p.nangluongtieuthu || "-";
  document.getElementById("trongluong").innerText = p.trongluong || "-";
  document.getElementById("namsx").innerText = p.namsx || "-";
  document.getElementById("madein").innerText = p.madein || "-";
}
});
