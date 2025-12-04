// Variable Data User (Username & Password Hardcoded)
const DATA_USER = {
  username: "user",
  password: "123",
};

// Variable Data Produk
const DATA_PRODUK = {
  gelang: [
    { id: 1, nama: "Gelang Emas Simple", harga: 500000, image: "tara.png" },
    { id: 2, nama: "Gelang Mutiara", harga: 750000, image: "mutiiara.png" },
    { id: 3, nama: "Gelang Kulit", harga: 150000, image: "unnamed (1).jpg" },
  ],
  anting: [
    { id: 4, nama: "Anting Berlian Kecil", harga: 1200000, image: "berlian.png" },
    { id: 5, nama: "Anting Hoop Emas", harga: 450000, image: "hoop emas.png" },
    { id: 6, nama: "Anting Perak", harga: 200000, image: "anting perak.png" },
  ],
  kalung: [
    { id: 7, nama: "Kalung Liontin Hati", harga: 850000, image : "kalung liontin.png" },
    { id: 8, nama: "Kalung Rantai Emas", harga: 1500000, image : "kalung rantai emas.png" },
    { id: 9, nama: "Choker Beludru", harga: 100000, image : "choker.png" },
  ],
  cincin: [
    { id: 10, nama: "Cincin Tunangan", harga: 3000000, image : "cincin berlian.png" },
    { id: 11, nama: "Cincin Perak Polos", harga: 250000, image : "cincin perak.png" },
    { id: 12, nama: "Cincin Emas Permata", harga: 500000, image : "cincin emas permata.png" },
  ],
};

// Variable Data Keranjang (diambil dari localStorage agar persisten antar halaman)
let dataKeranjang = JSON.parse(localStorage.getItem("keranjang_nida")) || [];

// --- FUNCTIONS ---

// 1. Function Login
function login() {
  const userInput = document.getElementById("username").value;
  const passInput = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  // Kondisi Validasi Login
  if (userInput === DATA_USER.username && passInput === DATA_USER.password) {
    // Simpan sesi login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", userInput);
    window.location.href = "menu.html";
  } else {
    errorMsg.textContent = "Username atau password salah!";
    errorMsg.style.display = "block";
  }
}

// Function Logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

// Cek Status Login (dipanggil di setiap halaman kecuali index.html)
function cekLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn && window.location.pathname !== "/index.html") {
    window.location.href = "index.html";
  }
}

// 2. Function Tampilkan Menu (Dashboard)
function tampilkanMenu() {
  const welcomeMsg = document.getElementById("welcome-user");
  if (welcomeMsg) {
    const user = localStorage.getItem("username");
    welcomeMsg.textContent = `Selamat datang di Nida Jewelry! Tentukan pilihanmu`;
  }
}

// 3. Function Tampilkan Produk
function tampilkanProduk() {
  const urlParams = new URLSearchParams(window.location.search);
  const kategori = urlParams.get("kategori");
  const judulKategori = document.getElementById("judul-kategori");
  const containerProduk = document.getElementById("container-produk");

  if (!kategori || !DATA_PRODUK[kategori]) {
    judulKategori.textContent = "Kategori Tidak Ditemukan";
    return;
  }

  // Set Judul (Huruf pertama kapital)
  judulKategori.textContent =
    "Koleksi " + kategori.charAt(0).toUpperCase() + kategori.slice(1);

  // Perulangan (Map) untuk menampilkan list produk
  const listProduk = DATA_PRODUK[kategori];

  containerProduk.innerHTML = listProduk
    .map(
      (produk) => `
        <div class="product-card">
         <img src="${produk.image}" alt="${produk.nama}" class="product-image">

            <div class="product-name">${produk.nama}</div>
            <div class="product-price">Rp ${produk.harga.toLocaleString(
              "id-ID"
            )}</div>
            <button onclick="tambahKeranjang(${produk.id}, '${produk.nama}', ${
        produk.harga
      })">
                + Tambah ke Keranjang
            </button>
        </div>
    `
    )
    .join("");
}

// 4. Function Tambah Keranjang
function tambahKeranjang(id, nama, harga) {
  // Tambah data ke array variable
  dataKeranjang.push({ id, nama, harga });

  // Simpan ke localStorage
  localStorage.setItem("keranjang_nida", JSON.stringify(dataKeranjang));

  // Tampilkan Notifikasi
  showNotification(`"${nama}" berhasil ditambahkan ke keranjang!`);
}

// Helper: Show Notification
function showNotification(pesan) {
  const notif = document.getElementById("notification");
  if (notif) {
    notif.textContent = pesan;
    notif.classList.add("show");
    setTimeout(() => {
      notif.classList.remove("show");
    }, 3000);
  }
}

// 5. Function Tampilkan Keranjang
function renderKeranjang() {
  const container = document.getElementById("list-keranjang");
  const totalEl = document.getElementById("total-harga");
  const btnCheckout = document.getElementById("btn-checkout");

  // Kondisi jika keranjang kosong
  if (dataKeranjang.length === 0) {
    container.innerHTML =
      '<tr><td colspan="3" class="empty-cart">Keranjang Anda masih kosong.</td></tr>';
    totalEl.textContent = "Rp 0";
    btnCheckout.style.display = "none"; // Sembunyikan tombol checkout
    return;
  }

  btnCheckout.style.display = "inline-block"; // Tampilkan tombol

  // Perulangan untuk menampilkan isi keranjang
  let total = 0;
  let html = "";

  // Menggunakan for loop biasa sesuai request variasi perulangan
  for (let i = 0; i < dataKeranjang.length; i++) {
    const item = dataKeranjang[i];
    total += item.harga;
    html += `
            <tr>
                <td>${item.nama}</td>
                <td>Rp ${item.harga.toLocaleString("id-ID")}</td>
                <td><button onclick="hapusItem(${i})" style="background:#ff4444; padding:5px 10px; width:auto;">Hapus</button></td>
            </tr>
        `;
  }

  container.innerHTML = html;
  totalEl.textContent = "Rp " + total.toLocaleString("id-ID");
}

// Function Hapus Item (Tambahan agar lebih usable)
function hapusItem(index) {
  dataKeranjang.splice(index, 1);
  localStorage.setItem("keranjang_nida", JSON.stringify(dataKeranjang));
  renderKeranjang();
}

// 6. Function Checkout
function checkout() {
  // Validasi keranjang kosong
  if (dataKeranjang.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  const total = dataKeranjang.reduce((sum, item) => sum + item.harga, 0);

  // Output pesan checkout
  const konfirmasi = confirm(
    `Total belanja Anda: Rp ${total.toLocaleString(
      "id-ID"
    )}\n\nLanjutkan pembayaran?`
  );

  if (konfirmasi) {
    alert("Terima kasih! Pesanan Anda sedang diproses.");
    dataKeranjang = []; // Kosongkan keranjang
    localStorage.setItem("keranjang_nida", JSON.stringify(dataKeranjang));
    renderKeranjang();
  }
}

// --- MAIN EXECUTION ---
// Cek halaman apa yang sedang aktif untuk menjalankan fungsi yang sesuai
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Notification Element Inject
  const notifDiv = document.createElement("div");
  notifDiv.id = "notification";
  notifDiv.className = "notification";
  document.body.appendChild(notifDiv);

  if (path.includes("menu.html")) {
    cekLogin();
    tampilkanMenu();
  } else if (path.includes("produk.html")) {
    cekLogin();
    tampilkanProduk();
  } else if (path.includes("keranjang.html")) {
    cekLogin();
    renderKeranjang();
  } else if (path.includes("index.html") || path === "/") {
    // Halaman login, cek jika sudah login redirect ke menu
    if (localStorage.getItem("isLoggedIn")) {
      window.location.href = "menu.html";
    }
  }
});
