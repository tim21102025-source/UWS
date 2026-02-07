/**
 * Live Chat Component
 * 
 * Interactive online chat with quick reply suggestions
 */

import React, { useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[];
}

export interface ChatQuickReply {
  id: string;
  label: string;
  response: string;
  icon?: string;
}

export interface LiveChatProps {
  isOpen?: boolean;
  onClose?: () => void;
  position?: 'bottom-right' | 'bottom-left';
  title?: string;
  subtitle?: string;
  quickReplies?: ChatQuickReply[];
  welcomeMessage?: string;
  onSendMessage?: (message: string) => void;
}

const DEFAULT_QUICK_REPLIES: ChatQuickReply[] = [
  { id: 'q1', label: 'Рассчитать стоимость', response: 'Хочу рассчитать стоимость окон', icon: '💰' },
  { id: 'q2', label: 'Вызвать замерщика', response: 'Нужна услуга замера', icon: '📏' },
  { id: 'q3', label: 'Сроки установки', response: 'Какие сроки установки?', icon: '⏱️' },
  { id: 'q4', label: 'Гарантия', response: 'Какая гарантия на окна?', icon: '🛡️' },
  { id: 'q5', label: 'Контакты', response: 'Хочу узнать контакты', icon: '📞' },
];

const DEFAULT_WELCOME_MESSAGE = 'Добрый день! 👋 Я — виртуальный помощник компании UWS. Помогу подобрать окна, рассчитать стоимость или ответить на вопросы. Чем могу помочь?';

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    text: DEFAULT_WELCOME_MESSAGE,
    sender: 'bot',
    timestamp: new Date(),
    quickReplies: ['Рассчитать стоимость', 'Вызвать замерщика', 'Сроки установки', 'Гарантия'],
  },
];

export const LiveChat: React.FC<LiveChatProps> = ({
  isOpen: initialIsOpen = false,
  onClose,
  position = 'bottom-right',
  title = 'UWS Консультант',
  subtitle = 'Онлайн',
  quickReplies = DEFAULT_QUICK_REPLIES,
  welcomeMessage = DEFAULT_WELCOME_MESSAGE,
  onSendMessage,
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen && onClose) onClose();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    onSendMessage?.(inputValue);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: botResponse.quickReplies || undefined,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    handleSend();
  };

  const getBotResponse = (message: string): { text: string; quickReplies?: string[] } => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('стоимость') || lowerMessage.includes('цена') || lowerMessage.includes('рассчитать')) {
      return {
        text: 'Для расчёта стоимости нам нужно знать:\n• Размеры окон\n• Тип профиля (REHAU, KBE, VEKA)\n• Количество створок\n\nХотите вызвать замерщика для точного расчёта?',
        quickReplies: ['Вызвать замерщика', 'Самостоятельный расчёт', 'Цены на профили'],
      };
    }

    if (lowerMessage.includes('замер') || lowerMessage.includes('вызвать')) {
      return {
        text: 'Замерщик приедет в удобное для вас время, сделает точные замеры и рассчитает стоимость. Выезд бесплатно при заказе!',
        quickReplies: ['Записаться на замер', 'Сколько стоит', 'Какие окна выбрать'],
      };
    }

    if (lowerMessage.includes('срок') || lowerMessage.includes('установк')) {
      return {
        text: 'Сроки зависят от сложности:\n• Стандартные окна — 3-5 дней\n• Нестандартные — 7-10 дней\n• Балконы — 5-7 дней\n\nМонтаж 1 окна занимает 2-3 часа.',
        quickReplies: ['Заказать', 'Каталог окон', 'Виды профилей'],
      };
    }

    if (lowerMessage.includes('гарант')) {
      return {
        text: 'Наша гарантия:\n• Профиль — 10 лет\n• Стеклопакет — 5 лет\n• Фурнитура — 5 лет\n• Монтаж — 3 года\n\nТакже предлагаем сервисное обслуживание.',
        quickReplies: ['Заказать окна', 'Выбрать профиль', 'Контакты'],
      };
    }

    if (lowerMessage.includes('контакт') || lowerMessage.includes('адрес') || lowerMessage.includes('телефон')) {
      return {
        text: '📍 г. Киев, ул. Примерная, 15\n📞 +380 (44) 123-45-67\n📱 +380 (99) 123-45-67\n✉️ info@uws.com.ua\n\nЖдём вас в шоуруме!',
        quickReplies: ['График работы', 'Как проехать', 'Заказать звонок'],
      };
    }

    return {
      text: 'Спасибо за вопрос! Наш менеджер перезвонит вам в течение 15 минут для подробной консультации.',
      quickReplies: ['Заказать звонок', 'Перейти к каталогу', 'Выбрать окна'],
    };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen ? 'bg-dark-500' : 'bg-primary-500 hover:bg-primary-600'
        }`}
        aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат'}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all ${
            position === 'bottom-right' ? 'right-6' : 'left-6'
          }`}
        >
          {/* Header */}
          <div className="bg-primary-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">{title}</p>
                <p className="text-primary-100 text-xs">{subtitle}</p>
              </div>
            </div>
            <button onClick={toggleChat} className="p-2 text-white/80 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-white text-dark-900 shadow-sm rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-200' : 'text-dark-400'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                  
                  {/* Quick Replies */}
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className={`text-xs px-3 py-2 rounded-full transition-colors ${
                            message.sender === 'user'
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                          }`}
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Bar */}
          {quickReplies.length > 0 && (
            <div className="border-t border-dark-100 p-3 bg-white">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {quickReplies.slice(0, 4).map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply.response)}
                    className="flex-shrink-0 px-3 py-2 bg-dark-100 hover:bg-primary-100 text-dark-600 hover:text-primary-700 text-xs rounded-full transition-colors flex items-center gap-1"
                  >
                    <span>{reply.icon}</span>
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-dark-100 p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Введите сообщение..."
                className="flex-1 px-4 py-2 bg-dark-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  inputValue.trim()
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-dark-200 text-dark-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;
