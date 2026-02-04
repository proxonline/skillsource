import React from 'react';
import { GroundingChunk } from '../types';

interface SourceCardProps {
  chunk: GroundingChunk;
  index: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ chunk, index }) => {
  if (!chunk.web?.uri || !chunk.web?.title) return null;

  const { uri, title } = chunk.web;
  
  // Extract domain for cleaner display
  let domain = '';
  try {
    domain = new URL(uri).hostname.replace('www.', '');
  } catch (e) {
    domain = uri;
  }

  return (
    <a 
      href={uri} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200 group h-full"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-medium text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">
          {index + 1}
        </div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{domain}</span>
      </div>
      <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-1 group-hover:text-primary-700 transition-colors">
        {title}
      </h3>
      <div className="mt-auto pt-2 flex items-center text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Visit Website &rarr;
      </div>
    </a>
  );
};
