import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPaste, updatePaste, fetchPasteById } from '../redux/pasteSlice';
import { FiSave, FiEdit, FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get('pasteId');
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes) || [];
  const loading = useSelector((state) => state.paste.loading);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (pasteId) {
      let paste = allPastes.find((paste) => paste._id === pasteId);
      if (!paste) {
        setEditLoading(true);
        dispatch(fetchPasteById(pasteId))
          .unwrap()
          .then((data) => {
            setTitle(data.title || '');
            setValue(data.description || '');
            setEditLoading(false);
          })
          .catch(() => {
            setTitle('');
            setValue('');
            setEditLoading(false);
          });
      } else {
        setTitle(paste.title || '');
        setValue(paste.description || '');
      }
    } else {
      setTitle('');
      setValue('');
    }
  }, [pasteId, allPastes, dispatch]);

  function handleSubmit() {
    if (!title.trim() || !value.trim()) return;
    if (pasteId) {
      dispatch(updatePaste({ id: pasteId, noteData: { title, description: value } }))
        .unwrap()
        .then(() => {
          setTitle('');
          setValue('');
          setSearchParams({});
        });
    } else {
      dispatch(createPaste({ title, description: value }))
        .unwrap()
        .then(() => {
          setTitle('');
          setValue('');
          setSearchParams({});
          toast.success('Note created successfully!');
        });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-8">
        {pasteId ? 'Edit Note' : 'Create New Note'}
      </h1>

      <div className="mb-8 group">
        <label className="block text-sm font-medium text-gray-400 mb-2 transition-all duration-300 group-focus-within:text-blue-400">
          Note Title
        </label>
        <input
          className="w-full p-4 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 hover:border-gray-600 placeholder-gray-500 shadow-lg backdrop-blur-sm disabled:opacity-60 disabled:cursor-not-allowed"
          type="text"
          placeholder="Enter a captivating title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={editLoading}
        />
      </div>

      <div className="mb-8 group">
        <label className="block text-sm font-medium text-gray-400 mb-2 transition-all duration-300 group-focus-within:text-blue-400">
          Note Content
        </label>
        <textarea
          className="w-full p-4 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 hover:border-gray-600 placeholder-gray-500 shadow-lg backdrop-blur-sm disabled:opacity-60 disabled:cursor-not-allowed min-h-[300px]"
          value={value}
          placeholder="Pour your thoughts here... Markdown supported ✨"
          onChange={(e) => setValue(e.target.value)}
          rows={15}
          disabled={editLoading}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className={`flex items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 shadow-lg ${
            pasteId 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
          } disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl active:scale-95`}
          disabled={loading || editLoading}
        >
          {pasteId ? (
            <>
              <FiEdit className="mr-2 animate-pulse" /> 
              {editLoading ? (
                <span className="flex items-center">
                  Updating... <FiLoader className="ml-2 animate-spin" />
                </span>
              ) : (
                'Update Note'
              )}
            </>
          ) : (
            <>
              <FiSave className="mr-2" />
              {loading ? (
                <span className="flex items-center">
                  Creating... <FiLoader className="ml-2 animate-spin" />
                </span>
              ) : (
                'Create Note'
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Home;