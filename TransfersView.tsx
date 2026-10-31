import React, { useState } from 'react';
import { Club, Player, TransferDeal } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArrowLeft, Shuffle, DollarSign, Search, Check, Shield, AlertCircle, TrendingUp } from 'lucide-react';

interface TransfersViewProps {
  isArabic: boolean;
  myClub: Club;
  transferMarket: Player[];
  mySquad: Player[];
  onBuyPlayer: (player: Player, fee: number, wage: number, years: number) => void;
  onSellPlayer: (player: Player, offerPrice: number) => void;
  onBack: () => void;
}

export const TransfersView: React.FC<TransfersViewProps> = ({
  isArabic,
  myClub,
  transferMarket,
  mySquad,
  onBuyPlayer,
  onSellPlayer,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'mySquad'>('market');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('ALL');
  const [negotiatingPlayer, setNegotiatingPlayer] = useState<Player | null>(null);
  
  // Negotiation form state
  const [offeredFee, setOfferedFee] = useState(0);
  const [offeredWage, setOfferedWage] = useState(0);
  const [contractYears, setContractYears] = useState(3);
  const [negotiationStatus, setNegotiationStatus] = useState<string | null>(null);

  const startNegotiation = (player: Player) => {
    sound.playClick();
    setNegotiatingPlayer(player);
    setOfferedFee(player.marketValue);
    setOfferedWage(player.wage);
    setContractYears(player.contractYears || 3);
    setNegotiationStatus(null);
  };

  const handleConfirmBid = () => {
    if (!negotiatingPlayer) return;
    if (offeredFee > myClub.budgetDollars) {
      setNegotiationStatus(isArabic ? 'ميزانية النادي لا تكفي لدفع قيمة الصفقة!' : 'Insufficient club budget for this fee!');
      return;
    }

    // Realistic acceptance threshold: must be within 85% of market value
    const minAcceptableFee = negotiatingPlayer.marketValue * 0.88;
    if (offeredFee < minAcceptableFee) {
      setNegotiationStatus(isArabic ? 'النادي رفض العرض! القيمة المعروضة منخفضة جداً.' : 'Club rejected! Offer is too low.');
      return;
    }

    onBuyPlayer(negotiatingPlayer, offeredFee, offeredWage, contractYears);
    setNegotiatingPlayer(null);
  };

  const filteredMarket = transferMarket.filter(p => {
    const matchesName = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.arName.includes(searchQuery);
    const matchesPos = selectedPosition === 'ALL' || p.position === selectedPosition;
    return matchesName && matchesPos;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isArabic ? 'العودة للمقر' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/30">
            <Shuffle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {isArabic ? 'سوق الانتقالات والميركاتو' : 'Transfer Market & Negotiations'}
            </h2>
            <span className="text-xs text-slate-400">
              {isArabic ? `الميزانية المتاحة: $${myClub.budgetDollars.toLocaleString()}` : `Budget Available: $${myClub.budgetDollars.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Buy Market vs My Squad Offers */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-slate-900/80 rounded-2xl border border-slate-800">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('market');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer min-h-[44px] ${
            activeTab === 'market'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isArabic ? 'سوق الشراء واستقطاب اللاعبين' : 'Buy Players (Transfer List)'}
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('mySquad');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer min-h-[44px] ${
            activeTab === 'mySquad'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isArabic ? 'بيع لاعبي الفريق وتلقي العروض' : 'Sell Players & Outgoing Bids'}
        </button>
      </div>

      {activeTab === 'market' ? (
        <>
          {/* Search & Position Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث عن لاعب بالاسم...' : 'Search player by name...'}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {['ALL', 'ST', 'LW', 'RW', 'CAM', 'CM', 'CDM', 'CB', 'LB', 'RB', 'GK'].map(pos => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedPosition === pos
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Market Target Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredMarket.map(player => (
              <div
                key={player.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-amber-400">
                        {player.position}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {isArabic ? player.arName : player.name}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {player.age} {isArabic ? 'سنة' : 'yrs'} · {player.nationality}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end font-mono">
                      <span className="text-lg font-black text-amber-400">{player.ovr}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">POT {player.potential}</span>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="grid grid-cols-6 gap-1 text-center font-mono text-[10px] py-2 border-t border-b border-white/5 mb-3">
                    <div><span className="text-slate-400 block">PAC</span><span className="font-bold text-slate-200">{player.pace}</span></div>
                    <div><span className="text-slate-400 block">SHO</span><span className="font-bold text-slate-200">{player.shooting}</span></div>
                    <div><span className="text-slate-400 block">PAS</span><span className="font-bold text-slate-200">{player.passing}</span></div>
                    <div><span className="text-slate-400 block">DRI</span><span className="font-bold text-slate-200">{player.dribbling}</span></div>
                    <div><span className="text-slate-400 block">DEF</span><span className="font-bold text-slate-200">{player.defending}</span></div>
                    <div><span className="text-slate-400 block">PHY</span><span className="font-bold text-slate-200">{player.physical}</span></div>
                  </div>
                </div>

                {/* Pricing & Bid Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold block">${player.marketValue.toLocaleString()}</span>
                    <span className="text-slate-400 text-[10px]">${player.wage}/wk</span>
                  </div>

                  <button
                    onClick={() => startNegotiation(player)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black transition cursor-pointer min-h-[44px]"
                  >
                    {isArabic ? 'تقديم عرض وتفاوض' : 'Make Offer & Negotiate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Outgoing Offers & Selling Squad Players */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {mySquad.map(player => {
            const offer = Math.round(player.marketValue * (0.95 + (Math.sin(player.ovr) * 0.15)));
            return (
              <div
                key={player.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    {player.position}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isArabic ? player.arName : player.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {player.age} {isArabic ? 'سنة' : 'yrs'} · {player.ovr} OVR · ${player.marketValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playRewardChime();
                      onSellPlayer(player, offer);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer min-h-[44px]"
                  >
                    {isArabic ? `بيع مقابل $${offer.toLocaleString()}` : `Sell for $${offer.toLocaleString()}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Negotiation Dialog Modal */}
      {negotiatingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-amber-500/40 p-6 text-white shadow-2xl">
            <h3 className="text-lg font-black mb-1">
              {isArabic ? 'التفاوض على صفقة الانتقال' : 'Negotiate Transfer Terms'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isArabic ? `اللاعب: ${negotiatingPlayer.arName}` : `Player: ${negotiatingPlayer.name}`} ({negotiatingPlayer.position} · {negotiatingPlayer.ovr} OVR)
            </p>

            <div className="space-y-4 mb-5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isArabic ? 'قيمة الصفقة للنادي ($)' : 'Transfer Fee ($)'}
                </label>
                <input
                  type="number"
                  step="5000"
                  value={offeredFee}
                  onChange={e => setOfferedFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isArabic ? 'الراتب الأسبوعي للاعب ($)' : 'Weekly Wage ($)'}
                </label>
                <input
                  type="number"
                  step="100"
                  value={offeredWage}
                  onChange={e => setOfferedWage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isArabic ? 'مدة العقد (سنوات)' : 'Contract Duration (Years)'}
                </label>
                <select
                  value={contractYears}
                  onChange={e => setContractYears(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold cursor-pointer"
                >
                  <option value={1}>1 {isArabic ? 'سنة' : 'Year'}</option>
                  <option value={2}>2 {isArabic ? 'سنتان' : 'Years'}</option>
                  <option value={3}>3 {isArabic ? 'سنوات' : 'Years'}</option>
                  <option value={4}>4 {isArabic ? 'سنوات' : 'Years'}</option>
                  <option value={5}>5 {isArabic ? 'سنوات' : 'Years'}</option>
                </select>
              </div>

              {negotiationStatus && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px] font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{negotiationStatus}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setNegotiatingPlayer(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold transition cursor-pointer min-h-[44px]"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmBid}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-md transition cursor-pointer min-h-[44px]"
              >
                {isArabic ? 'إرسال العرض وحسم الصفقة' : 'Submit & Seal Deal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
