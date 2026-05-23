import { ShieldAlert, Key, Globe, Eye, Trash2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 font-sans text-stone-800 text-left">
      <div className="space-y-4 mb-10 border-b border-stone-200 pb-8 text-center sm:text-left">
        <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">Trust & Accountability</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-emerald-950">
          Privacy Policy
        </h1>
        <p className="text-stone-500 text-xs">Last Updated: May 23, 2026 • Al Hand Fabric Outlet</p>
      </div>

      <div className="space-y-8 leading-relaxed text-sm text-stone-600">
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            1. Introduction
          </h2>
          <p>
            Al Hand Fabric ("we", "our", or "shop") operates the website for our retail outlet situated physically in <strong>Manga Mandi, Raiwind Road, Lahore</strong>. 
            We are dedicated to maintaining the absolute trust and confidence of our customers from Lahore and across Pakistan. This Privacy Policy outlines 
            how we collect, use, and safe-keep your generic shipping info when you select our digital catalog and complete checkout on WhatsApp.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            2. Customer Information Collected & Usage
          </h2>
          <p>
            Our e-commerce portal functions as a high-fidelity digital browser with WhatsApp order generation. We do not store your permanent financial secrets or credit cards 
            online because all transactions are settled via <strong>Cash on Delivery (COD)</strong> or direct bank transfer upon personal WhatsApp coordination with Zaffar Iqbal.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Recipient Name & Address:</strong> Needed strictly to compile your customized shipping invoice label and hand it over to local courier services (such as TCS, Leopards, or local Lahore riders).</li>
            <li><strong>WhatsApp/Phone Number:</strong> Essential to send you real pictures of the fabrics before packing, and to coordinate timing of delivery at Raiwind Road or surrounding Lahore suburbs.</li>
            <li><strong>Local State:</strong> Temporarily stored inside your local browser storage (using localStorage) to save your current shopping cart. We do not transmit or sell this memory to any advertising agencies.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            3. Order Settlement & WhatsApp Direct Ordering Policy
          </h2>
          <p>
            When you press the "Submit Order via WhatsApp" button inside your cart, your selected suits, piece count, selected colors, and delivery details are structured 
            into a readable text template and passed over to <strong>WhatsApp Messenger</strong>. No background hidden billing takes place. This gives you ultimate manual control 
            over your order proposal before committing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            4. Security of Fabrics & Integrity Checks
          </h2>
          <p>
            We guarantee original fabrics. Under the direct supervision of <strong>Zaffar Iqbal</strong>, each piece of Lawn, Cotton-Latha, or Boski is individually tested 
            for defects, misprints, or weave breakage before shipping from Manga Mandi.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            5. Contact Information & Redressal
          </h2>
          <p>
            If you have questions about your data or wish to cancel/alter an order request, you can call or message us directly on WhatsApp at <strong>+92 305 3131133</strong>, 
            or visit us at Raiwind Road, Manga Mandi, Lahore.
          </p>
        </section>
      </div>

      <div className="mt-12 p-6 bg-stone-100 rounded-2xl border border-stone-200 text-stone-500 text-xs">
        🛡️ Al Hand Fabric secures customer trust physically and digitally. Operating ethically inside Pakistan since our establishment at Manga Mandi.
      </div>
    </div>
  );
}
