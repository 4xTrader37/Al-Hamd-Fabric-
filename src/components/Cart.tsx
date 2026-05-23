import React, { useState } from 'react';
import { CartItem, OrderDetails, ViewState } from '../types';
import { Trash2, Phone, ShoppingBag, Send, Search, Loader2, Check, ArrowRight, ClipboardCopy, Home } from 'lucide-react';
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, color: string, newQty: number) => void;
  onRemoveItem: (productId: string, color: string) => void;
  onNavigate: (view: ViewState) => void;
  onClearCart: () => void;
}

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate, onClearCart }: CartProps) {
  const [formData, setFormData] = useState<OrderDetails>({
    customerName: '',
    phone: '',
    shippingAddress: ''
  });
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success order confirmation state
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [generatedWhatsappUrl, setGeneratedWhatsappUrl] = useState<string>('');
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  // States for order tracking
  const [trackPhone, setTrackPhone] = useState('');
  const [trackedOrders, setTrackedOrders] = useState<any[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Currency helper
  const formatPrice = (num: number) => `Rs. ${num.toLocaleString('en-US')}`;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Free delivery standard promo: Free delivery if total is above Rs. 5000
  const isFreeDelivery = subtotal >= 5000;
  const shippingCost = subtotal === 0 ? 0 : (isFreeDelivery ? 0 : 250);
  const totalBill = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTrackQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackPhone.trim()) return;
    setIsTracking(true);
    setTrackError('');
    setHasSearched(true);
    try {
      const q = query(
        collection(db, 'orders'),
        where('phone', '==', trackPhone.trim())
      );
      const querySnapshot = await getDocs(q);
      const fetched: any[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort client-side by createdAt descending
      fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTrackedOrders(fetched);
    } catch (error) {
      console.error('Tracking Error:', error);
      setTrackError('Could not retrieve orders. Please check your network or try again.');
    } finally {
      setIsTracking(false);
    }
  };

  const generateInvoiceText = (orderId: string) => {
    let message = `*ASSALAAM-O-ALAIKUM AL HAMD FABRICS*\n`;
    message += `I have prepared a new fabric order on your website!\n\n`;
    message += `*🆔 Order ID:* ${orderId}\n`;
    message += `*👤 Customer Name:* ${formData.customerName.trim()}\n`;
    message += `*📞 Mobile:* ${formData.phone.trim()}\n`;
    message += `*📍 Address:* ${formData.shippingAddress.trim()}\n`;
    if (deliveryNotes.trim()) {
      message += `*📝 Instructions:* ${deliveryNotes.trim()}\n`;
    }
    
    message += `\n*🛍️ SUITS ORDERED:*\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   - Color: ${item.selectedColor}\n`;
      message += `   - Quantity: ${item.quantity}\n`;
      message += `   - Price: ${formatPrice(item.product.price)}\n`;
      message += `   - Subtotal: ${formatPrice(item.product.price * item.quantity)}\n\n`;
    });
    
    message += `*💳 BILLING SUMMARY:*\n`;
    message += `- *Subtotal:* ${formatPrice(subtotal)}\n`;
    message += `- *Shipping Fee:* ${shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}\n`;
    message += `- *Total Bill:* *${formatPrice(totalBill)}* (Cash On Delivery)\n\n`;
    message += `Please confirm fabric availability and share your dispatch details. JazaakAllah!`;
    return message;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    const orderId = `AHF-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // 1. Prepare serialize payload conforming to security rules schema:
      const serializedItems = cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        price: item.product.price
      }));

      const orderPayload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        shippingAddress: formData.shippingAddress.trim(),
        notes: deliveryNotes.trim(),
        items: serializedItems,
        subtotal: Number(subtotal),
        shippingCost: Number(shippingCost),
        totalBill: Number(totalBill),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // 2. Write Order directly inside safe cloud database
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, orderPayload);

      // 3. Redefine the link generation for WhatsApp cleanly and securely
      const invoiceText = generateInvoiceText(orderId);
      const encodedMsg = encodeURIComponent(invoiceText);
      const whatsappUrl = `https://wa.me/923053131133?text=${encodedMsg}`;
      
      setSubmittedOrderId(orderId);
      setGeneratedWhatsappUrl(whatsappUrl);

      // Simple browser popup try
      try {
        window.open(whatsappUrl, '_blank');
      } catch (err) {
        console.warn('Iframe popup blocked; user can manually click button.', err);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyClipboard = () => {
    const rawText = generateInvoiceText(submittedOrderId || 'AHF-DRAFT');
    navigator.clipboard.writeText(rawText);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 3000);
  };

  const renderOrderTracker = () => (
    <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 border border-[#A27C44]/20 shadow-sm max-w-2xl mx-auto mt-12 text-left">
      <div className="pb-4 mb-5 border-b border-[#A27C44]/15">
        <h3 className="font-serif font-black text-xl text-[#2C1D11] flex items-center gap-2">
          <Search className="w-5 h-5 text-[#A27C44]" />
          Track Past Orders
        </h3>
        <p className="text-stone-500 text-xs mt-1">Enter your WhatsApp or Call Mobile to trace prior orders from the database.</p>
      </div>

      <form onSubmit={handleTrackQuery} className="flex flex-col sm:flex-row gap-2.5 max-w-md mb-6">
        <input 
          type="tel" 
          placeholder="e.g. 03051234567" 
          value={trackPhone}
          onChange={(e) => setTrackPhone(e.target.value)}
          className="bg-white border border-[#A27C44]/25 focus:ring-1 focus:ring-[#A27C44] focus:border-[#A27C44] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none placeholder-stone-400 flex-grow"
          required
        />
        <button 
          type="submit"
          disabled={isTracking}
          className="bg-[#A27C44] hover:bg-[#8F6A34] disabled:bg-stone-400 active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
        >
          {isTracking && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Search Records
        </button>
      </form>

      {trackError && (
        <p className="text-red-600 text-xs font-semibold bg-red-50 p-3 rounded-xl border border-red-100 mb-4">{trackError}</p>
      )}

      {hasSearched && !isTracking && trackedOrders.length === 0 && (
        <div className="text-center py-6 bg-white/55 rounded-2xl border border-stone-200 border-dashed">
          <p className="text-stone-500 text-xs font-semibold">No fabric orders located matching: "{trackPhone}"</p>
          <p className="text-[11px] text-stone-400 mt-1">Ensure the mobile digits match your checkout form entries.</p>
        </div>
      )}

      {trackedOrders.length > 0 && (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {trackedOrders.map((ord) => (
            <div key={ord.id} className="bg-white rounded-2xl p-4.5 border border-stone-200/60 shadow-sm space-y-3 hover:border-[#A27C44]/30 transition-all">
              <div className="flex justify-between items-start gap-2 border-b border-stone-100 pb-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Order Ref</span>
                  <p className="font-mono text-xs font-bold text-[#2C1D11]">{ord.id}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block text-right">State</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide mt-1
                    ${ord.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                    ${ord.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                    ${ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : ''}
                    ${ord.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    ● {ord.status || 'pending'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Name:</span>
                  <span className="font-bold text-stone-850">{ord.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Address:</span>
                  <span className="text-stone-800 text-right truncate max-w-[200px]">{ord.shippingAddress}{ord.city ? `, ${ord.city}` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Date Placed:</span>
                  <span className="text-stone-700 font-mono text-[10px]">
                    {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl text-[11px] space-y-1">
                <span className="font-bold text-stone-500 uppercase tracking-widest text-[9px] block">Suits Detail:</span>
                {ord.items && ord.items.map((it: any, k: number) => (
                  <div key={k} className="flex justify-between text-stone-700">
                    <span>{it.name} <span className="text-stone-400">({it.selectedColor})</span> x{it.quantity}</span>
                    <span className="font-medium text-stone-850">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-[10px] uppercase font-extrabold text-[#A27C44]">Total Bill (Cash On Delivery):</span>
                <span className="text-xs font-black text-emerald-950">{formatPrice(ord.totalBill || ord.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (submittedOrderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-center font-sans text-stone-800 animate-fadeIn text-left">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-100 space-y-8 text-left">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest block font-sans">Database Entry Success</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#2C1D11]">
              Fabric Order Saved Successfully!
            </h2>
            <p className="text-stone-500 text-xs max-w-md mx-auto leading-relaxed">
              JazaakAllah! Your order record is safely registered inside the cloud server with ID <strong className="font-mono text-stone-900">{submittedOrderId}</strong>.
            </p>
          </div>

          {/* Action Instruction Box */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[#FAF6F0] to-[#F5EFE6] rounded-2xl border border-[#A27C44]/25 space-y-4">
            <h4 className="text-xs font-extrabold text-[#2C1D11] uppercase tracking-wider flex items-center gap-1.5 justify-center">
              <Send className="w-4 h-4 text-emerald-600" />
              Final Step: Send to Shop Owner Zaffar Iqbal
            </h4>
            <p className="text-xs text-stone-600 text-center leading-relaxed">
              To instantly finalize delivery, stock checking, and dispatch coordinates with our team, please click the button below to send your structured invoice directly over WhatsApp Messenger.
            </p>

            <div className="space-y-3 max-w-sm mx-auto pt-1">
              <a 
                href={generatedWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  onClearCart();
                }}
                className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all text-xs tracking-wider cursor-pointer animate-pulse text-center uppercase"
              >
                <Phone className="w-4 h-4 text-white fill-white" />
                <span>Open WhatsApp Chat</span>
              </a>

              <button
                type="button"
                onClick={handleCopyClipboard}
                className="w-full px-5 py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer border border-stone-200/80"
              >
                <ClipboardCopy className="w-3.5 h-3.5" />
                <span>{copiedInvoice ? 'Invoice Copy Success!' : 'Copy Raw Invoice Text'}</span>
              </button>

              <p className="text-[10px] text-stone-400 text-center mt-2 leading-relaxed">
                If the automatic WhatsApp page does not trigger, use the copy button and paste it directly into user chat on <strong>+92 305 3131133</strong>.
              </p>
            </div>
          </div>

          {/* Invoice Summary Box */}
          <div className="border border-stone-200 rounded-2xl p-5 space-y-3.5 divide-y divide-stone-100 text-xs text-stone-600 bg-stone-50/50">
            <h4 className="font-bold text-stone-800 uppercase tracking-widest text-[9.5px]">Brief Invoice Ledger:</h4>
            
            <div className="pt-3 flex justify-between">
              <span>Client Name:</span>
              <strong className="text-stone-900">{formData.customerName}</strong>
            </div>
            
            <div className="pt-2 flex justify-between">
              <span>WhatsApp Mobile:</span>
              <span className="text-stone-900 font-mono font-semibold">{formData.phone}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span>Postal Destination:</span>
              <span className="text-stone-800 text-right truncate max-w-[250px]">{formData.shippingAddress}</span>
            </div>

            <div className="pt-2 flex justify-between text-[#2C1D11] font-black text-sm">
              <span>Grand Total COD Due:</span>
              <span className="text-emerald-950 font-bold">{formatPrice(totalBill)}</span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                onClearCart();
                onNavigate({ type: 'home' });
              }}
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              Return to Al Hamd Shop Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-sans text-stone-800 animate-fadeIn">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-stone-200/60 max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-black text-[#2C1D11]">Your Cart is Empty</h2>
            <p className="text-stone-500 text-xs">Browse Al Hamd Fabric collections of 3-Piece Lawn, wash-n-wear and traditional Gents cotton to pick premium fabrics!</p>
          </div>
          <button
            onClick={() => onNavigate({ type: 'products', filterCategory: 'all' })}
            className="w-full px-5 py-3 bg-[#A27C44] hover:bg-[#8F6A34] active:scale-95 text-white font-bold rounded-xl transition-all text-xs tracking-wider cursor-pointer font-sans"
          >
            Browse Premium Fabric Catalogue
          </button>
        </div>
        
        {/* Dynamic order tracking */}
        {renderOrderTracker()}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 font-sans text-stone-800 text-left">
      <div className="border-b border-stone-200 pb-5 mb-8">
        <h1 className="text-3xl font-serif font-black text-[#2C1D11] flex items-center gap-2">
          Your Shopping Cart
          <span className="text-xs font-normal text-stone-400">({cartItems.length} Suits Selected)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Cart selection item list */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-3.5">
            {cartItems.map((item) => (
              <div 
                key={`${item.product.id}-${item.selectedColor}`}
                className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex gap-4 hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="w-20 sm:w-24 aspect-[3/4] bg-stone-105 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {/* Info Container */}
                <div className="flex flex-col justify-between flex-grow">
                  <div className="space-y-1">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-serif font-black text-sm text-stone-950 line-clamp-1 hover:text-[#A27C44] cursor-pointer" onClick={() => onNavigate({ type: 'product-detail', productId: item.product.id })}>
                        {item.product.name}
                      </h3>
                      <button 
                        onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                        className="text-stone-400 hover:text-red-650 transition-colors cursor-pointer"
                        title="Delete product selector"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                      <span className="bg-amber-100/70 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[10px]">
                        Color: {item.selectedColor}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span>{item.product.fabricInfo.pieces} fabric suit</span>
                    </div>
                  </div>

                  {/* Quantity controls and price tag */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                        className="px-2.5 py-1 hover:bg-stone-200 text-xs font-semibold"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-stone-900 bg-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                        className="px-2.5 py-1 hover:bg-stone-200 text-xs font-semibold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-450 block">Suit Subtotal:</span>
                      <span className="text-sm font-black text-emerald-950">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center bg-stone-50 p-4 rounded-xl text-stone-500 text-xs border border-stone-200/50">
            <span>Placed wrong items?</span>
            <button 
              onClick={onClearCart}
              className="text-stone-700 hover:text-red-700 font-bold transition-colors cursor-pointer"
            >
              Clear Entire Selector List
            </button>
          </div>
        </div>

        {/* Right Side: Delivery Form & Checkout Bills */}
        <div className="lg:col-span-5 bg-stone-50 rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="font-serif font-black text-lg text-[#2C1D11] flex items-center gap-1.5">
              <Phone className="w-5 h-5 text-[#A27C44]" />
              Shipping Information
            </h3>
            <p className="text-stone-500 text-[11px] mt-1">Complete delivery coords to finalize database entry & WhatsApp invoice generation.</p>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Customer Name *</label>
              <input 
                type="text" 
                name="customerName"
                placeholder="Ghulam Rasool"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#A27C44] focus:border-[#A27C44]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">WhatsApp / Call Mobile *</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="e.g. 03051234567"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#A27C44] focus:border-[#A27C44]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Shipping Full Address *</label>
              <input 
                type="text" 
                name="shippingAddress"
                placeholder="House #, Street #, Sector/Block, City (e.g. Lahore, Karachi, Peshawar)"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#A27C44] focus:border-[#A27C44]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Delivery Instructions (Optional)</label>
              <textarea 
                rows={2}
                name="notes"
                placeholder="Call before arrival, deliver after 2pm, etc."
                value={deliveryNotes}
                onChange={e => setDeliveryNotes(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#A27C44] focus:border-[#A27C44]"
              />
            </div>

            {/* Calculations Panel */}
            <div className="border-t border-stone-200 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Selected {cartItems.reduce((acc, i) => acc + i.quantity, 0)} suits count:</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Shipping Cost (TCS / Rider COD):</span>
                <span className="font-bold">
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>

              {!isFreeDelivery ? (
                <p className="text-[10px] text-amber-800 font-bold bg-amber-500/10 p-2.5 rounded-xl leading-normal shrink-0">
                  💡 Tip: Add fabrics of Rs. {5000 - subtotal} more to unlock <strong>FREE TCS DELIVERY</strong> anywhere in Pakistan!
                </p>
              ) : (
                <p className="text-[10px] text-emerald-800 font-bold bg-emerald-100 p-2.5 rounded-xl leading-relaxed flex items-center gap-1">
                  🎉 Good news! Your order qualifies for <strong>100% Free Shipping</strong>.
                </p>
              )}

              <div className="flex justify-between text-base font-black text-emerald-950 pt-3 border-t border-stone-200/60">
                <span>Grand Total (Pay COD):</span>
                <span>{formatPrice(totalBill)}</span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-[#A27C44] hover:bg-[#8F6A34] disabled:bg-stone-400 active:scale-95 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2.5 transition-all text-xs tracking-widest mt-4 uppercase select-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white fill-white" />
                  <span>Submit Order to Database</span>
                </>
              )}
            </button>
          </form>

          {/* Delivery disclaimer */}
          <div className="p-3 bg-stone-100 rounded-2xl text-[10px] text-stone-500 italic flex gap-1.5 leading-normal">
            <span>🛡️</span>
            <span>All orders are hand-settled via Cash on Delivery (COD). Al Hamd Fabrics owner Zaffar Iqbal will audit availability and coordinate dispatch directly over WhatsApp.</span>
          </div>
        </div>
      </div>

      {/* Database matching tracer */}
      <div className="border-t border-[#A27C44]/15 mt-12 pt-8">
        {renderOrderTracker()}
      </div>
    </div>
  );
}
