'use client';
import { useState, useEffect } from 'react';
import { Shield, ShoppingBag, Users, Bell, DollarSign, Plus, CheckCircle, XCircle, FolderPlus, CreditCard } from 'lucide-react';

export default function MegaMarketplace() {
  const [currentRole, setCurrentRole] = useState<'admin' | 'seller' | 'customer'>('admin');
  const [dbData, setDbData] = useState<any>({ users: [], products: [], orders: [], payouts: [], announcements: [] });
  const [loading, setLoading] = useState(true);

  // Form states
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', role: 'customer' });
  const [prodForm, setProdForm] = useState({ title: '', category: 'Electronics', base_price: '' });
  const [orderForm, setOrderForm] = useState({ productId: '', buyerName: '', address: '' });
  const [payoutForm, setPayoutForm] = useState({ bankName: '', accountNo: '', amount: '' });
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementTarget, setAnnouncementTarget] = useState('all');
  const [rejectReason, setRejectReason] = useState<{ [key: number]: string }>({});

  // Pricing controls
  const [globalMarkup, setGlobalMarkup] = useState('10');
  const [globalSellerProfit, setGlobalSellerProfit] = useState('15');

  // Active user simulator
  const [activeUserId, setActiveUserId] = useState<number>(1);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api');
    const data = await res.json();
    if (!data.error) setDbData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (actionName: string, payload: any) => {
    await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionName, ...payload }),
    });
    fetchData();
  };

  return (
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      {/* Dynamic 3D Header */}
      <header class="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-2xl border border-white/10 overflow-hidden transform perspective-1000 hover:rotate-x-1 transition-all">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <h1 class="text-4xl font-extrabold tracking-tight text-white mb-2">NextGen Smart Multi-Vendor Panel</h1>
        <p class="text-indigo-100">නම්‍යශීලී මිල ගණන් සහ ස්වයංක්‍රීය පාලන පද්ධතිය</p>
        
        {/* Role Switcher */}
        <div class="mt-6 flex gap-2 bg-slate-900/50 p-1.5 rounded-xl w-fit backdrop-blur-md">
          {(['admin', 'seller', 'customer'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              class={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${currentRole === role ? 'bg-cyan-500 text-slate-900 shadow-lg font-bold' : 'text-slate-300 hover:bg-white/5'}`}
            >
              {role} Panel
            </button>
          ))}
        </div>
      </header>

      {/* Simulator Quick User Login */}
      <div class="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
        <span class="text-sm font-semibold text-cyan-400">වත්මන් පරිශීලකයා අනුකරණය (Simulation ID):</span>
        <select 
          class="bg-slate-900 text-white p-1.5 rounded border border-slate-600 text-sm"
          value={activeUserId} 
          onChange={(e) => setActiveUserId(Number(e.target.value))}
        >
          {dbData.users.map((u: any) => (
            <option key={u.id} value={u.id}>[{u.role.toUpperCase()}] - {u.name}</option>
          ))}
        </select>
      </div>

      {loading && <div class="text-center text-xl animate-pulse text-cyan-400">දත්ත යාවත්කාලීන වෙමින් පවතී...</div>}

      {/* ------------------ ADMIN PANEL ------------------ */}
      {currentRole === 'admin' && (
        <main class="space-y-8 animate-fadeIn">
          {/* Controls Matrix */}
          <section class="grid md:grid-cols-2 gap-6">
            <div class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400"><DollarSign /> ගෝලීය ලාභ සහ මිල පාලනය</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm mb-1 text-slate-400">සියලුම පාරිභෝගික භාණ්ඩ මත ලාභ ප්‍රතිශතය (Admin %):</label>
                  <div class="flex gap-2">
                    <input type="number" value={globalMarkup} onChange={(e) => setGlobalMarkup(e.target.value)} class="bg-slate-900 px-3 py-1.5 rounded w-24 border border-slate-700" />
                    <button onClick={() => handleAction('updateGlobalMarkup', { pct: globalMarkup })} class="bg-indigo-600 px-4 py-1.5 rounded hover:bg-indigo-500 text-sm">සියල්ල 100% වෙනස් කරන්න</button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm mb-1 text-slate-400">සියලුම විකුණුම්කරුවන්ගේ ලාභය වෙනස් කිරීම (Seller %):</label>
                  <div class="flex gap-2">
                    <input type="number" value={globalSellerProfit} onChange={(e) => setGlobalSellerProfit(e.target.value)} class="bg-slate-900 px-3 py-1.5 rounded w-24 border border-slate-700" />
                    <button onClick={() => handleAction('updateGlobalSellerProfit', { pct: globalSellerProfit })} class="bg-purple-600 px-4 py-1.5 rounded hover:bg-purple-500 text-sm">එක සැරේ වෙනස් කරන්න</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Announcements Engine */}
            <div class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-pink-400"><Bell /> නිවේදන නිකුත් කිරීම (Announcements)</h2>
              <textarea placeholder="පණිවිඩය ඇතුලත් කරන්න..." value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} class="w-full bg-slate-900 p-2.5 rounded border border-slate-700 h-20 mb-3 text-sm"></textarea>
              <div class="flex justify-between items-center">
                <select value={announcementTarget} onChange={(e) => setAnnouncementTarget(e.target.value)} class="bg-slate-900 p-2 rounded border border-slate-700 text-sm text-white">
                  <option value="all">සියලුම දෙනාටම (All)</option>
                  <option value="seller">සියලුම Sellers ලාට</option>
                  <option value="customer">සියලුම Customers ලාට</option>
                </select>
                <button onClick={() => { handleAction('addAnnouncement', { targetRole: announcementTarget, message: announcementText }); setAnnouncementText(''); }} class="bg-pink-600 px-4 py-2 rounded text-sm font-bold hover:bg-pink-500">නිකුත් කරන්න</button>
              </div>
            </div>
          </section>

          {/* User Matrix */}
          <section class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400"><Users /> ලියාපදිංචි පරිශීලකයින් කළමනාකරණය</h2>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-slate-300">
                <thead class="bg-slate-900 text-slate-400 uppercase text-xs">
                  <tr>
                    <th class="p-3">නම</th><th class="p-3">ඊමේල්</th><th class="p-3">භූමිකාව</th><th class="p-3">KYC තත්ත්වය</th><th class="p-3">ක්‍රියාමාර්ග</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700">
                  {dbData.users.map((u: any) => (
                    <tr key={u.id} class="hover:bg-slate-700/50">
                      <td class="p-3 font-semibold text-white">{u.name}</td>
                      <td class="p-3">{u.email}</td>
                      <td class="p-3"><span class={`px-2 py-0.5 rounded text-xs ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : u.role === 'seller' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>{u.role}</span></td>
                      <td class="p-3">{u.kyc_status}</td>
                      <td class="p-3">
                        <button onClick={() => handleAction('cancelRegistration', { id: u.id })} class="text-red-400 hover:text-red-300 font-medium">Cancel Reg</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Requested Payouts Grid */}
          <section class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400"><CreditCard /> මුදල් ලබාගැනීමේ ඉල්ලීම් (Payout Requests)</h2>
            <div class="grid gap-4 md:grid-cols-3">
              {dbData.payouts.map((p: any) => (
                <div key={p.id} class="bg-slate-900 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                  <div class="text-xs text-slate-400 mb-1">Request ID: #{p.id}</div>
                  <div class="text-2xl font-black text-white">${p.amount}</div>
                  <div class="text-xs text-amber-400 mt-1">තත්ත්වය: {p.status}</div>
                  {p.status === 'Requested' && (
                    <button onClick={() => handleAction('uploadReceipt', { id: p.id, receiptUrl: 'PROCESSED_BY_ADMIN' })} class="mt-3 w-full bg-emerald-600 py-1.5 rounded text-xs font-bold hover:bg-emerald-500">ගෙවීම් තහවුරු කරන්න (Done)</button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ------------------ SELLER / DROPSHIPPER PANEL ------------------ */}
      {currentRole === 'seller' && (
        <main class="space-y-8 animate-fadeIn">
          <div class="grid md:grid-cols-2 gap-6">
            {/* Direct Client Order Placement */}
            <div class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
              <h2 class="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2"><ShoppingBag /> සෘජු ඇණවුම් ඇතුලත් කිරීම (Direct Client Order)</h2>
              <div class="space-y-3">
                <select class="w-full bg-slate-900 p-2 rounded border border-slate-700" value={orderForm.productId} onChange={(e) => setOrderForm({ ...orderForm, productId: e.target.value })}>
                  <option value="">භාණ්ඩය තෝරන්න...</option>
                  {dbData.products.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.title} - ${Number(p.base_price) + (Number(p.base_price) * Number(p.admin_markup_pct)/100)}</option>
                  ))}
                </select>
                <input type="text" placeholder="මිලදී ගන්නාගේ නම" class="w-full bg-slate-900 p-2 rounded border border-slate-700" value={orderForm.buyerName} onChange={(e) => setOrderForm({ ...orderForm, buyerName: e.target.value })} />
                <textarea placeholder="ලිපිනය" class="w-full bg-slate-900 p-2 rounded border border-slate-700 h-16" value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}></textarea>
                <button onClick={() => { handleAction('createOrder', { ...orderForm, sellerId: activeUserId }); setOrderForm({ productId: '', buyerName: '', address: '' }); }} class="w-full bg-amber-500 text-slate-900 font-bold py-2 rounded hover:bg-amber-400">Order එක සාදන්න</button>
              </div>
            </div>

            {/* Payout Request Section */}
            <div class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
              <h2 class="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2"><CreditCard /> බැංකු විස්තර සහ මුදල් ලබාගැනීම්</h2>
              <div class="space-y-3">
                <input type="text" placeholder="බැංකුවේ නම" class="w-full bg-slate-900 p-2 rounded border border-slate-700" value={payoutForm.bankName} onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })} />
                <input type="text" placeholder="ගිණුම් අංකය" class="w-full bg-slate-900 p-2 rounded border border-slate-700" value={payoutForm.accountNo} onChange={(e) => setPayoutForm({ ...payoutForm, accountNo: e.target.value })} />
                <input type="number" placeholder="මුදල ($)" class="w-full bg-slate-900 p-2 rounded border border-slate-700" value={payoutForm.amount} onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })} />
                <button onClick={() => { handleAction('requestPayout', { ...payoutForm, userId: activeUserId }); setPayoutForm({ bankName: '', accountNo: '', amount: '' }); }} class="w-full bg-emerald-600 font-bold py-2 rounded hover:bg-emerald-500">Payout Request එක යවන්න</button>
              </div>
            </div>
          </div>

          {/* Orders Tracking Dashboard */}
          <section class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
            <h2 class="text-xl font-bold mb-4 text-white">ඔබගේ ඇණවුම්වල තත්ත්වය</h2>
            <div class="grid gap-4 md:grid-cols-2">
              {dbData.orders.filter((o: any) => o.seller_id === activeUserId).map((o: any) => (
                <div key={o.id} class="bg-slate-900 p-4 rounded-xl border border-slate-700">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-bold text-white">Order #{o.id} - {o.buyer_name}</h4>
                      <p class="text-xs text-slate-400">{o.address}</p>
                      <div class="mt-2 text-xs">තත්ත්වය: <span class="text-cyan-400 font-bold">{o.status}</span></div>
                      {o.reject_reason && <p class="text-xs text-red-400 mt-1">හේතුව: {o.reject_reason}</p>}
                    </div>
                    {o.status === 'Approved' && (
                      <button onClick={() => handleAction('updateOrderStatus', { id: o.id, status: 'Done' })} class="bg-green-600 px-3 py-1 rounded text-xs font-bold">Done Request</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ------------------ CUSTOMER PANEL ------------------ */}
      {currentRole === 'customer' && (
        <main class="space-y-8 animate-fadeIn">
          {/* KYC Notification */}
          <div class="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Shield class="text-indigo-400" />
              <div>
                <h4 class="font-bold text-white">ID & Face KYC Verification</h4>
                <p class="text-xs text-slate-400">භාණ්ඩ ලැයිස්තුගත කිරීමට ප්‍රථම ඔබගේ අනන්‍යතාවය තහවුරු කර තිබිය යුතුය.</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 font-mono">OTP Verified</span>
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            {/* Create Product Listing */}
            <div class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 md:col-span-1">
              <h2 class="text-xl font-bold mb-4 text-green-400 flex items-center gap-2"><FolderPlus /> නව භාණ්ඩයක් ඇතුලත් කරන්න</h2>
              <div class="space-y-3">
                <input type="text" placeholder="භාණ්ඩයේ නම" class="w-full bg-slate-900 p-2 rounded border border-slate-700" value={prodForm.title} onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })} />
                <select class="w-full bg-slate-900 p-2 rounded border border-slate-700" value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}>
                  <option value="Electronics">Electronics</option>
                  <option value="Mobile Icons">Mobile Icons</option>
                  <option value="Clothing">Clothing</option>
                </select>
                <input type="number" placeholder="ඔබේ මිල ($)" class="w-full bg-slate-900 p-2 rounded border border-slate-700" value={prodForm.base_price} onChange={(e) => setProdForm({ ...prodForm, base_price: e.target.value })} />
                <button onClick={() => { handleAction('addProduct', { ...prodForm, userId: activeUserId }); setProdForm({ title: '', category: 'Electronics', base_price: '' }); }} class="w-full bg-green-500 text-slate-900 font-bold py-2 rounded hover:bg-green-400">List කරන්න</button>
              </div>
            </div>

            {/* Marketplace Grid */}
            <div class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700 md:col-span-2">
              <h2 class="text-xl font-bold mb-4 text-white">වෙළඳපොළ (Live Marketplace View)</h2>
              <div class="grid gap-4 sm:grid-cols-2">
                {dbData.products.map((p: any) => {
                  const finalPrice = Number(p.base_price) + (Number(p.base_price) * Number(p.admin_markup_pct) / 100);
                  return (
                    <div key={p.id} class="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                      <div>
                        <span class="text-xs px-2 py-0.5 bg-slate-800 text-cyan-400 rounded-full">{p.category}</span>
                        <h4 class="font-bold text-white text-lg mt-1">{p.title}</h4>
                        <div class="text-xs text-slate-400 mt-2">මූලික මිල: ${p.base_price}</div>
                        <div class="text-xl font-black text-emerald-400 mt-1">විකුණුම් මිල: ${finalPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Incoming Orders Approval Center */}
          <section class="bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
            <h2 class="text-xl font-bold mb-4 text-white">ඇණවුම් අනුමත කිරීමේ මධ්‍යස්ථානය (Order Approvals)</h2>
            <div class="space-y-4">
              {dbData.orders.map((o: any) => (
                <div key={o.id} class="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span class="text-xs text-slate-500">Order ID: #{o.id}</span>
                    <h4 class="text-white font-bold">{o.buyer_name}</h4>
                    <p class="text-xs text-slate-400">{o.address}</p>
                    <p class="text-xs text-amber-400 mt-1">වත්මන් තත්ත්වය: {o.status}</p>
                  </div>
                  {o.status === 'Pending' && (
                    <div class="flex items-center gap-2 w-full md:w-auto">
                      <button onClick={() => handleAction('updateOrderStatus', { id: o.id, status: 'Approved' })} class="bg-emerald-600 px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Approve</button>
                      <div class="flex gap-1 items-center bg-slate-800 p-1 rounded border border-slate-700">
                        <input type="text" placeholder="ප්‍රතික්ෂේප කිරීමට හේතුව" class="bg-slate-900 text-xs p-1 rounded text-white w-32" value={rejectReason[o.id] || ''} onChange={(e) => setRejectReason({ ...rejectReason, [o.id]: e.target.value })} />
                        <button onClick={() => handleAction('updateOrderStatus', { id: o.id, status: 'Rejected', reason: rejectReason[o.id] })} class="bg-red-600 px-2 py-1.5 rounded text-xs font-bold"><XCircle size={14}/></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Broadcast Ticker */}
      <footer class="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
        <h4 class="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">පද්ධති නිවේදන (Live Broadcast Feed)</h4>
        <div class="space-y-1">
          {dbData.announcements.map((a: any) => (
            <div key={a.id} class="text-sm text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800">
              <span class="text-pink-400 font-mono text-xs mr-2">[{a.target_role.toUpperCase()}]</span> {a.message}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
