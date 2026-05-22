/**
 * Svarga Dimsum - Memory Card Game Backend
 * Google Apps Script + Google Spreadsheet
 *
 * ===== CARA PAKAI =====
 * 1. Paste SEMUA kode ini ke editor Apps Script (hapus yg lama)
 * 2. Dari dropdown function, pilih "setupSpreadsheet"
 * 3. Klik Run -> Izinkan akses
 * 4. Deploy -> New deployment -> Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy URL deployment ke .env.local sebagai GAME_API_URL
 */

// ─── KONFIGURASI ─────────────────────────────────────
var SS_ID = '1NOFJ4wbpBmprAroKJcc0zjhfDBtZ3lIlyZ7jLM538kE';
var GAME_SECRET = 'svarga_secret_2026';
var TZ = 'Asia/Jakarta';

// ─── FUNGSI SETUP (jalanin 1x) ──────────────────────

function setupSpreadsheet() {
  var ss = SpreadsheetApp.openById(SS_ID);

  buatSheet(ss, 'players', ['id', 'nama', 'whatsapp', 'ip', 'status', 'play_date', 'created_at']);

  var voucherSheet = buatSheet(ss, 'vouchers', ['code', 'status', 'claimed_by', 'claimed_at', 'player_ip']);
  // Cegah duplikat: cek apakah sudah ada voucher dari setup sebelumnya
  var existingData = voucherSheet.getDataRange().getValues();
  if (existingData.length <= 1) {
    for (var i = 0; i < 50; i++) {
      var p1 = kodeAcak(4);
      var p2 = kodeAcak(4);
      voucherSheet.appendRow(['SVRGA-' + p1 + '-' + p2, 'unused', '', '', '']);
    }
  }

  buatSheet(ss, 'daily_winner', ['tanggal', 'nama', 'whatsapp', 'voucher', 'waktu_menang']);
  buatSheet(ss, 'settings', ['key', 'value']);
  buatSheet(ss, 'logs', ['type', 'message', 'ip', 'created_at']);

  // Isi default settings (hanya kalau masih kosong)
  var settingSheet = ss.getSheetByName('settings');
  if (settingSheet.getLastRow() <= 1) {
    settingSheet.appendRow(['game_open', 'true']);
    settingSheet.appendRow(['start_hour', '13']);
    settingSheet.appendRow(['end_hour', '17']);
  }

  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Setup berhasil!', 'Svarga Game', 5);
}

function buatSheet(ss, nama, headers) {
  var sheet = ss.getSheetByName(nama);
  if (!sheet) {
    sheet = ss.insertSheet(nama);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  }
  return sheet;
}

function kodeAcak(len) {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var hasil = '';
  for (var i = 0; i < len; i++) {
    hasil += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hasil;
}

// ─── HELPERS ─────────────────────────────────────────

function getSheet(name) {
  if (!name) throw new Error('Nama sheet tidak boleh kosong');
  var ss = SpreadsheetApp.openById(SS_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Sheet "' + name + '" belum ada. Jalankan setupSpreadsheet() dulu.');
  return sheet;
}

function hariIni() {
  return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
}

function sekarang() {
  return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
}

function jamSekarang() {
  return parseInt(Utilities.formatDate(new Date(), TZ, 'HH'));
}

function bersihkan(str) {
  if (!str) return '';
  return str.toString().trim().replace(/<[^>]*>/g, '').substring(0, 100);
}

function balikin(data, status) {
  var out = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  if (status) out.setStatusCode(status);
  return out;
}

// ─── DATA ────────────────────────────────────────────

function getSetting(key) {
  var sheet = getSheet('settings');
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) return data[i][1];
  }
  return null;
}

function gameBuka() {
  if (getSetting('game_open') === 'false') return false;
  var jam = jamSekarang();
  var buka = parseInt(getSetting('start_hour') || '13');
  var tutup = parseInt(getSetting('end_hour') || '17');
  return jam >= buka && jam < tutup;
}

function sudahAdaPemenang() {
  var sheet = getSheet('daily_winner');
  var data = sheet.getDataRange().getValues();
  var today = hariIni();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === today) return true;
  }
  return false;
}

function ambilPemenang() {
  var sheet = getSheet('daily_winner');
  var data = sheet.getDataRange().getValues();
  var today = hariIni();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === today) {
      return { nama: data[i][1], waktu: data[i][4] };
    }
  }
  return null;
}

function sudahMain(wa) {
  var sheet = getSheet('players');
  var data = sheet.getDataRange().getValues();
  var today = hariIni();
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === wa && data[i][5] === today) return true;
  }
  return false;
}

function sudahMenang(wa) {
  var sheet = getSheet('daily_winner');
  var data = sheet.getDataRange().getValues();
  var today = hariIni();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === today && data[i][2] === wa) return true;
  }
  return false;
}

function ambilVoucher() {
  var sheet = getSheet('vouchers');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === 'unused') {
      return { baris: i + 1, code: data[i][0] };
    }
  }
  return null;
}

function catatLog(type, msg, ip) {
  try {
    var sheet = getSheet('logs');
    sheet.appendRow([type, msg, ip || '', sekarang()]);
  } catch (e) {}
}

// ─── HANDLER ─────────────────────────────────────────

function handleStatus(wa) {
  if (sudahAdaPemenang()) {
    var w = ambilPemenang();
    return balikin({ status: 'winner_exists', winner: w.nama, waktu: w.waktu });
  }
  if (!gameBuka()) {
    return balikin({ status: 'closed' });
  }
  if (wa && sudahMain(wa)) {
    return balikin({ status: 'already_played' });
  }
  return balikin({ status: 'open' });
}

function handleWinner() {
  var w = ambilPemenang();
  return balikin({ success: true, winner: w });
}

function handleStart(params) {
  var nama = bersihkan(params.nama);
  var wa = bersihkan(params.whatsapp);
  var kota = bersihkan(params.kota || '');
  var ig = bersihkan(params.instagram || '');
  var ip = params.ip || '';

  if (!nama || !wa) {
    return balikin({ success: false, message: 'Nama dan WhatsApp harus diisi' });
  }

  if (!gameBuka()) {
    catatLog('spam', 'Start: game tutup (' + wa + ')', ip);
    return balikin({ success: false, message: 'Game tutup. Buka 13:00-17:00 WIB.' });
  }

  if (sudahAdaPemenang()) {
    catatLog('spam', 'Start: sudah ada pemenang (' + wa + ')', ip);
    return balikin({ success: false, message: 'Pemenang hari ini sudah ada. Coba besok.' });
  }

  if (sudahMain(wa)) {
    catatLog('duplicate', 'Start: wa duplikat (' + wa + ')', ip);
    return balikin({ success: false, message: 'Nomor WA sudah dipakai hari ini.' });
  }

  var sheet = getSheet('players');
  sheet.appendRow([sheet.getLastRow(), nama, wa, ip, 'playing', hariIni(), sekarang()]);
  catatLog('info', 'Start: ' + nama + ' (' + wa + ')', ip);
  return balikin({ success: true, message: 'Selamat bermain!' });
}

function handleFinish(params) {
  var nama = bersihkan(params.nama);
  var wa = bersihkan(params.whatsapp);
  var ip = params.ip || '';
  var durasi = parseFloat(params.duration);

  if (!nama || !wa) {
    return balikin({ success: false, message: 'Data tidak valid' });
  }

  if (sudahAdaPemenang()) {
    catatLog('fake', 'Finish: sudah ada pemenang (' + wa + ')', ip);
    return balikin({ success: false, message: 'Pemenang sudah ada.' });
  }

  if (!sudahMain(wa)) {
    catatLog('fake', 'Finish: belum daftar (' + wa + ')', ip);
    return balikin({ success: false, message: 'Kamu belum daftar.' });
  }

  if (sudahMenang(wa)) {
    catatLog('fake', 'Finish: menang 2x (' + wa + ')', ip);
    return balikin({ success: false, message: 'Kamu sudah menang hari ini.' });
  }

  if (!isNaN(durasi) && durasi < 5) {
    catatLog('fake', 'Finish: durasi mustahil ' + durasi + 's (' + wa + ')', ip);
    return balikin({ success: false, message: 'Waktu tidak valid.' });
  }

  var voucher = ambilVoucher();
  if (!voucher) {
    catatLog('invalid', 'Finish: voucher habis', ip);
    return balikin({ success: false, message: 'Maaf, voucher habis.' });
  }

  var now = sekarang();
  var today = hariIni();

  // Mark voucher used
  getSheet('vouchers').getRange(voucher.baris, 2, 1, 4).setValues([['used', wa, now, ip]]);

  // Save daily winner
  getSheet('daily_winner').appendRow([today, nama, wa, voucher.code, now]);

  // Update player status ke "win"
  var ps = getSheet('players');
  var semua = ps.getDataRange().getValues();
  for (var i = 1; i < semua.length; i++) {
    if (semua[i][2] === wa && semua[i][5] === today) {
      ps.getRange(i + 1, 5).setValue('win');
      break;
    }
  }

  catatLog('info', 'Finish: ' + nama + ' -> ' + voucher.code, ip);
  return balikin({ success: true, message: 'Selamat! Kamu menang!', voucher: voucher.code });
}

// ─── WEB APP ─────────────────────────────────────────

function doGet(e) {
  try {
    if (!e || !e.parameter || e.parameter.secret !== GAME_SECRET) {
      return balikin({ success: false, message: 'Unauthorized' }, 403);
    }
    var action = e.parameter.action || '';
    switch (action) {
      case 'status': return handleStatus(e.parameter.wa || '');
      case 'winner': return handleWinner();
      default: return balikin({ success: false, message: 'Unknown action' }, 400);
    }
  } catch (err) {
    catatLog('error', 'doGet: ' + err.message, '');
    return balikin({ success: false, message: err.message }, 500);
  }
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    if (!params || params.secret !== GAME_SECRET) {
      return balikin({ success: false, message: 'Unauthorized' }, 403);
    }
    switch (params.action) {
      case 'start': return handleStart(params);
      case 'finish': return handleFinish(params);
      default: return balikin({ success: false, message: 'Unknown action' }, 400);
    }
  } catch (err) {
    catatLog('error', 'doPost: ' + err.message, '');
    return balikin({ success: false, message: err.message }, 500);
  }
}
