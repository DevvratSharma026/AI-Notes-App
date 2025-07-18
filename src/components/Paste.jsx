import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPastes, deletePaste } from '../redux/pasteSlice';
import { toast } from 'react-hot-toast';
import { FiEdit, FiTrash2, FiCopy, FiShare2, FiSearch, FiChevronDown, FiZap, FiMessageCircle, FiSend } from 'react-icons/fi';

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes) || [];
  const loading = useSelector((state) => state.paste.loading);
  const error = useSelector((state) => state.paste.error);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  // State for AI summary dropdowns
  const [openSummaryId, setOpenSummaryId] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaries, setSummaries] = useState({}); // { [noteId]: summary }

  // State for AI chat
  const [openChatId, setOpenChatId] = useState(null);
  const [chatHistories, setChatHistories] = useState({}); // { [noteId]: [{role, content}] }
  const [chatInput, setChatInput] = useState({}); // { [noteId]: string }
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPastes());
  }, [dispatch]);

  const filteredPastes = pastes.filter((paste) => {
    return paste.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (pasteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deletePaste(pasteId));
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const handleShare = (paste) => {
    if (navigator.share) {
      navigator.share({
        title: paste.title,
        text: paste.description,
        url: window.location.href
      }).catch(() => toast.error('Share cancelled'));
    } else {
      toast.error('Web Share API not supported');
    }
  };

  // AI Summarization
  const handleSummarize = async (paste) => {
    if (openSummaryId === paste._id) {
      setOpenSummaryId(null);
      return;
    }
    setOpenSummaryId(paste._id);
    if (summaries[paste._id]) return; // Already summarized
    setSummaryLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: paste.description })
      });
      const data = await res.json();
      if (data.success) {
        setSummaries((prev) => ({ ...prev, [paste._id]: data.summary }));
      } else {
        toast.error(data.message || 'Summarization failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSummaryLoading(false);
    }
  };

  // AI Chat
  const handleAskAI = (paste) => {
    if (openChatId === paste._id) {
      setOpenChatId(null);
      return;
    }
    setOpenChatId(paste._id);
    if (!chatHistories[paste._id]) {
      setChatHistories((prev) => ({ ...prev, [paste._id]: [] }));
    }
  };

  const handleChatInputChange = (noteId, value) => {
    setChatInput((prev) => ({ ...prev, [noteId]: value }));
  };

  const handleSendChat = async (paste) => {
    const noteId = paste._id;
    const question = (chatInput[noteId] || '').trim();
    if (!question) return;
    setChatLoading(true);
    const history = chatHistories[noteId] || [];
    setChatHistories((prev) => ({
      ...prev,
      [noteId]: [...history, { role: 'user', content: question }]
    }));
    setChatInput((prev) => ({ ...prev, [noteId]: '' }));
    try {
      const res = await fetch('http://localhost:4000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: paste.description,
          question,
          history: history
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatHistories((prev) => ({
          ...prev,
          [noteId]: [...(prev[noteId] || []), { role: 'assistant', content: data.answer }]
        }));
      } else {
        toast.error(data.message || 'AI chat failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Your Notes</h1>

      {loading && <div className="text-gray-400 text-center py-4">Loading notes...</div>}
      {error && <div className="text-red-400 text-center py-4">{error}</div>}

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          className="w-full pl-10 p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="search"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPastes.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          {searchTerm ? 'No matching notes found' : 'No notes available'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPastes.map((paste) => (
            <div key={paste._id} className="glass-panel bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg transition-all duration-300">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-100 break-all">{paste.title}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {new Date(paste.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-gray-900 rounded p-3 mb-3 max-h-40 overflow-y-auto">
                  <pre className="text-left text-gray-300 text-sm font-mono whitespace-pre-wrap break-all">
                    {paste.description.length > 200 
                      ? `${paste.description.substring(0, 200)}...` 
                      : paste.description}
                  </pre>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <a
                    href={`/?pasteId=${paste._id}`}
                    className="flex items-center px-3 py-1 border border-gray-600 rounded text-gray-300 text-sm transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  >
                    <FiEdit className="mr-1" /> Edit
                  </a>
                  <a
                    href={`/pastes/${paste._id}`}
                    className="flex items-center px-3 py-1 border border-gray-600 rounded text-gray-300 text-sm transition-all duration-200 hover:bg-gray-700 hover:text-white hover:border-gray-700"
                  >
                    View Full
                  </a>
                  <button
                    onClick={() => handleDelete(paste._id)}
                    className="flex items-center px-3 py-1 border border-gray-600 rounded text-gray-300 text-sm transition-all duration-200 hover:bg-red-600 hover:text-white hover:border-red-600"
                  >
                    <FiTrash2 className="mr-1" /> Delete
                  </button>
                  <button
                    onClick={() => handleCopy(paste.description)}
                    className="flex items-center px-3 py-1 border border-gray-600 rounded text-gray-300 text-sm transition-all duration-200 hover:bg-gray-700 hover:text-white hover:border-gray-700"
                  >
                    <FiCopy className="mr-1" /> Copy
                  </button>
                  <button
                    onClick={() => handleShare(paste)}
                    className="flex items-center px-3 py-1 border border-gray-600 rounded text-gray-300 text-sm transition-all duration-200 hover:bg-gray-700 hover:text-white hover:border-gray-700"
                  >
                    <FiShare2 className="mr-1" /> Share
                  </button>
                  <button
                    onClick={() => handleSummarize(paste)}
                    className={`flex items-center px-3 py-1 border border-gray-600 rounded text-gray-300 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-blue-500 ${openSummaryId === paste._id ? 'ring-2 ring-cyan-400' : ''}`}
                  >
                    <FiZap className="mr-1" /> Summarize
                    <FiChevronDown className={`ml-1 transition-transform ${openSummaryId === paste._id ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleAskAI(paste)}
                    className={`flex items-center px-3 py-1 border border-gray-600 rounded text-gray-300 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white hover:border-cyan-500 ${openChatId === paste._id ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    <FiMessageCircle className="mr-1" /> Ask AI
                    <FiChevronDown className={`ml-1 transition-transform ${openChatId === paste._id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {/* AI Summary Dropdown */}
                {openSummaryId === paste._id && (
                  <div className="glass-panel bg-gray-900/80 border border-cyan-400/30 rounded-lg p-4 mt-2 animate-fade-in">
                    {summaryLoading && !summaries[paste._id] ? (
                      <div className="text-cyan-300 flex items-center gap-2"><FiZap className="animate-pulse" /> Summarizing...</div>
                    ) : summaries[paste._id] ? (
                      <div>
                        <div className="text-cyan-300 font-semibold mb-1">AI Summary:</div>
                        <div className="text-gray-100 text-base leading-relaxed">{summaries[paste._id]}</div>
                      </div>
                    ) : null}
                  </div>
                )}
                {/* AI Chat Dropdown */}
                {openChatId === paste._id && (
                  <div className="glass-panel bg-gray-900/80 border border-blue-400/30 rounded-lg p-4 mt-2 animate-fade-in">
                    <div className="text-blue-300 font-semibold mb-2 flex items-center gap-2"><FiMessageCircle /> AI Chat</div>
                    <div className="max-h-56 overflow-y-auto space-y-3 mb-3 pr-1">
                      <div className="text-xs text-gray-400 mb-2">Note context: <span className="text-gray-300">{paste.description.slice(0, 120)}{paste.description.length > 120 ? '...' : ''}</span></div>
                      {(chatHistories[paste._id] || []).map((msg, idx) => (
                        <div key={idx} className={`rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-blue-800/40 text-blue-100 self-end ml-auto' : 'bg-gray-800/60 text-gray-100 self-start mr-auto'}`}>{msg.content}</div>
                      ))}
                      {chatLoading && <div className="text-blue-300 flex items-center gap-2"><FiSend className="animate-pulse" /> AI is typing...</div>}
                    </div>
                    <form className="flex gap-2 mt-2" onSubmit={e => { e.preventDefault(); handleSendChat(paste); }}>
                      <input
                        className="flex-1 text-base p-3 rounded-lg"
                        type="text"
                        placeholder="Ask anything about this note..."
                        value={chatInput[paste._id] || ''}
                        onChange={e => handleChatInputChange(paste._id, e.target.value)}
                        disabled={chatLoading}
                        autoFocus={openChatId === paste._id}
                      />
                      <button
                        type="submit"
                        className="border-1 rounded-lg px-5 py-2 text-base font-semibold flex items-center gap-1"
                        disabled={chatLoading || !(chatInput[paste._id] || '').trim()}
                      >
                        <FiSend />
                        Send
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Paste;