# Himiko Base V1

Bot Telegram template yang siap digunakan untuk pengembangan lebih lanjut.

## Fitur
- ✅ Template bot Telegram dasar
- ✅ Sistem owner (multi-owner support)
- ✅ Thumbnail pada setiap pesan bot
- ✅ Contoh penggunaan button (inline & reply)
- ✅ Siap digunakan di Termux dan Pterodactyl Panel
- ✅ Environment variables configuration

## Instalasi

### 1. Clone repository
```bash
git clone https://github.com/AzorCeHa/himiko-base-v1
cd himiko-base-v1
```

2. Install dependencies

```bash
npm install
```

3. Konfigurasi

Salin file .env.example ke .env. Edit file .env dengan konfigurasi bot Anda:
 - BOT_TOKEN: Dapatkan dari @BotFather
 - OWNER_IDS: ID Telegram owner (dapat dipisahkan koma)

4. Jalankan bot

```bash
npm start
```

Penggunaan di Termux

```bash
# Berikan permission eksekusi
chmod +x start.sh

# Jalankan script
./start.sh
```

Penggunaan di Pterodactyl

1. Buat new application
2. Set startup command: npm start
3. Set working directory ke folder bot
4. Tambahkan environment variables di panel

Struktur Proyek

· bot.js - File utama bot
· .env - Konfigurasi environment
· package.json - Dependencies dan info proyek
· start.sh - Script untuk Termux

Perintah yang Tersedia

· /start - Memulai bot
· /help - Menampilkan bantuan
· /owner - Menampilkan info owner
· /buttons - Contoh penggunaan button
· /ping - Cek status bot

Kontribusi

Dipersilahkan untuk fork dan mengembangkan bot ini sesuai kebutuhan.

Lisensi

MIT License

Author

AzorCeha (github: AzorCeHa)
