'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

const whatsappBusinessNumber = "6285213963005";

interface BotMessage {
  text: string;
  quickReplies?: string[];
  isQuestion?: boolean;
  contextKey?: string;
}

interface OrderInProgress {
  item: string;
  quantity: number | null;
  notes: string;
  spiceLevel: string;
  deliveryMethod: string | null;
}

interface ConversationContext {
  lastQuestion: string | null;
  userPreferences: {
    favoriteFlavor: string | null;
    spiceLevel: string;
    lastOrder: any;
    phoneNumber: string | null;
  };
  orderInProgress: OrderInProgress | null;
  orderHistory: any[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; content: string | BotMessage }>>([
    {
      type: 'bot',
      content: {
        text: 'Halo! Saya Asisten Svarga Dimsum. Ada yang bisa saya bantu? 😊',
        quickReplies: ['Menu yang tersedia?', 'Harga dimsum?', 'Cara memesan?']
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<ConversationContext>({
    lastQuestion: null,
    userPreferences: { favoriteFlavor: null, spiceLevel: 'medium', lastOrder: null, phoneNumber: null },
    orderInProgress: null,
    orderHistory: []
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const updateUserPreferences = (message: string) => {
    const lower = message.toLowerCase();
    const prefs = contextRef.current.userPreferences;
    if (lower.includes('original')) prefs.favoriteFlavor = 'original';
    if (lower.includes('mentai')) prefs.favoriteFlavor = 'mentai';
    if (lower.includes('ayam') || lower.includes('chicken')) prefs.favoriteFlavor = 'ayam';
    if (lower.includes('ikan') || lower.includes('fish')) prefs.favoriteFlavor = 'ikan';
    if (lower.includes('pedas')) prefs.favoriteFlavor = 'pedas';
    const phoneMatch = message.match(/(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
    if (phoneMatch) prefs.phoneNumber = phoneMatch[0];
  };

  const calculatePrice = (item: string, quantity: number) => {
    const prices: Record<string, number> = { 'Original': 25000, 'Mentai': 30000, 'Ayam': 30000, 'Ikan': 30000, 'Pedas': 28000, 'Kombo': 100000 };
    return (prices[item] || 0) * quantity;
  };

  const handleOrderInitiation = (message: string): BotMessage => {
    let item = '';
    if (message.includes('original')) item = 'Original';
    if (message.includes('mentai')) item = 'Mentai';
    if (message.includes('ayam')) item = 'Ayam';
    if (message.includes('ikan')) item = 'Ikan';
    if (message.includes('pedas')) item = 'Pedas';
    if (message.includes('kombo')) item = 'Kombo';

    if (item) {
      contextRef.current.orderInProgress = {
        item, quantity: null, notes: '',
        spiceLevel: contextRef.current.userPreferences.spiceLevel,
        deliveryMethod: message.includes('antar') || message.includes('delivery') ? 'delivery' : message.includes('ambil') || message.includes('takeaway') ? 'takeaway' : null
      };
      return {
        text: `🍴 Oke, pesan <b>${item === 'Kombo' ? 'Paket Kombo' : 'Dimsum '+item}</b>.<br><br>Mau pesan berapa paket?`,
        quickReplies: ["1 paket", "2 paket", "3 paket"],
        isQuestion: true, contextKey: 'order_quantity'
      };
    }
    return {
      text: "Mau pesan yang mana?<br>- Original (Rp25.000)<br>- Mentai (Rp30.000)<br>- Ayam (Rp30.000)<br>- Ikan (Rp30.000)<br>- Pedas (Rp28.000)<br>- Paket Kombo (Rp100.000)",
      quickReplies: ["Original", "Mentai", "Ayam", "Kombo", "Rekomendasi"],
      isQuestion: true, contextKey: 'menu_selection'
    };
  };

  const confirmOrder = (): BotMessage => {
    const order = contextRef.current.orderInProgress!;
    const totalPrice = calculatePrice(order.item, order.quantity || 1);
    let text = `📝 <b>Konfirmasi:</b><br>- Menu: ${order.item}<br>- Jumlah: ${order.quantity} paket<br>- ${order.deliveryMethod === 'delivery' ? 'Diantar' : 'Ambil di tempat'}<br>`;
    text += `<br>- Total: Rp${totalPrice.toLocaleString('id-ID')}<br><br>Sudah benar?`;
    return { text, quickReplies: ["Ya, benar", "Ubah", "Batal"], isQuestion: true, contextKey: 'order_confirmation' };
  };

  const completeOrder = (): BotMessage => {
    const order = contextRef.current.orderInProgress!;
    const totalPrice = calculatePrice(order.item, order.quantity || 1);
    const orderId = 'SVG-' + Date.now().toString().slice(-6);
    const whatsappMessage = `Halo Svarga! Saya mau pesan:\n\n*Order ID:* ${orderId}\n*Menu:* ${order.item}\n*Jumlah:* ${order.quantity} paket\n*Total:* Rp${totalPrice.toLocaleString('id-ID')}`;
    const whatsappUrl = `https://wa.me/${whatsappBusinessNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    contextRef.current.orderInProgress = null;
    return {
      text: `🎉 <b>Berhasil!</b><br><br>ID: ${orderId}<br>Total: Rp${totalPrice.toLocaleString('id-ID')}<br><br><a href="${whatsappUrl}" target="_blank" style="display:inline-block;background-color:#25D366;color:white;padding:12px 20px;border-radius:30px;text-decoration:none;font-weight:800;">Lanjut ke WhatsApp</a>`,
      quickReplies: ["Menu lain", "Selesai"]
    };
  };

  const handleOrderFollowUp = (message: string): BotMessage | null => {
    const order = contextRef.current.orderInProgress;
    if (!order) return null;
    const lower = message.toLowerCase();

    if (lower.match(/batal|gak jadi|enggak|tidak/)) {
      contextRef.current.orderInProgress = null;
      return { text: "Oke, pesanan dibatalkan. Ada lagi yang bisa saya bantu?", quickReplies: ["Lihat menu", "Promo"] };
    }

    if (order.quantity === null) {
      const qty = parseInt(message.match(/\d+/)?.[0] || '1');
      order.quantity = Math.min(Math.max(qty, 1), 10);
      return { text: `Oke, ${order.quantity} paket.<br><br>Diantar atau ambil sendiri?`, quickReplies: ["Diantar", "Ambil Sendiri"], isQuestion: true, contextKey: 'delivery_method' };
    }

    if (!order.deliveryMethod && (lower.includes('antar') || lower.includes('delivery') || lower.includes('ambil') || lower.includes('sendiri'))) {
      order.deliveryMethod = lower.includes('antar') || lower.includes('delivery') ? 'delivery' : 'takeaway';
      return confirmOrder();
    }

    if (lower.match(/ya|yes|betul|benar|oke|ok/)) {
      return completeOrder();
    }

    return null;
  };

  const generateBotResponse = useCallback((userMessage: string): string | BotMessage => {
    const lower = userMessage.toLowerCase();
    const ctx = contextRef.current;

    if (ctx.orderInProgress) {
      const r = handleOrderFollowUp(userMessage);
      if (r) return r;
    }

    if (ctx.lastQuestion === 'menu_selection') {
      const r = handleOrderInitiation(lower);
      ctx.lastQuestion = null;
      return r;
    }

    if (lower.match(/dimana|lokasi|alamat|map/)) {
      return { text: "📍 <b>Lokasi Svarga Dimsum:</b><br>Jl. Raya Abdul Gani No.2 Blok B, Depok<br><br><a href='https://maps.google.com/?q=Svarga+Dimsum+Depok' target='_blank' style='color:#FF6B35'>Buka di Google Maps</a>", quickReplies: ["Menu", "Jam Buka"] };
    }

    if (lower.match(/menu|pilihan|ada apa/)) {
      return { text: "🍽️ <b>Menu Kami:</b><br>1. Original - Rp25k<br>2. Mentai - Rp30k<br>3. Ayam - Rp30k<br>4. Ikan - Rp30k<br>5. Pedas - Rp28k<br>6. Kombo - Rp100k", quickReplies: ["Original", "Mentai", "Kombo", "Rekomendasi"], isQuestion: true, contextKey: 'menu_selection' };
    }

    if (lower.match(/halo|hai|hi/)) {
      return "Halo! Mau pesan dimsum apa hari ini? 😊";
    }

    return { text: "Maaf saya belum mengerti. Mau lihat menu kami?", quickReplies: ["Lihat menu", "Lokasi", "Promo"] };
  }, []);

  const sendMessage = useCallback((msg?: string) => {
    const message = msg || input.trim();
    if (!message || isTyping) return;

    updateUserPreferences(message);
    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotResponse(message);
      if (typeof response === 'object' && response.isQuestion) {
        contextRef.current.lastQuestion = response.contextKey || null;
      }
      setMessages(prev => [...prev, { type: 'bot', content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  }, [input, isTyping, generateBotResponse]);

  return (
    <div className="chatbot-modern-wrap">
      <style>{`
        .chatbot-modern-wrap {
          position: fixed;
          bottom: 30px;
          left: 30px;
          z-index: 999;
        }
        .chatbot-toggle-btn {
          width: 60px;
          height: 60px;
          background: #FF6B35;
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chatbot-toggle-btn:hover {
          transform: scale(1.1) rotate(15deg);
        }
        .chatbot-popup-modern {
          position: absolute;
          bottom: 80px;
          left: 0;
          width: 380px;
          height: 550px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          transform-origin: bottom left;
          border: 1px solid rgba(255,255,255,0.5);
        }
        .chatbot-header-modern {
          padding: 1.5rem 2rem;
          background: #2B1717;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chatbot-header-modern h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }
        .chatbot-body-modern {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .msg-bot, .msg-user {
          max-width: 80%;
          padding: 12px 18px;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .msg-bot {
          background: #f0f0f0;
          color: #2B1717;
          border-radius: 20px 20px 20px 5px;
          align-self: flex-start;
        }
        .msg-user {
          background: #FF6B35;
          color: white;
          border-radius: 20px 20px 5px 20px;
          align-self: flex-end;
          font-weight: 500;
        }
        .quick-replies-modern {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .quick-replies-modern button {
          background: white;
          border: 1px solid #FF6B35;
          color: #FF6B35;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quick-replies-modern button:hover {
          background: #FF6B35;
          color: white;
        }
        .chatbot-footer-modern {
          padding: 1.2rem;
          background: white;
          display: flex;
          gap: 10px;
          border-top: 1px solid #eee;
        }
        .chatbot-footer-modern input {
          flex: 1;
          border: 1px solid #eee;
          padding: 10px 15px;
          border-radius: 25px;
          outline: none;
          font-size: 0.9rem;
        }
        .chatbot-send-btn {
          width: 40px;
          height: 40px;
          background: #2B1717;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }
        @media (max-width: 450px) {
          .chatbot-popup-modern { width: calc(100vw - 60px); height: 500px; }
        }
      `}</style>

      <button className="chatbot-toggle-btn" onClick={toggleChatbot}>
        <i className={isOpen ? 'fas fa-times' : 'fas fa-comment-dots'}></i>
      </button>

      {isOpen && (
        <div className="chatbot-popup-modern">
          <div className="chatbot-header-modern">
            <h3>Svarga Assistant</h3>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Online</span>
          </div>
          
          <div className="chatbot-body-modern">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.type === 'bot' ? 'msg-bot' : 'msg-user'}>
                {typeof msg.content === 'string' ? (
                  msg.content
                ) : (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: msg.content.text }} />
                    {msg.content.quickReplies && (
                      <div className="quick-replies-modern">
                        {msg.content.quickReplies.map((qr, qidx) => (
                          <button key={qidx} onClick={() => sendMessage(qr)}>{qr}</button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="msg-bot" style={{ padding: '10px 15px' }}>
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
                <span className="typing-dot">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-footer-modern">
            <input 
              type="text" 
              placeholder="Tanya sesuatu..." 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="chatbot-send-btn" onClick={() => sendMessage()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
