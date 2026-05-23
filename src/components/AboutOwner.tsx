import React, { useState } from 'react';
import { Award, ShieldCheck, MapPin, Sparkles, Clock, Phone, Heart, Send, Loader2 } from 'lucide-react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function AboutOwner() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) return;

    setLoading(true);
    const feedbackId = `FB-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString()
      };

      const feedbackRef = doc(db, 'feedback', feedbackId);
      await setDoc(feedbackRef, payload);

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => setSuccess(false), 6000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `feedback/${feedbackId}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 font-sans text-stone-800">
      {/* Editorial top section about owner and shop */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">The Soul of Al Hamd Fabrics</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-emerald-950">
          Our Heritage & Curation
        </h2>
        <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full"></div>
        <p className="text-stone-600 text-base leading-relaxed">
          At Al Hamd Fabrics, cloth weaving is not just business—it is an art of uncompromised Pakistani textile tradition, 
          built on direct trust and family custom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Editorial Image & Signature */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] bg-stone-200 rounded-3xl overflow-hidden border-2 border-amber-600/20 shadow-xl relative">
            <img 
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80" 
              alt="Premium traditional fabric rolls" 
              className="w-full h-full object-cover grayscale-[10%]"
              referrerPolicy="no-referrer"
            />
            {/* Owner Tag Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur p-5 rounded-2xl border border-stone-200 shadow-xl text-left">
              <span className="text-[10px] uppercase tracking-widest text-amber-600 font-extrabold">Shop Proprietor</span>
              <h3 className="font-serif text-lg font-black text-emerald-950 mt-1">Zaffar Iqbal</h3>
              <p className="text-xs text-stone-500 italic mt-0.5">"Honest measurements, pure dyes, legendary threads."</p>
            </div>
          </div>
        </div>

        {/* Right Side: Information about location & trust values */}
        <div className="lg:col-span-7 text-left space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              Welcome to our Physical Outlet
            </h3>
            <p className="text-stone-600 leading-relaxed">
              For decades, <span className="text-emerald-900 font-semibold">Al Hamd Fabrics</span> has served thousands of families 
              around Lahore district. Located at the bustling junction of <span className="text-zinc-900 font-semibold">Manga Mandi on Raiwind Road</span>, 
              we specialize in premium unstitched attire.
            </p>
            <p className="text-stone-600 leading-relaxed">
              We focus on premium lawn weaves, digital print combinations with chiffon dupattas (2 PC and 3 PC), alongside top-tier gentlemen suiting fabrics. 
              Our fabrics are woven using state-of-the-art airjet looms, which keeps the yarn structure exceptionally resilient and soft.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-stone-200/60 shadow-sm flex gap-3">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm text-stone-900">Store Location</h4>
                <p className="text-xs text-stone-500 mt-1 leading-normal">
                  Manga Mandi at Raiwind Road,<br /> 
                  Lahore, Punjab, Pakistan
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200/60 shadow-sm flex gap-3">
              <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm text-stone-900">Direct WhatsApp Helpline</h4>
                <p className="text-xs text-stone-500 mt-1 leading-normal">
                  +92 305 3131133<br />
                  Call or chat directly anytime.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200/60 shadow-sm flex gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm text-stone-900">Physical Store Hours</h4>
                <p className="text-xs text-stone-500 mt-1 leading-normal">
                  Mon - Sat: 11:00 AM - 10:00 PM<br />
                  Sunday: Closed (Helpline open)
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200/60 shadow-sm flex gap-3">
              <Award className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm text-stone-900">100% Honest Guarantee</h4>
                <p className="text-xs text-stone-500 mt-1 leading-normal">
                  Precise yards and meters measurement.<br />
                  What you pay for is what you receive.
                </p>
              </div>
            </div>
          </div>

          {/* Slogan banner */}
          <div className="bg-emerald-950 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-serif font-bold text-lg text-amber-400">Want to buy wholesale or customized rolls?</p>
              <p className="text-xs text-stone-300">Get in touch directly with Zaffar Iqbal for bespoke price cuts.</p>
            </div>
            <a 
              href="https://wa.me/923053131133?text=Salam%20Zaffar%20Bhai%20I%20am%20interested%20in%20bulk%20buying%20fabrics."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all tracking-wider text-center"
            >
              WhatsApp Owner
            </a>
          </div>
        </div>
      </div>

      {/* Customer Feedback Form - Connected to Firestore */}
      <div className="border-t border-stone-200 pt-16 mt-16 max-w-3xl mx-auto text-left">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] uppercase tracking-widest text-[#A27C44] font-extrabold bg-[#FAF6F0] px-3.5 py-1 rounded-full border border-[#A27C44]/20 inline-block">Direct Inquiry Line</span>
          <h3 className="text-2xl font-serif font-black text-emerald-950">Have a Question or Special Request?</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">Let us know if you need customized stitches, matching separate cotton and wash-n-wear, or are arranging a wedding purchase.</p>
        </div>

        <form onSubmit={handleSubmitFeedback} className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-6">
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold animate-fadeIn">
              🎉 Alhamdullilah! Your inquiry has been securely submitted and stored permanently in our database. Zaffar Iqbal or our assistant will reach back to you shortly!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Your Name *</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Muhammad Tariq" 
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">WhatsApp / Mobile Number *</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g., 03051234567" 
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Email Address *</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g., example@gmail.com" 
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">How Can We Help You? *</label>
            <textarea 
              rows={4}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us about the fabric quantity, color choice, or custom measurements you require..." 
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A27C44] hover:bg-[#8F6A34] disabled:bg-stone-300 active:scale-95 text-white font-black hover:text-white rounded-xl shadow-md py-4 transition-all text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Storing Query to Secure Database...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Submit Query to Database</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
