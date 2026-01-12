/**
 * Himiko Base V1 - Bot Telegram Template
 * Author: AzorCeha (github: AzorCeHa)
 * Repository: https://github.com/AzorCeHa/himiko-base-v1
 * 
 * Bot template dengan sistem owner dan thumbnail pesan.
 * Siap digunakan di Termux dan Pterodactyl Panel.
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Konfigurasi dari environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_IDS = process.env.OWNER_IDS ? process.env.OWNER_IDS.split(',').map(id => parseInt(id.trim())) : [];
const BOT_NAME = process.env.BOT_NAME || 'Himiko Base Bot';
const BOT_USERNAME = process.env.BOT_USERNAME || '';
const THUMBNAIL_URL = process.env.THUMBNAIL_URL || 'https://i.ibb.co.com/fd3LN9cQ/f7c3492bba2f6c3ae4b5d32c249c0d4f.jpg';
const DEBUG = process.env.DEBUG === 'true';

// Validasi token
if (!BOT_TOKEN) {
    console.error('❌ ERROR: BOT_TOKEN tidak ditemukan di .env!');
    console.error('Silakan tambahkan BOT_TOKEN di file .env');
    process.exit(1);
}

// Inisialisasi bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Informasi bot
const botInfo = {
    name: BOT_NAME,
    version: '1.0.0',
    author: 'AzorCeha',
    github: 'https://github.com/AzorCeHa',
    thumbnail: THUMBNAIL_URL
};

console.log(`🤖 ${botInfo.name} v${botInfo.version}`);
console.log(`👨‍💻 Author: ${botInfo.author}`);
console.log(`🌐 GitHub: ${botInfo.github}`);
console.log(`👑 Owners: ${OWNER_IDS.join(', ') || 'Belum diatur'}`);
console.log(`🔍 Debug Mode: ${DEBUG ? 'AKTIF' : 'NON-AKTIF'}`);
console.log('🚀 Bot sedang dimulai...\n');

// Fungsi helper untuk mengirim pesan dengan thumbnail
async function sendMessageWithThumbnail(chatId, text, options = {}) {
    const defaultOptions = {
        parse_mode: 'HTML',
        ...options
    };

    // Jika ada thumbnail URL, tambahkan di awal pesan
    let formattedText = text;
    if (botInfo.thumbnail) {
        formattedText = `<a href="${botInfo.thumbnail}">‍</a>${text}`;
    }

    try {
        return await bot.sendMessage(chatId, formattedText, defaultOptions);
    } catch (error) {
        console.error('❌ Gagal mengirim pesan:', error.message);
        
        // Fallback tanpa thumbnail jika gagal
        if (error.message.includes('parse')) {
            return await bot.sendMessage(chatId, text, {
                ...defaultOptions,
                parse_mode: undefined
            });
        }
        throw error;
    }
}

// Fungsi untuk memeriksa apakah user adalah owner
function isOwner(userId) {
    return OWNER_IDS.includes(parseInt(userId));
}

// Handler untuk pesan /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'Pengguna';
    
    const welcomeText = `
👋 <b>Halo, ${userName}!</b>

Selamat datang di <b>${botInfo.name}</b> v${botInfo.version}

Ini adalah template bot Telegram yang dapat dikembangkan sesuai kebutuhan Anda.

<b>📁 Repository:</b> <code>${botInfo.github}</code>
<b>👨‍💻 Author:</b> <code>${botInfo.author}</code>

Gunakan /help untuk melihat perintah yang tersedia.
    `;

    await sendMessageWithThumbnail(chatId, welcomeText);
});

// Handler untuk pesan /help
bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    
    const helpText = `
🆘 <b>Bantuan & Perintah</b>

<b>Perintah Umum:</b>
/start - Memulai bot
/help - Menampilkan pesan bantuan ini
/ping - Mengecek status bot
/buttons - Contoh penggunaan button

<b>Perintah Owner:</b>
/owner - Menampilkan informasi owner
/settings - Pengaturan bot (hanya owner)

<b>📚 Dokumentasi:</b>
Template ini dibuat untuk memudahkan pengembangan bot Telegram. Anda dapat mengembangkan bot ini sesuai kebutuhan.

<b>⚠️ Catatan:</b>
Pastikan Anda telah mengatur OWNER_IDS di file .env untuk menggunakan fitur owner.
    `;

    await sendMessageWithThumbnail(chatId, helpText);
});

// Handler untuk pesan /ping
bot.onText(/\/ping/, async (msg) => {
    const chatId = msg.chat.id;
    const startTime = Date.now();
    
    const pingMsg = await sendMessageWithThumbnail(chatId, '🏓 <b>Pong!</b> Memeriksa ping...');
    const endTime = Date.now();
    const pingTime = endTime - startTime;
    
    await bot.editMessageText(`🏓 <b>Pong!</b>\n⏱️ <code>${pingTime}ms</code>\n✅ Bot aktif dan berjalan dengan baik!`, {
        chat_id: chatId,
        message_id: pingMsg.message_id,
        parse_mode: 'HTML'
    });
});

// Handler untuk pesan /buttons (contoh penggunaan button)
bot.onText(/\/buttons/, async (msg) => {
    const chatId = msg.chat.id;
    
    const inlineKeyboard = {
        inline_keyboard: [
            [
                { text: '🔗 GitHub', url: botInfo.github },
                { text: '📖 Dokumentasi', callback_data: 'docs' }
            ],
            [
                { text: '👑 Owner Info', callback_data: 'owner_info' },
                { text: '🔄 Refresh', callback_data: 'refresh' }
            ],
            [
                { text: '❌ Tutup', callback_data: 'close' }
            ]
        ]
    };
    
    const replyKeyboard = {
        keyboard: [
            ['📊 Status', 'ℹ️ Info'],
            ['⚙️ Settings', '🛠️ Tools'],
            ['/help', '/ping']
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    };
    
    const buttonsText = `
🎛️ <b>Contoh Penggunaan Button</b>

<b>Inline Keyboard:</b>
Button yang muncul di dalam pesan.

<b>Reply Keyboard:</b>
Button yang muncul di keyboard khusus.

Pilih salah satu button di bawah untuk mencoba:
    `;
    
    await sendMessageWithThumbnail(chatId, buttonsText, {
        reply_markup: inlineKeyboard
    });
    
    // Juga kirim reply keyboard
    await bot.sendMessage(chatId, '⌨️ <b>Reply Keyboard</b>\n\nKeyboard khusus akan muncul di bawah:', {
        parse_mode: 'HTML',
        reply_markup: replyKeyboard
    });
});

// Handler untuk pesan /owner
bot.onText(/\/owner/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (isOwner(userId)) {
        const ownerText = `
👑 <b>Informasi Owner</b>

✅ <b>Status:</b> Anda adalah owner bot ini!

<b>ID Anda:</b> <code>${userId}</code>
<b>Total Owners:</b> ${OWNER_IDS.length}
<b>List Owners:</b>
${OWNER_IDS.map((id, index) => `${index + 1}. <code>${id}</code>`).join('\n')}

<b>Fitur Owner:</b>
• Akses penuh ke semua perintah
• Dapat mengatur pengaturan bot
• Hak akses administratif
        `;
        
        await sendMessageWithThumbnail(chatId, ownerText);
    } else {
        const notOwnerText = `
👑 <b>Informasi Owner</b>

❌ <b>Status:</b> Anda bukan owner bot ini.

<b>ID Anda:</b> <code>${userId}</code>
<b>Pemilik Bot:</b> ${botInfo.author}

Hubungi owner untuk informasi lebih lanjut.
        `;
        
        await sendMessageWithThumbnail(chatId, notOwnerText);
    }
});

// Handler untuk callback queries (inline button)
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;
    const userId = callbackQuery.from.id;
    
    try {
        switch (data) {
            case 'docs':
                await bot.answerCallbackQuery(callbackQuery.id, {
                    text: 'Membuka dokumentasi...',
                    show_alert: false
                });
                
                await bot.editMessageText(`📖 <b>Dokumentasi</b>\n\nKunjungi GitHub repository untuk dokumentasi lengkap:\n${botInfo.github}`, {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'HTML'
                });
                break;
                
            case 'owner_info':
                await bot.answerCallbackQuery(callbackQuery.id);
                
                const ownerStatus = isOwner(userId) ? '✅ Anda adalah owner' : '❌ Anda bukan owner';
                await bot.editMessageText(`👑 <b>Informasi Owner</b>\n\n${ownerStatus}\n\n<b>ID Anda:</b> <code>${userId}</code>`, {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'HTML'
                });
                break;
                
            case 'refresh':
                await bot.answerCallbackQuery(callbackQuery.id, {
                    text: 'Menyegarkan...',
                    show_alert: false
                });
                
                await bot.editMessageText(`🔄 <b>Disegarkan!</b>\n\nWaktu: ${new Date().toLocaleTimeString()}`, {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'HTML'
                });
                break;
                
            case 'close':
                await bot.answerCallbackQuery(callbackQuery.id);
                await bot.deleteMessage(chatId, messageId);
                break;
                
            default:
                await bot.answerCallbackQuery(callbackQuery.id);
                break;
        }
    } catch (error) {
        console.error('Error handling callback:', error);
    }
});

// Handler untuk pesan teks biasa
bot.on('message', async (msg) => {
    // Skip jika pesan adalah command
    if (msg.text && msg.text.startsWith('/')) return;
    
    const chatId = msg.chat.id;
    const text = msg.text;
    const userId = msg.from.id;
    
    // Debug logging
    if (DEBUG) {
        console.log(`📨 Pesan dari ${msg.from.first_name} (${userId}): ${text}`);
    }
    
    // Tanggapi pesan teks dari keyboard
    if (text === '📊 Status') {
        await sendMessageWithThumbnail(chatId, `🟢 <b>Status Bot</b>\n\n✅ Bot aktif dan berjalan dengan baik!\n\n👥 Chat ID: <code>${chatId}</code>\n👤 User ID: <code>${userId}</code>`);
    } else if (text === 'ℹ️ Info') {
        await sendMessageWithThumbnail(chatId, `ℹ️ <b>Informasi Bot</b>\n\n<b>Nama:</b> ${botInfo.name}\n<b>Versi:</b> ${botInfo.version}\n<b>Author:</b> ${botInfo.author}\n<b>Owner:</b> ${isOwner(userId) ? '✅ Anda' : '❌ Bukan Anda'}`);
    } else if (text === '⚙️ Settings') {
        if (isOwner(userId)) {
            await sendMessageWithThumbnail(chatId, `⚙️ <b>Pengaturan Bot</b>\n\nHalaman pengaturan khusus owner.\n\nFitur pengaturan akan ditambahkan di sini.`);
        } else {
            await sendMessageWithThumbnail(chatId, `❌ <b>Akses Ditolak</b>\n\nHanya owner yang dapat mengakses pengaturan.`);
        }
    } else if (text === '🛠️ Tools') {
        await sendMessageWithThumbnail(chatId, `🛠️ <b>Tools</b>\n\nFitur tools akan dikembangkan sesuai kebutuhan.`);
    }
});

// Handler untuk error
bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.message);
    
    // Coba restart polling setelah 5 detik
    setTimeout(() => {
        console.log('🔄 Mencoba restart polling...');
    }, 5000);
});

// Handler untuk process exit
process.on('SIGINT', () => {
    console.log('\n👋 Menghentikan bot...');
    bot.stopPolling();
    console.log('✅ Bot berhenti dengan aman.');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Menghentikan bot (SIGTERM)...');
    bot.stopPolling();
    console.log('✅ Bot berhenti dengan aman.');
    process.exit(0);
});

console.log('✅ Bot berhasil dimulai dan siap menerima pesan!');