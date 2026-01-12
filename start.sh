#!/bin/bash
# Himiko Base V1 - Startup Script for Termux
# Author: AzorCeha (github: AzorCeHa)

echo "======================================="
echo "🤖 Himiko Base V1 - Telegram Bot"
echo "👨‍💻 Author: AzorCeha"
echo "🌐 GitHub: https://github.com/AzorCeHa"
echo "======================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan!"
    echo "📦 Menginstal Node.js..."
    pkg install nodejs -y
    echo "✅ Node.js berhasil diinstal"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm tidak ditemukan!"
    echo "📦 Menginstal npm..."
    pkg install npm -y
    echo "✅ npm berhasil diinstal"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  File .env tidak ditemukan!"
    echo "📝 Membuat file .env dari template..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ File .env berhasil dibuat"
        echo "✏️  Silakan edit file .env untuk mengatur konfigurasi bot"
        exit 1
    else
        echo "❌ File .env.example tidak ditemukan!"
        echo "📄 Membuat file .env baru..."
        
        cat > .env << EOF
# Himiko Base V1 - Configuration
# Author: AzorCeha (github: AzorCeHa)

# Token bot dari @BotFather
BOT_TOKEN=your_bot_token_here

# ID owner/pemilik bot (dapat dipisahkan dengan koma untuk multiple owners)
# Dapatkan ID dari @userinfobot
OWNER_IDS=123456789

# Nama bot
BOT_NAME=Himiko Base Bot

# Username bot (tanpa @)
BOT_USERNAME=your_bot_username

# URL thumbnail untuk pesan bot
THUMBNAIL_URL=https://i.ibb.co.com/fd3LN9cQ/f7c3492bba2f6c3ae4b5d32c249c0d4f.jpg

# Mode debug
DEBUG=false
EOF
        
        echo "✅ File .env berhasil dibuat"
        echo "✏️  Silakan edit file .env untuk mengatur konfigurasi bot"
        exit 1
    fi
fi

# Check node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  Node.js versi $NODE_VERSION ditemukan!"
    echo "📦 Memerlukan Node.js 20 atau lebih tinggi"
    echo "🔄 Mencoba mengupdate Node.js..."
    pkg upgrade nodejs -y
    echo "✅ Node.js berhasil diupdate"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Menginstal dependencies..."
    npm install
    echo "✅ Dependencies berhasil diinstal"
fi

# Start the bot
echo "🚀 Menjalankan bot..."
echo "📝 Log akan ditampilkan di bawah ini:"
echo "======================================="
echo ""

npm start