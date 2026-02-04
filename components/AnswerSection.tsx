import React from 'react';

interface AnswerSectionProps {
  text: string;
}

export const AnswerSection: React.FC<AnswerSectionProps> = ({ text }) => {
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();

        // 1. Handle Headers (Website Names)
        if (trimmed.startsWith('###') || (trimmed.startsWith('**') && trimmed.length < 80 && !trimmed.includes(':'))) {
             return (
              <h3 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2">
                {trimmed.replace(/###/g, '').replace(/\*\*/g, '')}
              </h3>
             );
        }

        // 2. Handle Rating Lines (Highlighting the stars)
        if (trimmed.includes('Rating:') || trimmed.includes('Stars')) {
          return (
            <div key={i} className="flex items-center gap-2 mb-3 bg-yellow-50 text-yellow-800 px-3 py-2 rounded-lg w-fit">
               <span className="font-bold">Rating:</span>
               <span className="text-yellow-500 tracking-widest text-lg">
                 {trimmed.match(/[★☆]+/)?.[0] || '★★★★★★★★★★'}
               </span>
               <span className="text-sm font-semibold">
                 {trimmed.match(/\d+(\.\d+)?\/10/)?.[0]}
               </span>
            </div>
          );
        }

        // 3. Handle Lists
        if (para.includes('\n- ') || para.includes('\n* ')) {
             const items = para.split(/\n[-*] /);
             return (
                 <ul key={i} className="list-disc pl-5 space-y-2 mb-4 marker:text-primary-500">
                     {items.map((item, idx) => {
                         if (idx === 0 && !item.trim()) return null; 
                         return <li key={idx} dangerouslySetInnerHTML={{__html: parseBold(item)}} />;
                     })}
                 </ul>
             )
        }

        // 4. Standard Paragraph with Bold parsing
        return (
          <p key={i} className="mb-4" dangerouslySetInnerHTML={{ __html: parseBold(para) }} />
        );
      })}
    </div>
  );
};

// Helper to make **text** bold and style "Why it's better" or "What you will learn" keys
function parseBold(text: string) {
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>');
  
  // Add specific styling for our new keys if they exist in plain text
  parsed = parsed.replace(/(What you will learn here:)/g, '<span class="text-indigo-600 font-bold uppercase text-xs tracking-wide block mb-1">$1</span>');
  parsed = parsed.replace(/(Why it's better:)/g, '<span class="text-emerald-600 font-bold uppercase text-xs tracking-wide block mt-3 mb-1">$1</span>');
  
  return parsed;
}