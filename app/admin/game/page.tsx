import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import GameContent from './GameContent';
import { adminStyles } from '../styles';

export default async function GamePage() {
  const supabase = await createClient();

  const [
    { data: allPlayers },
    { count: winnersCount },
    { data: vouchers },
    { data: recentWinners },
    { data: gameSettings },
  ] = await Promise.all([
    supabase.from('game_players').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('game_daily_winners').select('*', { count: 'exact', head: true }),
    supabase.from('game_vouchers').select('*').order('created_at', { ascending: false }),
    supabase.from('game_daily_winners').select('*').order('waktu_menang', { ascending: false }).limit(20),
    supabase.from('game_settings').select('*'),
  ]);

  const settingsObj = gameSettings?.reduce((acc: any, s: any) => { acc[s.key] = s.value; return acc; }, {}) || {};
  const unusedVouchers = vouchers?.filter((v: any) => v.status === 'unused') || [];
  const usedVouchers = vouchers?.filter((v: any) => v.status === 'used') || [];

  async function addVoucher(formData: FormData) {
    'use server';
    const supabaseServer = await createClient();
    const codes = (formData.get('codes') as string).split('\n').map(c => c.trim()).filter(Boolean);
    const inserts = codes.map(code => ({ code, status: 'unused' }));
    if (inserts.length > 0) {
      await supabaseServer.from('game_vouchers').insert(inserts);
    }
    revalidatePath('/admin/game');
  }

  async function deleteVoucher(id: string) {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('game_vouchers').delete().eq('id', id);
    revalidatePath('/admin/game');
  }

  async function updateGameSetting(formData: FormData) {
    'use server';
    const supabaseServer = await createClient();
    const key = formData.get('key') as string;
    const value = formData.get('value') as string;
    await supabaseServer.from('game_settings').upsert({ key, value }, { onConflict: 'key' });
    revalidatePath('/admin/game');
  }

  async function toggleGameActive(formData: FormData) {
    'use server';
    const supabaseServer = await createClient();
    const value = formData.get('value') as string;
    await supabaseServer.from('game_settings').upsert(
      { key: 'game_active', value },
      { onConflict: 'key' }
    );
    revalidatePath('/admin/game');
  }

  async function deleteWinner(id: string) {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('game_daily_winners').delete().eq('id', id);
    revalidatePath('/admin/game');
  }

  async function deletePlayer(id: string) {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('game_players').delete().eq('id', id);
    revalidatePath('/admin/game');
  }

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Memory Game</h1>
            <p className="admin-page-subtitle">Manage game settings, vouchers, players, and winners</p>
          </div>
        </div>

        <GameContent
          allPlayers={allPlayers || []}
          winnersCount={winnersCount || 0}
          unusedCount={unusedVouchers.length}
          usedCount={usedVouchers.length}
          recentWinners={recentWinners || []}
          vouchers={vouchers || []}
          settings={settingsObj}
          addVoucher={addVoucher}
          deleteVoucher={deleteVoucher}
          updateGameSetting={updateGameSetting}
          toggleGameActive={toggleGameActive}
          deleteWinner={deleteWinner}
          deletePlayer={deletePlayer}
        />
      </div>
    </>
  );
}
