# Voltora - Website Katalog Produk

Voltora adalah aplikasi web katalog produk modern yang dirancang untuk mengelola dan menampilkan daftar produk berdasarkan kategori. Aplikasi ini dilengkapi dengan panel administrasi untuk mengelola produk, kategori, dan pengguna (User Management).

Aplikasi ini dibangun menggunakan arsitektur **Express.js (Backend)** dan **Vanilla HTML/CSS/JS (Frontend)** dengan integrasi **Tailwind CSS v4** dan **Flowbite** untuk tampilan antarmuka yang premium dan responsif.

---

## 🚀 Fitur Utama

### 1. **Katalog Publik (Landing Page)**

- Menampilkan daftar produk dengan tampilan grid kartu produk (_product cards_) yang premium.
- Filter produk berdasarkan kategori secara dinamis.
- Pencarian dan detail produk.

### 2. **Manajemen Produk (CRUD)**

- Menambah produk baru beserta pengunggahan gambar (_image upload_) produk.
- Mengubah data produk (Nama, Kategori, Harga, Deskripsi, dan Gambar).
- Menghapus produk.

### 3. **Manajemen Kategori (CRUD)**

- Mengelola daftar kategori produk untuk pengelompokan produk yang dinamis.

### 4. **Manajemen Pengguna (User Management - CRUD)**

- Khusus untuk peran _Owner_ untuk mengelola data akun pengguna, peran (_role_), dan status keaktifan akun (_active/inactive_).

### 5. **Autentikasi Aman**

- Sistem Login & Logout berbasis peran (_role-based authorization_).
- Hashing password menggunakan **bcrypt** untuk keamanan data pengguna.

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js & Express.js
- **Database**: MySQL
- **Frontend**: HTML5, Vanilla JavaScript (ES6 Modules)
- **Styling**: Tailwind CSS v4 & Flowbite components
- **Middleware**: Multer (untuk upload gambar), BCrypt (untuk enkripsi password)

---

## 📂 Struktur Folder Proyek

```text
web-voltora/
├── config/              # Konfigurasi koneksi database MySQL
├── controllers/         # Logika pengontrol API (Auth, Category, Product, User)
├── database/            # Skema SQL database dan seeder data awal
├── middleware/          # Autentikasi, otorisasi peran, dan multer upload
├── models/              # Kelas model database untuk operasi MySQL
├── public/              # Berkas statis frontend (HTML, CSS, JS, Gambar)
│   ├── admin/           # Halaman dasbor manajemen (products, categories, users)
│   ├── auth/            # Halaman login
│   ├── css/             # File input & output Tailwind CSS
│   ├── js/              # File logika JavaScript frontend
│   └── uploads/         # Folder penyimpanan gambar produk hasil upload
├── routes/              # Routing endpoint API dan halaman web
├── server.js            # Entry point utama aplikasi Express.js
├── .gitignore           # File konfigurasi file yang diabaikan oleh Git
└── package.json         # Konfigurasi dependensi npm & script run
```
