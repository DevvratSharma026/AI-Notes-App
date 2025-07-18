import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPasteById } from '../redux/pasteSlice';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { FiCopy, FiShare2, FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ViewPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes) || [];
  const pasteFromRedux = allPastes.find((paste) => paste._id === id);
  const [paste, setPaste] = useState(pasteFromRedux || null);
  const [loading, setLoading] = useState(!pasteFromRedux);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!pasteFromRedux) {
      setLoading(true);
      dispatch(fetchPasteById(id))
        .unwrap()
        .then((data) => {
          setPaste(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Note not found');
          setLoading(false);
        });
    } else {
      setPaste(pasteFromRedux);
      setLoading(false);
    }
  }, [id, dispatch, pasteFromRedux]);

  const handleCopy = () => {
    if (paste && paste.description) {
      navigator.clipboard.writeText(paste.description);
      toast.success('Copied to clipboard!');
    }
  };

  const handleShare = () => {
    if (navigator.share && paste) {
      navigator.share({
        title: paste.title,
        text: paste.description,
        url: window.location.href
      }).catch(() => toast.error('Share cancelled'));
    } else {
      toast.error('Web Share API not supported');
    }
  };

  if (loading) return <div className="p-4 text-gray-400">Loading...</div>;
  if (error || !paste) return <div className="p-4 text-red-400">{error || 'Note not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8 group">
        <a 
          href="/pastes" 
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 mr-6"
        >
          <FiChevronLeft className="mr-2 transition-transform group-hover:-translate-x-1" size={20} />
          <span className="font-medium">Back to Notes</span>
        </a>
        <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent flex-1"></div>
      </div>
  
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          {paste.title || "Untitled Note"}
        </h1>
        <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
          {new Date(paste.createdAt).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
  
      <div className="glass-panel-xl border border-gray-700/50 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm transition-all hover:border-gray-600/50 hover:shadow-2xl hover:shadow-blue-900/10">
        <div className="p-6">
          <div className="flex justify-end gap-3 mb-6">
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 bg-gray-700/80 hover:bg-gray-600/90 rounded-lg text-gray-200 text-sm font-medium transition-all hover:shadow-md hover:scale-[1.02] active:scale-95 group"
            >
              <FiCopy className="mr-2 group-hover:rotate-[-4deg] transition-transform" size={16} />
              Copy Content
            </button>
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-blue-600/90 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-all hover:shadow-md hover:scale-[1.02] active:scale-95 group"
            >
              <FiShare2 className="mr-2 group-hover:rotate-[10deg] transition-transform" size={16} />
              Share Note
            </button>
          </div>
  
          <div className="bg-gray-900/50 rounded-lg p-6 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <pre className="text-left text-gray-100 font-mono text-base leading-relaxed whitespace-pre-wrap break-words">
              {paste.description}
            </pre>
          </div>
        </div>
      </div>
  
      {/* Floating action buttons for mobile */}
      <div className="fixed bottom-6 right-6 flex gap-3 md:hidden">
        <button
          onClick={handleCopy}
          className="p-3 bg-gray-700/90 hover:bg-gray-600/90 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
        >
          <FiCopy className="text-gray-200" size={20} />
        </button>
        <button
          onClick={handleShare}
          className="p-3 bg-blue-600/90 hover:bg-blue-700 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
        >
          <FiShare2 className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default ViewPage;