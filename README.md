# WarungCOD

WarungCOD adalah aplikasi makanan mudah alih premium berasaskan PWA yang berjalan sepenuhnya dalam satu fail `index.html`.

## Ciri Utama

- Aplikasi satu fail sahaja: `index.html`
- Tiada backend, tiada database luaran, tiada pemasangan Node/NPM
- Sokongan PWA: pemasangan, mod berdiri sendiri, offline cache
- Checkout WhatsApp untuk pesanan COD
- Mod Admin tersembunyi untuk uruskan menu, kategori, tetapan dan pesanan
- Penyimpanan tempatan menggunakan `localStorage`
- UI glassmorphism dan interaksi mudah alih

## Penggunaan Aplikasi

1. Buka `index.html` dalam pelayar moden (Chrome, Edge, Firefox mobile).
2. Skrin permulaan akan muncul sekejap sebelum membawa anda ke halaman rumah.
3. Cari menu, pilih kategori, dan tekan `Tambah` untuk melihat butiran.
4. Dalam mod produk, atur kuantiti dan nota khas kemudian `Tambah ke Troli`.
5. Tekan ikon troli untuk buka troli dan pilih `Checkout via WhatsApp`.
6. Isi nama, telefon dan alamat, kemudian `Hantar ke WhatsApp`.
7. Aplikasi akan menghasilkan pesanan dan membuka WhatsApp dengan mesej siap hantar.

## Aliran Pengguna

- `Splash Screen`: animasi logo dan pemuatan ringkas.
- `Home Screen`: hero, carian, kategori, menu disyorkan dan best seller.
- `Food Detail Modal`: maklumat produk, kuantiti, nota dan total harga.
- `Cart Drawer`: sunting kuantiti, buang item, lihat subtotal dan total.
- `Checkout`: borang pelanggan, ringkasan pembayaran dan CTA WhatsApp.
- `Success Screen`: pengesahan pesanan dan pintasan tracking.
- `Tracking Screen`: status pesanan, perjalanan dan pilihan mesej WhatsApp.

## Mod Admin

### Akses Admin

1. Dari skrin utama, tekan `Admin`.
2. Masukkan kata laluan default:
   - `warung2026`
3. Selepas login, anda boleh:
   - Urus menu: tambah, edit, delete
   - Urus kategori menu
   - Tetapkan nombor WhatsApp dan bayaran penghantaran
   - Lihat pesanan terbaru dan kemas kini status
   - Eksport data JSON
   - Reset aplikasi ke tetapan lalai

### Tetapan Admin

- `Nama kedai`: Tajuk aplikasi di skrin utama.
- `Nombor WhatsApp`: Nombor yang digunakan untuk checkout.
- `Delivery fee`: Caj penghantaran tetap.
- `Admin password`: Kata laluan untuk akses admin.

## Penyimpanan Data

Data disimpan secara tempatan dalam `localStorage` dengan kunci berikut:

- `wc_settings`
- `wc_menu`
- `wc_categories`
- `wc_cart`
- `wc_orders`
- `wc_analytics`

## PWA & Offline

- Aplikasi menyokong pemasangan ke Home Screen.
- Service Worker didaftarkan secara dalaman untuk caching fail utama.
- Aplikasi akan berfungsi dalam keadaan offline selepas muat turun.

## Sesuai Untuk

- Warung kecil, gerai makanan, food truck dan penjual rumah.
- Pengguna Android pertengahan hingga rendah.
- Aliran pesanan cepat dengan keberkesanan COD/WhatsApp.

## Cara Ubah Suai Menu

1. Tekan `Admin` dan log masuk.
2. Pergi ke tab `Menu` untuk menambah atau edit item.
3. Pilih kategori yang sesuai untuk item baru.
4. Simpan menu.

## Menyelesaikan Masalah

- Jika aplikasi tidak memuat:
  - Pastikan pelayar menyokong JavaScript.
  - Buka fail secara terus melalui pelayar terbaik.
- Jika WhatsApp tidak buka:
  - Semak nombor WhatsApp dalam tetapan admin.
  - Pastikan telefon mempunyai sambungan internet.
- Untuk reset data:
  - Log masuk ke admin dan tekan `Reset Database`.

## Nota Teknikal

- Semua kod, gaya dan logik dimuat dalam fail tunggal.
- Tiada kebergantungan luaran selain `https://cdn.tailwindcss.com` untuk utiliti CSS.
- Sesuai untuk pemasangan offline dan penggunaan cepat.

## Lain-lain

- Kunci lalai admin: `warung2026`
- Keselamatan: data admin disimpan tempatan sahaja
- URL tracking disokong melalui hash (contoh: `#track=WC-2026-00001`)

---

WarungCOD direka untuk memberi pengalaman pesanan pantas, mudah dan selamat untuk perniagaan kecil anda.
