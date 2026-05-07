# Panduan Pengelolaan Website Svarga Dimsum

Dokumen ini menjelaskan cara mengubah data penting seperti nomor WhatsApp, menu, harga, dan gambar pada website.

## 1. Mengubah Nomor WhatsApp Transaksi (Order)
Nomor ini digunakan untuk menerima rincian pesanan dari pelanggan sesuai outlet yang mereka pilih.

*   **Lokasi File:** `data/outlets.ts`
*   **Cara Mengubah:**
    1. Cari bagian `phone: '+62 812-xxxx-xxxx'`.
    2. Ubah nomor di dalam tanda kutip. 
    3. **Penting:** Pastikan nomor diawali dengan kode negara (contoh: `+62`) untuk memastikan routing WhatsApp berjalan lancar.

## 2. Mengubah Nomor WhatsApp Admin (Tombol Floating)
Nomor ini digunakan untuk tombol bantuan/tanya jawab yang melayang di pojok kanan bawah.

*   **Lokasi File:** `components/CartSidebar.tsx`
*   **Cara Mengubah:**
    1. Cari baris yang mengandung link `https://wa.me/6285213963005`.
    2. Ganti angka `6285213963005` dengan nomor admin yang baru.
    3. Gunakan format angka saja (tanpa `+` atau spasi).

## 3. Mengelola Menu (Nama, Harga, Deskripsi, Foto)
Semua informasi produk yang muncul di website dikelola dalam satu daftar terpusat.

*   **Lokasi File:** `components/MenuSection.tsx`
*   **Cara Mengubah:**
    1. Cari variabel `const menuItems`.
    2. **Nama Menu:** Ubah nilai `name`.
    3. **Harga:** Ubah nilai `price` (contoh: `25000`). Jangan gunakan titik atau koma.
    4. **Deskripsi:** Ubah nilai `desc`.
    5. **Foto:** Ubah nilai `image`. Contoh: `image: '/img/produk-baru.jpg'`.

## 4. Mengganti Gambar & Aset Visual
*   **Folder Gambar Produk:** Letakkan semua file gambar baru di folder `public/img/`.
*   **Logo Preloader:** Ganti file `public/logo-loading.svg`.
*   **Favicon (Ikon Tab):** Ganti file `public/favicon.svg`.

## 5. Mengubah Alamat & Nama Outlet
Jika ada perubahan lokasi fisik toko, Anda harus memperbaruinya agar alamat yang terkirim ke WhatsApp pelanggan akurat.

*   **Lokasi File:** `data/outlets.ts`
*   **Cara Mengubah:** Ubah nilai pada bagian `name` (Nama Cabang) dan `address` (Alamat Lengkap).

---
*Catatan: Setelah melakukan perubahan pada kode, pastikan untuk menyimpan file (Ctrl+S) agar perubahan langsung terlihat di website.*
