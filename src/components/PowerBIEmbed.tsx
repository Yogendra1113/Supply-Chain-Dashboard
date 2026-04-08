import React from 'react';

interface PowerBIEmbedProps {
  embedUrl: string;
  title?: string;
}

export const PowerBIEmbed: React.FC<PowerBIEmbedProps> = ({ embedUrl, title = "SupplyChain Pro Live Dashboard" }) => {
  if (!embedUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Power BI Embed Ready</h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          To see your live Power BI report here, paste your "Publish to Web" or "Embed" URL into the configuration.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-left w-full max-w-lg">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">How to get your URL:</p>
          <ol className="text-xs text-slate-600 space-y-2 list-decimal ml-4">
            <li>Open your report in <b>Power BI Service</b> (Browser).</li>
            <li>Go to <b>File &gt; Embed report &gt; Website or portal</b>.</li>
            <li>Copy the URL from the first box (starts with <i>https://app.powerbi.com/...</i>).</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-160px)] glass-card overflow-hidden animate-in fade-in zoom-in duration-500">
      <iframe
        title={title}
        className="w-full h-full border-none"
        src={embedUrl}
        allowFullScreen={true}
      />
    </div>
  );
};
