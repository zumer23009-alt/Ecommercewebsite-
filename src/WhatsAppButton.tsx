import { useState } from 'react';
import { useStore } from './StoreContext';

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const { whatsapp, storeName } = useStore();

  const message = encodeURIComponent(`Bonjour ${storeName}! Je voudrais des informations sur vos produits.`);
  const href = `https://wa.me/${whatsapp}?text=${message}`;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 bg-white rounded-2xl shadow-2xl w-72 overflow-hidden border border-neutral-200">
          <div className="bg-green-600 text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">👟</div>
            <div>
              <div className="font-semibold text-sm">Service Client</div>
              <div className="text-xs opacity-90">En ligne • Répond en 5 min</div>
            </div>
          </div>
          <div className="p-4 bg-neutral-50">
            <div className="bg-white p-3 rounded-lg text-xs text-neutral-700 shadow-sm">
              Bonjour! 👋 Bienvenue chez {storeName}. Comment pouvons-nous vous aider aujourd'hui?
            </div>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-sm transition"
          >
            💬 Commander sur WhatsApp
          </a>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-xl transition flex items-center justify-center text-2xl w-14 h-14"
      >
        💬
      </button>
    </div>
  );
}
