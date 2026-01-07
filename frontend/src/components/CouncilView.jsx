import { useState } from 'react';
import { Users, ArrowRight, Info } from 'lucide-react';
import { QuestionInput } from './QuestionInput';
import { CouncilMemberCard } from './CouncilMemberCard';
import { ChairmanCard } from './ChairmanCard';
import { CouncilMemberSelector } from './CouncilMemberSelector';

const howItWorks = [
  { step: 1, title: 'Ask Your Question', description: 'Enter your research question or topic for the council to deliberate' },
  { step: 2, title: 'Council Deliberates', description: 'Multiple AI models independently analyze and provide their perspectives' },
  { step: 3, title: 'Chairman Synthesizes', description: 'A chairman model combines all inputs into a final, balanced recommendation' },
];

export function CouncilView() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [chairmanModel, setChairmanModel] = useState('');
  const [loadingStates, setLoadingStates] = useState({
    members: false,
    chairman: false,
  });

  const handleSubmit = async (questionText) => {
    setQuestion(questionText);
    setIsLoading(true);
    setError(null);
    setResults(null);
    setLoadingStates({ members: true, chairman: false });

    try {
      const response = await fetch('/api/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: questionText,
          selectedMembers,
          chairmanModel 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get council response');
      }

      const data = await response.json();
      
      // Simulate progressive loading for better UX
      setLoadingStates({ members: false, chairman: true });
      
      setTimeout(() => {
        setResults(data.data);
        setLoadingStates({ members: false, chairman: false });
        setIsLoading(false);
      }, 500);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setLoadingStates({ members: false, chairman: false });
    }
  };

  const handleReset = () => {
    setQuestion('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          AI LLM Council
        </h1>
        <p className="text-lg text-deepr-text-muted max-w-2xl mx-auto">
          Send your prompt to multiple AI models simultaneously. Watch them deliberate, 
          critique each other, and synthesize the best response through a Chairman model.
        </p>
      </div>

      {/* Question Input */}
      <QuestionInput 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onReset={handleReset}
        hasResults={!!results}
      />

      {/* Member Selector (shown when no results) */}
      {!results && !isLoading && (
        <CouncilMemberSelector
          selectedMembers={selectedMembers}
          onSelectionChange={setSelectedMembers}
          chairmanModel={chairmanModel}
          onChairmanChange={setChairmanModel}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="card border-deepr-error/50 bg-deepr-error/10">
          <p className="text-deepr-error">{error}</p>
        </div>
      )}

      {/* Results */}
      {(isLoading || results) && (
        <div className="space-y-8">
          {/* Round Indicator */}
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              loadingStates.members || results?.members 
                ? 'bg-deepr-success/20 text-deepr-success' 
                : 'bg-deepr-border text-deepr-text-muted'
            }`}>
              <span className="font-medium">Round 1:</span>
              <span>Individual Answers</span>
              {!loadingStates.members && results?.members && (
                <span className="text-xs">✓</span>
              )}
            </div>
            <ArrowRight className="w-5 h-5 text-deepr-text-muted" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              results?.chairman 
                ? 'bg-deepr-success/20 text-deepr-success' 
                : loadingStates.chairman
                  ? 'bg-deepr-accent/20 text-deepr-accent'
                  : 'bg-deepr-border text-deepr-text-muted'
            }`}>
              <span className="font-medium">Round 2:</span>
              <span>Chairman's Synthesis</span>
              {results?.chairman && <span className="text-xs">✓</span>}
            </div>
          </div>

          {/* Council Members Grid */}
          <div>
            <h2 className="text-xl font-semibold text-deepr-text mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-deepr-accent" />
              Council Members
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {(results?.members || selectedMembers.map(id => ({ id }))).map((member, index) => (
                <CouncilMemberCard
                  key={member.id || index}
                  member={results?.members?.[index]}
                  isLoading={loadingStates.members}
                  delay={index * 200}
                />
              ))}
            </div>
          </div>

          {/* Chairman Section */}
          <div>
            <ChairmanCard
              chairman={results?.chairman}
              isLoading={loadingStates.chairman || (loadingStates.members && !results?.chairman)}
            />
          </div>
        </div>
      )}

      {/* How It Works (shown when no results) */}
      {!results && !isLoading && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-deepr-text mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-deepr-accent to-deepr-info flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-deepr-text mb-2">{item.title}</h3>
                <p className="text-sm text-deepr-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
