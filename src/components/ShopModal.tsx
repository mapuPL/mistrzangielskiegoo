import React from 'react';
import { X, ShoppingBag, Check, Coins, Sparkles, Crown } from 'lucide-react';
import { ShopItem, PlayerProfile, IslandId } from '../types/game';
import { SHOP_ITEMS } from '../data/curriculum';
import { SoundFx } from '../services/audio';

interface ShopModalProps {
  profile: PlayerProfile;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (category: 'hat' | 'wings' | 'trail', id: string) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  profile,
  onBuyItem,
  onEquipItem,
  onClose
}) => {
  const handleBuy = (item: ShopItem) => {
    if (profile.coins >= item.cost) {
      SoundFx.playSuccess();
      onBuyItem(item);
    } else {
      SoundFx.playFail();
    }
  };

  const isOwned = (item: ShopItem) => {
    if (item.category === 'island' && item.islandId) {
      return profile.unlockedIslands.includes(item.islandId);
    }
    return profile.ownedItems.includes(item.id);
  };

  const isEquipped = (item: ShopItem) => {
    if (item.category === 'hat') return profile.equippedHat === item.id;
    if (item.category === 'wings') return profile.equippedWings === item.id;
    if (item.category === 'trail') return profile.equippedTrail === item.id;
    return false;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500 rounded-3xl shadow-2xl p-6 text-white space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-amber-400">Sklep Avatara & Odkryć</h2>
              <p className="text-xs text-slate-400">Kupuj czapki, skrzydła i odblokowuj nowe wyspy za monety!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-amber-400 font-black text-sm">
              <Coins className="w-4 h-4" />
              <span>{profile.coins}</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Zamknij (Esc)"
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {SHOP_ITEMS.map((item) => {
            const owned = isOwned(item);
            const equipped = isEquipped(item);
            const canAfford = profile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 ${
                  equipped
                    ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10'
                    : owned
                      ? 'bg-slate-800/60 border-slate-700'
                      : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      {item.category === 'hat' ? 'Nakrycie głowy' : item.category === 'wings' ? 'Skrzydła 3D' : item.category === 'trail' ? 'Efekt śladu' : 'Nowa Wyspa'}
                    </span>
                    {equipped && (
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ubrane
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-base text-white mt-1">{item.namePl}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.descriptionPl}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  {owned ? (
                    item.category !== 'island' ? (
                      <button
                        onClick={() => {
                          SoundFx.playClick();
                          onEquipItem(item.category as 'hat' | 'wings' | 'trail', equipped ? 'none' : item.id);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          equipped
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        {equipped ? 'Zdejmij' : 'Załóż'}
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Wyspa Odblokowana
                      </span>
                    )
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span>Kup za {item.cost}</span>
                      <Coins className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
