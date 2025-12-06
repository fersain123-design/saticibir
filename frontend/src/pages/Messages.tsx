import React, { useState } from 'react';

interface Message {
  id: string;
  customerName: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  reply?: string;
}

const Messages: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');

  // Mock data
  const messages: Message[] = [
    {
      id: '1',
      customerName: 'Ayşe D.',
      subject: 'Ürün hakkında soru',
      message: 'Merhaba, domatesleriniz organik mi? Kökünü bilmek istiyorum.',
      date: '2024-12-06 10:30',
      read: false,
    },
    {
      id: '2',
      customerName: 'Can Y.',
      subject: 'Kargo süresi',
      message: 'Siparişimin kargo süresi ne kadar?',
      date: '2024-12-05 15:20',
      read: true,
      reply: 'Merhaba, siparişiniz yarın kargoya verilecektir.',
    },
    {
      id: '3',
      customerName: 'Elif K.',
      subject: 'Toplu alım indirimi',
      message: '10 kg salatalık alacam, indirim yapabilir misiniz?',
      date: '2024-12-04 09:15',
      read: true,
      reply: 'Merhaba, %10 indirim uygulayabiliriz. İyi günler!',
    },
  ];

  const unreadCount = messages.filter(m => !m.read).length;

  const handleSendReply = () => {
    alert(`Mesaj gönderildi: ${replyText}`);
    setSelectedMessage(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Mesajlar</h1>
          <p className="text-text-secondary mt-1">Müşterilerinizle iletişim kurun</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-4 py-2 bg-error text-white rounded-full font-semibold">
            {unreadCount} Okunmamış
          </span>
        )}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-md divide-y">
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => setSelectedMessage(message)}
            className={`p-6 cursor-pointer hover:bg-background transition-all ${
              !message.read ? 'bg-primary/5' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{message.customerName.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-text-primary">{message.customerName}</span>
                      {!message.read && (
                        <span className="w-2 h-2 bg-error rounded-full"></span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-text-primary">{message.subject}</div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">{message.message}</p>
              </div>
              <div className="text-xs text-text-secondary ml-4">
                {new Date(message.date).toLocaleString('tr-TR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-text-primary">{selectedMessage.subject}</h3>
                <p className="text-sm text-text-secondary mt-1">
                  {selectedMessage.customerName} - {new Date(selectedMessage.date).toLocaleString('tr-TR')}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-text-secondary hover:text-text-primary text-2xl"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="p-6 space-y-4">
              {/* Customer Message */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">{selectedMessage.customerName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="bg-background rounded-2xl rounded-tl-none p-4">
                    <p className="text-text-primary">{selectedMessage.message}</p>
                  </div>
                  <span className="text-xs text-text-secondary mt-1 block">
                    {new Date(selectedMessage.date).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* Your Reply */}
              {selectedMessage.reply && (
                <div className="flex items-start space-x-3 justify-end">
                  <div className="flex-1 text-right">
                    <div className="bg-primary text-white rounded-2xl rounded-tr-none p-4 inline-block text-left">
                      <p>{selectedMessage.reply}</p>
                    </div>
                    <span className="text-xs text-text-secondary mt-1 block">Siz - Yanıtlandı</span>
                  </div>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">S</span>
                  </div>
                </div>
              )}
            </div>

            {/* Reply Input */}
            <div className="p-6 border-t">
              <label className="block text-sm font-medium text-text-primary mb-2">Yanıt Yaz</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Müşteriye mesajınızı yazın..."
                className="w-full px-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSendReply}
                  disabled={!replyText}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Mesaj Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
