import React, { useState, useCallback } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
        <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
          <input
            type="text"
            className="w-full px-6 py-4 text-lg text-slate-800 placeholder-slate-400 focus:outline-none"
            placeholder="I want to learn how to..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-6 py-4 font-semibold transition-all duration-200 flex items-center gap-2 ${
              isLoading || !input.trim()
                ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                : 'text-primary-600 hover:bg-primary-50 active:bg-primary-100'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            )}
            <span className="hidden sm:inline">Find</span>
          </button>
        </div>
      </form>
    </div>
  );
};
