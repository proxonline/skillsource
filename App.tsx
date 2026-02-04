import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchBox } from './components/SearchBox';
import { SourceCard } from './components/SourceCard';
import { AnswerSection } from './components/AnswerSection';
import { findBestLearningResources } from './services/geminiService';
import { SearchResult, SearchState } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<SearchState>(SearchState.IDLE);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setStatus(SearchState.LOADING);
    setCurrentQuery(query);
    setError(null);
    setResult(null);

    try {
      const data = await findBestLearningResources(query);
      setResult(data);
      setStatus(SearchState.SUCCESS);
    } catch (e: any) {
      console.error(e);
      setError("We couldn't find resources for that right now. Please try again.");
      setStatus(SearchState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 py-12 w-full max-w-7xl mx-auto">
        
        {/* Hero / Search Section */}
        <div className={`w-full transition-all duration-500 ease-in-out ${status === SearchState.IDLE ? 'mt-24 sm:mt-32' : 'mt-0'}`}>
          <div className={`text-center mb-8 ${status !== SearchState.IDLE ? 'hidden' : 'block'}`}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">learn</span> today?
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From bathing dogs to coding python, we find the absolute best tutorials and websites for you.
            </p>
          </div>

          <SearchBox onSearch={handleSearch} isLoading={status === SearchState.LOADING} />
          
           {/* Suggestions for IDLE state */}
           {status === SearchState.IDLE && (
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in-up">
              {['Bathing a German Shepherd', 'Learning React', 'Fixing a leaky faucet', 'Origami basics'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-colors shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {status === SearchState.LOADING && (
          <div className="mt-16 w-full max-w-3xl text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 animate-pulse">Scouring the web for the best resources...</p>
          </div>
        )}

        {/* Error State */}
        {status === SearchState.ERROR && (
          <div className="mt-12 w-full max-w-2xl bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Results State */}
        {status === SearchState.SUCCESS && result && (
          <div className="w-full mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Left Col: The Detailed Guide */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </span>
                  Guide: {currentQuery}
                </h2>
                <AnswerSection text={result.text} />
              </div>
            </div>

            {/* Right Col: The Best Sources List */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-1">
                <div className="p-4 pb-2">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    Top Sources
                  </h3>
                </div>
                
                {result.sources.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 p-2">
                     {result.sources.map((chunk, idx) => (
                       <SourceCard key={idx} chunk={chunk} index={idx} />
                     ))}
                   </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No direct links found, but check the guide for names.
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">About SkillSource</h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Our AI ranks resources based on depth, clarity, and authority. We find the perfect match for your specific learning goal.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-sm border-t border-slate-200 mt-auto bg-white flex flex-col items-center gap-2">
        <div className="text-slate-500 font-medium">
          Made by <span className="text-slate-800 font-semibold">Pbfa Innovations and technology</span>
        </div>
        <a 
          href="https://uthmanoyalowo.website3.me" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 transition-colors bg-primary-50 px-3 py-1 rounded-full text-xs font-semibold"
        >
          Check uthmanoyalowo.website3.me
        </a>
      </footer>
    </div>
  );
};

export default App;