import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Edit3 } from 'lucide-react';

export default function VinaAIChatbox() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Xin chào! Em là Vina-AI. Em có thể giúp gì cho anh/chị?', sender: 'ai', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        text: 'Đây là câu trả lời mẫu từ Vina-AI. Trong ứng dụng thực tế, đây sẽ là phản hồi từ mô hình AI của bạn.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-4 py-3 shadow-lg flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-16 h-16 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
        
        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors z-10">
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <svg viewBox="0 0 100 100" className="w-5 h-5">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="3"/>
              <circle cx="50" cy="50" r="8" fill="currentColor"/>
            </svg>
          </div>
          <span className="font-semibold text-lg">Vina-AI</span>
        </div>
        
        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors z-10">
          <Edit3 size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md flex items-center gap-3">
              <div className="w-8 h-8 animate-spin">
                <svg viewBox="0 0 100 100" className="w-full h-full text-orange-600">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                  <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                  <circle cx="50" cy="50" r="8" fill="currentColor"/>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1="50"
                      x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                      y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      opacity={0.4 + (i * 0.075)}
                    />
                  ))}
                </svg>
              </div>
              <span className="text-sm text-gray-600">Đang suy luận...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 relative">
        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-orange-600">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="50" cy="50" r="8" fill="currentColor"/>
          </svg>
        </div>
        
        <div className="flex items-end gap-2 max-w-4xl mx-auto relative z-10">
          <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors mb-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="flex-1 resize-none border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent max-h-32 bg-gray-50"
            rows={1}
            style={{
              minHeight: '44px',
              maxHeight: '128px',
              height: 'auto'
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
          
          <button
            onClick={handleSend}
            disabled={input.trim() === '' || isThinking}
            className={`p-3 rounded-full transition-all mb-1 ${
              input.trim() === '' || isThinking
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-2 relative z-10">
          Vina-AI phiên bản 2.5 Pro
        </p>
      </div>
    </div>
  );
}
