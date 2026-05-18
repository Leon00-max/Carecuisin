export default function PendingReview() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-surface-50">
      <div className="bg-white border-4 border-surface-900 rounded-[40px] max-w-lg w-full text-center space-y-8 p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)]">
        
        {/* ICON */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-surface-900 flex items-center justify-center transform -rotate-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black tracking-[0.3em] uppercase mb-4 border-2 border-primary-100">
            Status: Pending
          </div>
          <h1 className="text-3xl font-black text-surface-900 uppercase tracking-tighter italic">
            Account Under Review
          </h1>
          <p className="text-surface-500 mt-4 font-bold text-sm leading-relaxed">
            Thank you for completing your professional profile. Our admin team is now verifying your credentials and documents.
          </p>
        </div>

        {/* INFO BOX */}
        <div className="bg-surface-50 border-2 border-surface-100 rounded-3xl p-6 text-left">
          <strong className="text-[11px] font-black uppercase tracking-widest text-surface-900 block mb-3">
            What happens next?
          </strong>
          <ul className="text-xs font-bold text-surface-500 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary-500">→</span> You will receive a notification upon approval.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500">→</span> Standard review takes 24–48 hours.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500">→</span> We will contact you directly if further verification is required.
            </li>
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-4 justify-center pt-4">
          <a 
            href="mailto:support@carecuisin.cm" 
            className="bg-primary-600 border-4 border-primary-600 text-white font-black py-4 rounded-[20px] hover:bg-primary-700 transition-all text-xs uppercase tracking-widest"
          >
            Contact Support
          </a>
        </div>
        
      </div>
    </main>
  );
}
