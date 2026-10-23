import React from 'react';

// ഒരു റിസ്യൂം ഇൻലൈൻ ആയി കാണിക്കാൻ ഉപയോഗിക്കുന്ന റീയൂസബിൾ കോംപോണന്റ്.
// resumeUrl null ആയാലും crash ആകാതെ handle ചെയ്യുന്നു.
const ResumePreview = ({ resumeUrl, title = 'Resume', compact = false }) => {
  // ബാക്കെൻഡിൽ നിന്നും വരുന്ന relative url-ന് ബേസ് url ചേർക്കുന്നു
  const normalizeUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://rainbow-hr.onrender.com${url}`;
  };

  const url = normalizeUrl(resumeUrl);

  // റിസ്യൂം അപ്‌ലോഡ് ചെയ്തിട്ടില്ലെങ്കിൽ കാണിക്കുന്ന empty state
  if (!url) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center py-10 px-6 text-center">
        <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-6 4h4m1 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p className="text-sm font-bold text-slate-500">No resume uploaded yet.</p>
      </div>
    );
  }

  const isPdf = url.split('?')[0].toLowerCase().endsWith('.pdf');

  return (
    <div className="w-full">
      {isPdf ? (
        // PDF ആണെങ്കിൽ iframe വഴി ഇൻലൈൻ പ്രിവ്യൂ
        <iframe
          src={url}
          title={title}
          className={`w-full ${compact ? 'h-[260px]' : 'h-[520px]'} rounded-2xl border border-slate-200 bg-white`}
        />
      ) : (
        // PDF അല്ലാത്ത ഫയലുകൾക്ക് (doc/docx) ഒരു placeholder കാർഡ്
        <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center py-10 px-6 text-center">
          <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="text-sm font-bold text-slate-500">Inline preview is not supported for this file type.</p>
          <p className="text-xs font-medium text-slate-400 mt-1">Use the links below to open or download the file.</p>
        </div>
      )}

      {/* എപ്പോഴും കാണിക്കുന്ന Open / Download ലിങ്കുകൾ */}
      <div className="flex flex-wrap items-center gap-4 mt-3">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-emerald-600 font-black text-xs hover:underline"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-7h5m0 0v5m0-5L11 13"></path>
          </svg>
          Open in new tab
        </a>
        <a
          href={url}
          download
          className="inline-flex items-center gap-1.5 text-slate-600 font-black text-xs hover:underline"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download
        </a>
      </div>
    </div>
  );
};

export default ResumePreview;
