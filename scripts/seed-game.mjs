import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [key, ...valueParts] = trimmed.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY']);

async function seed() {
  console.log('1. Seeding game settings...');
  const settings = [
    { key: 'game_active', value: 'true' },
    { key: 'game_start_hour', value: '01:00' },
    { key: 'game_end_hour', value: '23:59' },
    { key: 'game_max_winners', value: '5' },
    { key: 'game_difficulty', value: 'medium' },
    { key: 'game_timer', value: '45' },
    { key: 'game_lives', value: '3' },
    { key: 'game_pairs', value: '6' },
  ];
  let { error } = await supabase.from('game_settings').upsert(settings, { onConflict: 'key' });
  console.log(error ? `  Error: ${error.message}` : '  OK');

  console.log('2. Seeding vouchers...');
  const vouchers = [];
  for (let i = 1; i <= 20; i++) vouchers.push({ code: `DIMSUM${String(i).padStart(3, '0')}`, status: 'unused' });
  ({ error } = await supabase.from('game_vouchers').insert(vouchers));
  console.log(error ? `  Error: ${error.message}` : '  OK');

  console.log('3. Seeding winners (basic columns only)...');
  const winners = [
    { tanggal: '2026-07-15', nama: 'Budi Santoso', whatsapp: '081234567890', voucher_code: 'DIMSUM001' },
    { tanggal: '2026-07-15', nama: 'Siti Rahayu', whatsapp: '085678901234', voucher_code: 'DIMSUM002' },
    { tanggal: '2026-07-16', nama: 'Andi Pratama', whatsapp: '087812345678', voucher_code: 'DIMSUM003' },
    { tanggal: '2026-07-16', nama: 'Dewi Lestari', whatsapp: '089912345678', voucher_code: 'DIMSUM004' },
    { tanggal: '2026-07-16', nama: 'Rizki Ramadhan', whatsapp: '081123456789', voucher_code: 'DIMSUM005' },
    { tanggal: '2026-07-17', nama: 'Putri Wulandari', whatsapp: '082234567890', voucher_code: 'DIMSUM006' },
    { tanggal: '2026-07-17', nama: 'Ahmad Fauzi', whatsapp: '083345678901', voucher_code: 'DIMSUM007' },
    { tanggal: '2026-07-17', nama: 'Rina Marlina', whatsapp: '084456789012', voucher_code: 'DIMSUM008' },
    { tanggal: '2026-07-17', nama: 'Fajar Nugroho', whatsapp: '085567890123', voucher_code: 'DIMSUM009' },
    { tanggal: '2026-07-17', nama: 'Maya Sari', whatsapp: '086678901234', voucher_code: 'DIMSUM010' },
  ];
  ({ error } = await supabase.from('game_daily_winners').insert(winners));
  console.log(error ? `  Error: ${error.message}` : '  OK');

  console.log('4. Seeding players (basic columns only)...');
  const players = [
    { nama: 'Budi Santoso', whatsapp: '081234567890', ip: '103.28.12.45', status: 'won', play_date: '2026-07-15' },
    { nama: 'Siti Rahayu', whatsapp: '085678901234', ip: '114.124.36.78', status: 'won', play_date: '2026-07-15' },
    { nama: 'Andi Pratama', whatsapp: '087812345678', ip: '182.23.45.67', status: 'won', play_date: '2026-07-16' },
    { nama: 'Dewi Lestari', whatsapp: '089912345678', ip: '36.95.12.34', status: 'won', play_date: '2026-07-16' },
    { nama: 'Rizki Ramadhan', whatsapp: '081123456789', ip: '114.79.56.78', status: 'won', play_date: '2026-07-16' },
    { nama: 'Putri Wulandari', whatsapp: '082234567890', ip: '103.47.23.45', status: 'won', play_date: '2026-07-17' },
    { nama: 'Ahmad Fauzi', whatsapp: '083345678901', ip: '36.78.90.12', status: 'won', play_date: '2026-07-17' },
    { nama: 'Rina Marlina', whatsapp: '084456789012', ip: '182.45.67.89', status: 'won', play_date: '2026-07-17' },
    { nama: 'Fajar Nugroho', whatsapp: '085567890123', ip: '114.124.78.90', status: 'won', play_date: '2026-07-17' },
    { nama: 'Maya Sari', whatsapp: '086678901234', ip: '103.28.56.78', status: 'won', play_date: '2026-07-17' },
    { nama: 'Eko Prasetyo', whatsapp: '087789012345', ip: '36.95.34.56', status: 'failed_no_voucher', play_date: '2026-07-17' },
    { nama: 'Lestari Putri', whatsapp: '088890123456', ip: '182.23.78.90', status: 'lost', play_date: '2026-07-17' },
    { nama: 'Hendra Wijaya', whatsapp: '089901234567', ip: '114.79.12.34', status: 'playing', play_date: '2026-07-17' },
  ];
  ({ error } = await supabase.from('game_players').insert(players));
  console.log(error ? `  Error: ${error.message}` : '  OK');

  console.log('\nDone! Now run migration_game_enhance.sql in Supabase SQL Editor for full features.');
}

seed().catch(console.error);
