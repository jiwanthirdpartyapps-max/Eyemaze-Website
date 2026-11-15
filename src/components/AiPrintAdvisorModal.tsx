import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import type { PrintCategory } from '../utils/printPricing';

interface AiPrintAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory: PrintCategory;
}

export const AiPrintAdvisorModal: React.FC<AiPrintAdvisorModalProps> = ({
  isOpen,
  onClose,
  defaultCategory,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    setError('');
    try {
      const res = await fetch('/api/gemini/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          projectType: defaultCategory,
        }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setResponse(data.text);
      } else {
        setError(data.error || 'Could not generate pre-press advice. Please try again.');
      }
    } catch {
      setError('Network error reaching the Eyemaze Print Advisor service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-advisor-title"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl brand-gradient text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="ai-advisor-title" className="font-display font-bold text-slate-900">
                    Eyemaze Pre-Press Advisor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Get exact paper GSM, CMYK bleed & lamination guidance
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close Pre-Press Advisor"
                onClick={onClose}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="advisor-prompt-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2"
                  >
                    Describe Your Print Job
                  </label>
                  <textarea
                    id="advisor-prompt-input"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. 1,000 rigid cosmetic boxes with coral printing and matte lamination..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white brand-gradient hover:opacity-95 disabled:opacity-50 transition-opacity cursor-pointer"
                >
                  {loading ? 'Analyzing Pre-Press Specs...' : 'Get Print Specifications'}
                </button>
              </form>

              {error && (
                <p role="alert" className="text-xs text-rose-600 font-medium">
                  {error}
                </p>
              )}

              {response && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Recommended Print Specs
                  </p>
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {response}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
