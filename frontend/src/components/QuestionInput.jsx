import { useState } from 'react';
import { Send, Sparkles, RotateCcw } from 'lucide-react';

const quickPrompts = {
  council: [
    { label: 'Web Frameworks', prompt: 'What are the pros and cons of different web frameworks for building a scalable SaaS application?' },
    { label: 'API Security', prompt: 'What are the best practices for securing REST APIs in a microservices architecture?' },
    { label: 'Architecture', prompt: 'What are the pros and cons of different database architectures for a high-traffic e-commerce platform?' },
    { label: 'AI Strategy', prompt: 'How should a mid-size company approach implementing AI/ML capabilities?' },
  ],
  dxo: [
    { label: 'Tech Stack', prompt: 'Should our startup choose React or Vue.js for our web application frontend?' },
    { label: 'Cloud Migration', prompt: 'Should we migrate our legacy application to AWS, Azure, or Google Cloud?' },
    { label: 'Hiring Decision', prompt: 'Should we hire senior developers or train junior developers for our growing team?' },
    { label: 'Product Strategy', prompt: 'Should we focus on adding new features or improving existing functionality?' },
  ],
  adversarial: [
    { label: 'Remote Work', prompt: 'Should companies mandate a return to office or continue supporting remote work?' },
    { label: 'AI Regulation', prompt: 'Should governments implement strict regulations on AI development and deployment?' },
    { label: 'Open Source', prompt: 'Should companies open-source their core technology to gain competitive advantage?' },
    { label: 'Data Privacy', prompt: 'Should user data collection be completely transparent even if it reduces service quality?' },
  ]
};

export function QuestionInput({ onSubmit, isLoading, onReset, hasResults, mode = 'council' }) {
  const [question, setQuestion] = useState('');
  
  const currentPrompts = quickPrompts[mode] || quickPrompts.council;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  const handleQuickPrompt = (prompt) => {
    setQuestion(prompt);
  };

  const handleReset = () => {
    setQuestion('');
    onReset?.();
  };

  return (
    <div className="card card-hover">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-deepr-accent" />
        <h2 className="text-lg font-semibold">Research Prompt</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your research question or topic... e.g., 'What are the pros and cons of different database architectures for a high-traffic e-commerce platform?'"
          className="textarea-field min-h-[120px]"
          disabled={isLoading}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-deepr-text-muted">Quick prompts:</span>
          {currentPrompts.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleQuickPrompt(item.prompt)}
              className="btn-secondary text-sm px-3 py-1.5"
              disabled={isLoading}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="btn-primary flex-1 justify-center"
            disabled={!question.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Start Research
              </>
            )}
          </button>

          {hasResults && (
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4" />
              New Question
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
