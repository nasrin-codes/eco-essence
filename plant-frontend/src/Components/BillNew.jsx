import React, { useState } from 'react';

export default function Bill({ order, onClose }) {
  const [format, setFormat] = useState('full'); // 'full' | 'card'

  if (!order) return null;

  const items = (order.items || []).map(it => {
    const qty = Number(it.qty || it.quantity || 1);
    const price = Number(it.price ?? (it.total ? it.total / qty : 0));
    return { name: it.name || it.title || 'Item', qty, price, total: Number(it.total ?? price * qty) };
  });
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const total = Number(order.total ?? subtotal);
  const deliveryFee = Math.max(0, total - subtotal);
  const billNo = 'EE-' + String(order.id || order._id || '000000').slice(-6).toUpperCase();
  const dateStr = order.date
    ? new Date(order.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleString('en-IN');
  const phoneDigits = String(order.phone || '').replace(/\D/g, '');
  const waNum = phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits.length === 12 && phoneDigits.startsWith('91') ? phoneDigits : null;
  const addr = order.address?.full || (order.address ? [order.address.address1, order.address.city, order.address.pincode].filter(Boolean).join(', ') : 'In-Store Purchase');

  const siteUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://eco-essence-pi.vercel.app';
  const siteQr = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=10&color=0F2A1D&bgcolor=FFFFFF&data=${encodeURIComponent(siteUrl)}`;

  const gstTotal = subtotal * 5 / 105;
  const cgst = gstTotal / 2;
  const sgst = gstTotal / 2;

  const payStatus = String(order.payment?.status || order.status || '');
  const payMethod = String(order.payment?.methodLabel || order.paymentMethod || 'Cash');
  const isCOD = /cash on delivery|cod|pay on delivery/i.test(payMethod) || /pay on delivery/i.test(payStatus);
  const isPaid = !isCOD && (/paid|success|completed/i.test(payStatus) || /upi|card|online|net banking|wallet/i.test(payMethod));
  const advancePaid = isPaid ? total : Number(order.advancePaid || 0);
  const balanceDue = Math.max(0, total - advancePaid);

  const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // LEAF LOGO - Eco-Essence ke baad wala patta (emoji nahi, asli logo - har device/printer pe same)
  const LeafLogo = ({ size = 30 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M12 1.5C6.4 7 4.2 11.6 4.2 15a7.8 7.8 0 0 0 15.6 0c0-3.4-2.2-8-7.8-13.5Z" fill="#1a5a3a" />
      <path d="M12 21.5C12 16 12 10 12 4.5" stroke="#C9A227" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12 12.5 8.6 9.8M12 12.5l3.4-2.7M12 16.5l-2.8-2.2M12 16.5l2.8-2.2" stroke="#C9A227" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
  // Canvas PNG ke liye wahi patta - path se banta hai, koi image load nahi karni
  const drawLeaf = (ctx, cx, cy, s, GREEN, GOLD) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, -s / 2);
    ctx.bezierCurveTo(s * 0.42, -s * 0.18, s * 0.36, s * 0.28, 0, s / 2);
    ctx.bezierCurveTo(-s * 0.36, s * 0.28, -s * 0.42, -s * 0.18, 0, -s / 2);
    ctx.closePath();
    ctx.fillStyle = GREEN; ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = Math.max(1, s * 0.045); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, s * 0.42); ctx.lineTo(0, -s * 0.32); ctx.stroke();
    ctx.lineWidth = Math.max(0.8, s * 0.035);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * 0.18, -s * 0.12); ctx.moveTo(0, 0); ctx.lineTo(s * 0.18, -s * 0.12); ctx.stroke();
    ctx.restore();
  };

  const billText = `Hello ${order.customerName || 'Customer'}! Your Eco-Essence Bill\n\nInvoice No: ${billNo}\nDate: ${dateStr}\n\nItems:\n${items.map(i => `- ${i.name} x ${i.qty} @ ${money(i.price)} = ${money(i.total)}`).join('\n')}\n\nSubtotal: ${money(subtotal)}\nDelivery: ${deliveryFee ? money(deliveryFee) : 'FREE'}\nGrand Total: ${money(total)}\nPayment: ${payMethod}\nBalance Due: ${money(balanceDue)}\n\nThank you for growing with Eco-Essence!\n\nShop again - scan ya kholo: ${siteUrl}`;

  // BILL PNG - screen wale design jaisa, har row apni jagah (koi overlap nahi)
  const downloadBillImage = () => {
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => drawBillPng(qrImg);
    qrImg.onerror = () => drawBillPng(null);
    qrImg.src = siteQr;
  };
  const drawBillPng = (qrImg) => {
    const W = format === 'card' ? 520 : 720;
    const pad = 44;
    const rowH = 36;
    // Height content se banti hai - fixed formula nahi, taaki rows kabhi overlap na hon
    const H = 830 + items.length * rowH;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const fit = (text, maxW) => {
      let t = String(text);
      while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -1);
      return t;
    };
    const GREEN = '#0F2A1D', GOLD = '#C9A227', INK = '#1A1A1A', MUT = 'rgba(0,0,0,0.55)';

    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);

    // HEADER - watermark sirf yahan, halka, text ke peeche nahi
    ctx.textAlign = 'center'; ctx.fillStyle = GREEN;
    ctx.font = 'bold 38px Georgia, serif';
    ctx.fillText('Eco-Essence', W / 2, 62);
    drawLeaf(ctx, W / 2 + ctx.measureText('Eco-Essence').width / 2 + 20, 47, 30, GREEN, GOLD);
    ctx.font = '11px Arial, sans-serif'; ctx.fillStyle = GOLD;
    ctx.fillText('P L A N T S   \u2022   P O T S   \u2022   G R E E N   L I V I N G', W / 2, 88);
    ctx.font = '12px Arial, sans-serif'; ctx.fillStyle = MUT;
    ctx.fillText('Opp. Kankaria Gate No. 1, Kankaria, Ahmedabad, Gujarat', W / 2, 112);
    ctx.fillText('Phone: +91 (555) 752-6847  |  hello@ecoessence.com', W / 2, 132);
    ctx.font = 'bold 13px Arial, sans-serif'; ctx.fillStyle = GREEN;
    ctx.fillText('TAX INVOICE', W / 2, 160);
    ctx.fillStyle = GREEN; ctx.fillRect(pad, 176, W - pad * 2, 3);
    ctx.fillStyle = GOLD; ctx.fillRect(pad, 182, W - pad * 2, 1);

    // BILLED TO | INVOICE - har line apni y pe, 24px gap
    let y = 212;
    ctx.textAlign = 'left'; ctx.font = 'bold 12px Arial, sans-serif'; ctx.fillStyle = INK;
    ctx.fillText('Billed To: ', pad, y);
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText(fit(order.customerName || 'Guest Customer', W * 0.42), pad + 68, y);
    ctx.textAlign = 'right'; ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillText('Invoice No: ', W - pad - 110, y);
    ctx.font = '12px Arial, sans-serif'; ctx.fillText(billNo, W - pad, y);
    y += 24;
    ctx.textAlign = 'left'; ctx.font = '12px Arial, sans-serif'; ctx.fillStyle = MUT;
    ctx.fillText('Phone: ' + (waNum ? '+' + waNum : (order.phone || '-')), pad, y);
    ctx.textAlign = 'right'; ctx.fillStyle = INK; ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillText('Date: ', W - pad - 110, y);
    ctx.font = '12px Arial, sans-serif'; ctx.fillText(dateStr, W - pad, y);
    y += 24;
    ctx.textAlign = 'left'; ctx.font = '11px Arial, sans-serif'; ctx.fillStyle = MUT;
    ctx.fillText(fit(addr, W * 0.55), pad, y);
    ctx.textAlign = 'right'; ctx.font = 'bold 12px Arial, sans-serif'; ctx.fillStyle = INK;
    ctx.fillText('Payment: ', W - pad - 110, y);
    ctx.font = '12px Arial, sans-serif'; ctx.fillText(fit(payMethod, 105), W - pad, y);
    y += 22;
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();

    // TABLE HEADER
    y += 30;
    ctx.textAlign = 'left'; ctx.font = 'bold 12px Arial, sans-serif'; ctx.fillStyle = INK;
    ctx.fillText('Description', pad, y);
    ctx.textAlign = 'center'; ctx.fillText('Qty', W * 0.60, y);
    ctx.textAlign = 'right'; ctx.fillText('Rate', W * 0.78, y); ctx.fillText('Amount', W - pad, y);
    y += 8;
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
    items.forEach((it) => {
      y += rowH;
      ctx.textAlign = 'left'; ctx.font = '12px Arial, sans-serif'; ctx.fillStyle = INK;
      ctx.fillText(fit(it.name, W * 0.45), pad, y);
      ctx.textAlign = 'center'; ctx.fillStyle = MUT;
      ctx.fillText(String(it.qty), W * 0.60, y);
      ctx.textAlign = 'right'; ctx.fillStyle = INK;
      ctx.fillText(money(it.price), W * 0.78, y);
      ctx.font = 'bold 12px Arial, sans-serif'; ctx.fillText(money(it.total), W - pad, y);
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.beginPath(); ctx.moveTo(pad, y + 12); ctx.lineTo(W - pad, y + 12); ctx.stroke();
    });

    // TOTALS CARD - halki green background, har row 28px gap
    y += 24;
    const cardX = W * 0.52, cardW = W - pad - cardX, cardTop = y - 8;
    const tRow = (label, val, bold, color) => {
      ctx.textAlign = 'left'; ctx.font = (bold ? 'bold ' : '') + '12px Arial, sans-serif'; ctx.fillStyle = color || MUT;
      ctx.fillText(label, cardX + 16, y);
      ctx.textAlign = 'right'; ctx.fillStyle = color || INK; ctx.fillText(val, W - pad - 16, y);
      y += 28;
    };
    tRow('Subtotal:', money(subtotal));
    tRow('Delivery:', deliveryFee ? money(deliveryFee) : 'FREE');
    tRow('CGST (2.5%) incl.:', money(cgst));
    tRow('SGST (2.5%) incl.:', money(sgst));
    // Grand Total - apni green patti me, kisi row se chipakta nahi
    const bandH = 36;
    ctx.fillStyle = GREEN; ctx.fillRect(cardX, y - 6, cardW, bandH);
    ctx.textAlign = 'left'; ctx.font = 'bold 13px Arial, sans-serif'; ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Grand Total:', cardX + 16, y + 17);
    ctx.textAlign = 'right'; ctx.fillText(money(total), W - pad - 16, y + 17);
    y += bandH + 10;
    if (advancePaid > 0) { tRow('Advance Paid:', money(advancePaid), true, '#1a5a3a'); }
    if (balanceDue > 0) { tRow('Balance Due:', money(balanceDue), true, '#C0392B'); }
    ctx.fillStyle = 'rgba(15,42,29,0.06)'; ctx.fillRect(cardX, cardTop, cardW, (y - 10) - cardTop);

    // TERMS + SIGNATORY
    y += 30;
    ctx.textAlign = 'left'; ctx.font = 'bold 11px Arial, sans-serif'; ctx.fillStyle = INK;
    ctx.fillText('Terms & Conditions:', pad, y);
    ctx.font = '10px Arial, sans-serif'; ctx.fillStyle = MUT;
    ctx.fillText('1. Live plants - please follow the care guide.', pad, y + 20);
    ctx.fillText('2. Replacement within 7 days for transit damage.', pad, y + 36);
    ctx.fillText('3. Subject to Ahmedabad jurisdiction.', pad, y + 52);
    const bx = W - pad - 190, by = y - 8, bw = 190, bh = 78;
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.strokeRect(bx, by, bw, bh); ctx.setLineDash([]);
    ctx.textAlign = 'center'; ctx.font = 'bold 9px Arial, sans-serif'; ctx.fillStyle = MUT;
    ctx.fillText('AUTHORIZED SIGNATORY', bx + bw / 2, by + 18);
    ctx.font = 'bold 14px Georgia, serif'; ctx.fillStyle = GREEN;
    ctx.fillText('Eco-Essence', bx + bw / 2, by + 44);
    drawLeaf(ctx, bx + bw / 2 + ctx.measureText('Eco-Essence').width / 2 + 12, by + 36, 16, GREEN, GOLD);
    ctx.font = '9px Arial, sans-serif'; ctx.fillStyle = '#1a5a3a';
    ctx.fillText('GROW WITH US', bx + bw / 2, by + 62);

    // QR + THANKS - neeche, apni jagah
    y += 108;
    ctx.textAlign = 'center'; ctx.font = 'bold 12px Arial, sans-serif'; ctx.fillStyle = GREEN;
    ctx.fillText('Scan to shop again', W / 2, y);
    if (qrImg) { ctx.drawImage(qrImg, W / 2 - 34, y + 12, 68, 68); }
    ctx.font = 'bold 13px Georgia, serif'; ctx.fillStyle = INK;
    ctx.fillText('Thank you for growing with us!', W / 2, y + 108);
    ctx.font = '10px Arial, sans-serif'; ctx.fillStyle = MUT;
    ctx.fillText('This is a computer-generated receipt.', W / 2, y + 128);

    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'Eco-Essence-Bill-' + billNo + '.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    }, 'image/png');
  };

  const sendBillWhatsApp = () => {
    if (!waNum) { alert('Is order me sahi 10-digit number nahi hai, isliye WhatsApp nahi khul raha.'); return; }
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(billText)}`, '_blank', 'noopener');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px] grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .bill-print-area, .bill-print-area * { visibility: visible; }
          .bill-print-area { position: absolute; left: 0; top: 0; width: 100%; max-width: 100% !important; margin: 0; box-shadow: none !important; border: none !important; border-radius: 0 !important; }
        }
      `}</style>

      <div className="w-full max-w-[680px] my-6" onClick={e => e.stopPropagation()}>
        {/* BILL - yehi print hoga */}
        <div className={`bill-print-area relative bg-white shadow-2xl overflow-hidden ${format === 'card' ? 'max-w-[480px] mx-auto' : ''}`}>

          {/* HEADER */}
          <div className="relative px-8 pt-7 pb-4 text-center">
            <div className="font-serif text-[36px] leading-none font-bold text-[#0F2A1D] tracking-wide flex items-center justify-center gap-1.5">Eco-Essence <LeafLogo size={30} /></div>
            <div className="font-sans text-[10px] tracking-[0.3em] text-[#C9A227] font-bold mt-2">PLANTS &nbsp;•&nbsp; POTS &nbsp;•&nbsp; GREEN LIVING</div>
            <div className="font-sans text-[11px] text-black/60 mt-2">Opp. Kankaria Gate No. 1, Kankaria, Ahmedabad, Gujarat</div>
            <div className="font-sans text-[11px] text-black/60">Phone: +91 (555) 752-6847 &nbsp;|&nbsp; hello@ecoessence.com</div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="font-sans text-[13px] font-bold text-[#0F2A1D] tracking-[0.25em]">TAX INVOICE</span>
              {isPaid
                ? <span className="font-sans text-[10px] font-bold bg-[#1a5a3a] text-white px-2.5 py-1 rounded-full">✓ PAID</span>
                : <span className="font-sans text-[10px] font-bold bg-[#FFF4D6] text-[#8A6D00] px-2.5 py-1 rounded-full">COD • PAY ON DELIVERY</span>}
            </div>
          </div>
          <div className="mx-8 h-[3px] bg-[#0F2A1D]" />
          <div className="mx-8 h-[1px] bg-[#C9A227] mt-[2px]" />

          {/* BILLED TO / INVOICE */}
          <div className="relative px-8 pt-4 flex justify-between gap-6 flex-wrap">
            <div>
              <div className="font-sans text-[12px]"><span className="font-bold">Billed To:</span> {order.customerName || 'Guest Customer'}</div>
              <div className="font-sans text-[12px] text-black/60 mt-1"><span className="font-bold text-black">Phone:</span> {waNum ? `+${waNum}` : (order.phone || '-')}</div>
              <div className="font-sans text-[11px] text-black/60 mt-1 max-w-[300px] leading-snug">{addr}</div>
            </div>
            <div className="text-right font-sans text-[12px] space-y-1">
              <div><span className="font-bold">Invoice No:</span> {billNo}</div>
              <div><span className="font-bold">Date:</span> {dateStr}</div>
              <div><span className="font-bold">Payment:</span> {payMethod}</div>
              {order.source === 'offline' && <div className="font-bold text-[#1a5a3a]">🏪 In-Store Purchase</div>}
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="relative px-8 mt-5">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-[#F2F7F3]">
                <th className="py-2.5 px-2 font-sans text-[12px] font-bold rounded-tl-[8px]">Description</th>
                <th className="py-2.5 font-sans text-[12px] font-bold text-center">Qty</th>
                <th className="py-2.5 font-sans text-[12px] font-bold text-right">Rate</th>
                <th className="py-2.5 px-2 font-sans text-[12px] font-bold text-right rounded-tr-[8px]">Amount</th>
              </tr></thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-b border-dashed border-black/10">
                    <td className="py-3 px-2 font-sans text-[12px] pr-2">{it.name}</td>
                    <td className="py-3 font-sans text-[12px] text-center text-black/70">{it.qty}</td>
                    <td className="py-3 font-sans text-[12px] text-right">{money(it.price)}</td>
                    <td className="py-3 px-2 font-sans text-[12px] font-bold text-right">{money(it.total)}</td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan="4" className="py-4 text-center font-sans text-[12px] opacity-50">No items</td></tr>}
              </tbody>
            </table>
          </div>

          {/* TOTALS - apna card, har row alag line, Grand Total green patti me */}
          <div className="relative px-8 mt-5 flex justify-end">
            <div className="w-full max-w-[320px] bg-[#F7FAF7] rounded-[14px] p-4 font-sans text-[12px] space-y-2.5">
              <div className="flex justify-between"><span className="text-black/60">Subtotal:</span><span>{money(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-black/60">Delivery:</span><span>{deliveryFee ? money(deliveryFee) : 'FREE'}</span></div>
              <div className="flex justify-between"><span className="text-black/60">CGST (2.5%) incl.:</span><span>{money(cgst)}</span></div>
              <div className="flex justify-between"><span className="text-black/60">SGST (2.5%) incl.:</span><span>{money(sgst)}</span></div>
              <div className="flex justify-between items-center bg-[#0F2A1D] text-white rounded-[10px] px-3 py-2.5 -mx-1 font-bold text-[13px]"><span>Grand Total:</span><span>{money(total)}</span></div>
              {advancePaid > 0 && <div className="flex justify-between font-bold text-[#1a5a3a]"><span>Advance Paid:</span><span>{money(advancePaid)}</span></div>}
              {balanceDue > 0 && <div className="flex justify-between font-bold text-[#C0392B]"><span>Balance Due:</span><span>{money(balanceDue)}</span></div>}
              {balanceDue === 0 && <div className="text-center font-bold text-[#1a5a3a] text-[11px] tracking-wide">✓ FULLY PAID — NOTHING DUE</div>}
            </div>
          </div>

          {/* TERMS + SIGNATORY */}
          <div className="relative px-8 pt-6 pb-4 flex justify-between gap-6 items-end">
            <div className="max-w-[330px]">
              <div className="font-sans text-[11px] font-bold">Terms &amp; Conditions:</div>
              <div className="font-sans text-[10px] text-black/60 leading-relaxed mt-1">
                1. Live plants — please follow the care guide.<br />
                2. Replacement within 7 days for transit damage.<br />
                3. Subject to Ahmedabad jurisdiction.
              </div>
            </div>
            <div className="shrink-0 border-[1.5px] border-dashed border-[#C9A227] rounded-[10px] px-5 py-3 text-center">
              <div className="font-sans text-[8px] tracking-[0.2em] font-bold text-black/50">AUTHORIZED SIGNATORY</div>
              <div className="font-serif text-[15px] font-bold text-[#0F2A1D] mt-1 flex items-center justify-center gap-1">Eco-Essence <LeafLogo size={16} /></div>
              <div className="font-sans text-[8px] tracking-[0.2em] font-bold text-[#1a5a3a] mt-0.5">★ GROW WITH US ★</div>
            </div>
          </div>

          <div className="relative px-8 pb-5 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white border border-black/10 rounded-[10px] p-1.5 shadow-sm">
                <img src={siteQr} alt="Scan to shop again on Eco-Essence" width="76" height="76" className="rounded-[4px]" loading="lazy" />
              </div>
              <div className="text-left">
                <div className="font-sans text-[11px] font-bold text-[#0F2A1D]">Scan to shop again</div>
                <div className="font-sans text-[10px] text-black/50 mt-0.5">Eco-Essence • Plants, Pots &amp; Green Living</div>
              </div>
            </div>
            <div className="font-serif text-[14px] font-bold mt-3">Thank you for growing with us! 🌿</div>
            <div className="font-sans text-[10px] opacity-50 mt-1">This is a computer-generated receipt.</div>
          </div>
        </div>

        {/* ACTIONS - print me nahi aayenge, sirf screen pe */}
        <div className="bill-actions mt-4 bg-white rounded-[18px] border shadow-xl p-4">
          <div className="flex gap-2">
            <button onClick={() => setFormat('full')} className={`flex-1 h-10 rounded-full font-sans text-[11px] font-bold transition ${format === 'full' ? 'bg-[#0F2A1D] text-white' : 'border hover:border-[#1a5a3a]'}`}>📄 Full Bill</button>
            <button onClick={() => setFormat('card')} className={`flex-1 h-10 rounded-full font-sans text-[11px] font-bold transition ${format === 'card' ? 'bg-[#0F2A1D] text-white' : 'border hover:border-[#1a5a3a]'}`}>💳 Card Format</button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button onClick={() => window.print()} className="h-11 rounded-full bg-[#0F2A1D] text-white font-sans text-[12px] font-bold hover:bg-[#1a5a3a] transition">🖨 Print Bill</button>
            <button onClick={downloadBillImage} className="h-11 rounded-full bg-[#C9A227] text-[#0F2A1D] font-sans text-[12px] font-bold hover:opacity-90 transition">🖼 Download Bill Image</button>
          </div>
          <button onClick={sendBillWhatsApp} className="mt-2 w-full h-11 rounded-full bg-[#25D366] text-white font-sans text-[12px] font-bold hover:opacity-90 transition">📱 Send Bill on WhatsApp {waNum ? `(+${waNum})` : ''}</button>
          <div className="font-sans text-[10px] opacity-50 text-center mt-2 leading-relaxed">Online customer ko Bill Image bhejo: <b>pehle Download Bill Image</b> dabao, phir WhatsApp khulega to <b>image attach karke Send</b> karo. wa.me link se image apne aap attach nahi hoti, isliye 2 step me jayegi.</div>
          <button onClick={onClose} className="mt-2 w-full h-10 rounded-full font-sans text-[11px] font-bold opacity-60 hover:opacity-100 transition">Close ✕</button>
        </div>
      </div>
    </div>
  );
}
