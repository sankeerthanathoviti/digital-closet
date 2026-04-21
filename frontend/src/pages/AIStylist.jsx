import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageSquarePlus, MessageSquare, Trash2, User as UserIcon, Upload, X } from 'lucide-react';
import axios from 'axios';

export default function AIStylist() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "I'd love to help you pull together the perfect look! Tell me about the occasion, the weather, or just ask a styling question.",
      suggestedItems: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wardrobe, setWardrobe] = useState([]);
  
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    fetchWardrobe();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      fetchChatHistory(activeSessionId);
    } else {
      setMessages([
        {
          role: 'ai',
          text: "I'd love to help you pull together the perfect look! Tell me about the occasion, the weather, or just ask a styling question.",
          suggestedItems: []
        }
      ]);
    }
  }, [activeSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get('http://localhost:5000/ai/chat/sessions', config);
      setSessions(res.data);
      if (res.data.length > 0 && !activeSessionId) {
        setActiveSessionId(res.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChatHistory = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`http://localhost:5000/ai/chat/${sessionId}`, config);
      if (res.data && res.data.length > 0) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWardrobe = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get('http://localhost:5000/wardrobe', config);
      setWardrobe(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const deleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`http://localhost:5000/ai/chat/sessions/${sessionId}`, config);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const reqBody = activeSessionId ? { message: userMsg, sessionId: activeSessionId } : { message: userMsg };
      
      const res = await axios.post('http://localhost:5000/ai/chat', reqBody, config);
      
      if (!activeSessionId && res.data.sessionId) {
         setActiveSessionId(res.data.sessionId);
         fetchSessions();
      }

      setMessages(prev => [...prev, {
        role: 'ai',
        text: res.data.textResponse || res.data,
        suggestedItems: res.data.suggestedItemIds || []
      }]);
    } catch (error) {
       console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I had trouble thinking of an outfit. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestedItems = (itemIds) => {
    if (!itemIds || itemIds.length === 0) return null;
    
    const items = itemIds.map(id => wardrobe.find(w => w._id === id)).filter(Boolean);
    if (items.length === 0) return null;

    return (
      <div className="mt-6">
        <div className="flex gap-4 overflow-x-auto pb-2 w-full stylish-scrollbar">
          {items.map(item => (
            <div key={item._id} className="min-w-[120px] bg-beige/50 rounded-xl shadow-sm border border-sage/20 overflow-hidden flex flex-col">
               <img src={item.imageBase64} className="w-full aspect-square object-cover" />
               <div className="p-2 text-center text-xs font-medium text-charcoal">
                 {item.category}
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden w-full h-[calc(100vh-64px)] bg-beige/20">
      
      {/* Sidebar for Sessions */}
      <div className="w-64 bg-white border-r border-sage/10 hidden md:flex flex-col shadow-sm z-10">
         <div className="p-4 border-b border-sage/10">
           <button 
             onClick={() => setActiveSessionId(null)} 
             className="w-full flex items-center gap-2 px-4 py-3 bg-sage text-white rounded-xl hover:bg-sage/90 transition-colors font-medium shadow-sm shadow-sage/20"
           >
             <MessageSquarePlus size={18} />
             New Chat
           </button>
         </div>
         <div className="flex-1 overflow-y-auto p-3 space-y-1 stylish-scrollbar">
           {sessions.map(session => (
             <div key={session._id} className="relative group">
               <button 
                 onClick={() => setActiveSessionId(session._id)}
                 className={`w-full text-left px-3 py-3 pr-10 rounded-lg text-sm truncate flex items-center gap-3 transition-colors ${activeSessionId === session._id ? 'bg-sage/10 text-sage font-medium' : 'hover:bg-sage/5 text-charcoal/80'}`}
               >
                 <MessageSquare size={16} className={activeSessionId === session._id ? "text-sage shrink-0" : "text-charcoal/40 shrink-0"} />
                 <span className="truncate">{session.title}</span>
               </button>
               <button
                 onClick={(e) => deleteSession(e, session._id)}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-500/0 group-hover:text-red-400 hover:!text-red-600 transition-colors bg-white rounded-md shadow-sm opacity-0 group-hover:opacity-100"
                 title="Delete Chat"
               >
                 <Trash2 size={16} />
               </button>
             </div>
           ))}
           {sessions.length === 0 && (
             <div className="text-center p-4 text-sm text-charcoal/40 mt-4">
                No past chat history
             </div>
           )}
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full max-w-4xl mx-auto px-4 lg:px-8 py-6">
        {!activeSessionId && messages.length <= 1 && (
          <div className="text-center mb-8 mt-4 shrink-0">
            <div className="w-16 h-16 bg-sage text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sage/20">
                <Sparkles size={28} />
            </div>
            <h1 className="text-3xl font-serif mb-2">AI Stylist</h1>
            <p className="text-charcoal/60 text-sm">Your personal fashion advisor. Ask about outfits, colors, or style tips!</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto mb-6 space-y-6 px-2 stylish-scrollbar pb-4 pr-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex flex-col max-w-[85%] lg:max-w-[75%]">
                  <div className={`p-4 md:p-5 rounded-2xl text-[15px] md:text-base leading-relaxed ${msg.role === 'user' ? 'bg-sage text-white rounded-br-sm shadow-sm' : 'bg-white text-charcoal border border-sage/10 shadow-sm rounded-bl-sm'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  {msg.role === 'ai' && renderSuggestedItems(msg.suggestedItems)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="p-4 rounded-2xl bg-white text-charcoal/50 border border-sage/10 shadow-sm rounded-bl-sm flex items-center gap-3 italic text-sm">
                  <Sparkles size={16} className="animate-pulse text-sage" /> Thinking about your wardrobe...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1 text-transparent">-</div>
        </div>

        <div className="relative mt-auto shrink-0 bg-transparent pt-2">
          <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask your stylist anything..."
              className="w-full p-4 pl-6 pr-16 rounded-full bg-white border border-sage/20 shadow-md focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-4 bottom-2 aspect-square h-[calc(100%-16px)] bg-sage/20 text-sage flex items-center justify-center rounded-full hover:bg-sage hover:text-white disabled:opacity-50 disabled:hover:bg-sage/20 disabled:hover:text-sage transition-all duration-200"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
