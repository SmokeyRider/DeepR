import { useState } from 'react';
import { GitBranch, ArrowDown } from 'lucide-react';
import { QuestionInput } from './QuestionInput';
import { RoleCard } from './RoleCard';
import { FinalDecisionCard } from './FinalDecisionCard';
import { DxORoleSelector } from './DxORoleSelector';
import { SaveShareButtons } from './SaveShareButtons';

const defaultRoles = [
  { id: 'lead', name: 'Lead Researcher', model: 'gpt-4.1', focus: 'Primary analysis and synthesis', instructions: 'Conduct thorough research analysis, identify key findings and patterns.' },
  { id: 'reviewer', name: 'Critical Reviewer', model: 'grok-4-fast-reasoning', focus: 'Fast critical reasoning', instructions: 'Quickly identify methodological issues, gaps, and alternative perspectives.' },
  { id: 'expert', name: 'Domain Expert', model: 'o4-mini', focus: 'Specialized domain knowledge', instructions: 'Provide specialized expertise and context from the relevant field with efficient processing.' },
  { id: 'analyst', name: 'Data Analyst', model: 'gpt-4.1', focus: 'Quantitative analysis', instructions: 'Focus on data, statistics, and quantitative aspects of the problem.' },
  { id: 'strategist', name: 'Strategic Advisor', model: 'grok-4-fast-reasoning', focus: 'Strategic implications', instructions: 'Analyze strategic implications, long-term consequences, and implementation considerations.' },
];

export function DxOView() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState(defaultRoles);
  const [loadingPhase, setLoadingPhase] = useState(null);

  const phases = ['leadResearcher', 'criticalReviewer', 'domainExpert', 'dataAnalyst', 'finalDecision'];

  const handleSubmit = async (questionText) => {
    setQuestion(questionText);
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Use streaming endpoint for sequential reveal
      const response = await fetch('/api/dxo/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText, roles }),
      });

      if (!response.ok) {
        throw new Error('Failed to get DxO response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialResults = {};
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'complete') {
                setIsLoading(false);
                setLoadingPhase(null);
              } else if (data.type === 'error') {
                throw new Error(data.message);
              } else {
                partialResults = { ...partialResults, [data.type]: data.data };
                setResults({ ...partialResults });
                const currentIndex = phases.indexOf(data.type);
                setLoadingPhase(currentIndex < phases.length - 1 ? phases[currentIndex + 1] : null);
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', line, e);
            }
          }
        }
      }
      
      if (buffer.startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.slice(6));
          if (data.type === 'complete') {
            setIsLoading(false);
            setLoadingPhase(null);
          } else if (data.type !== 'error') {
            partialResults = { ...partialResults, [data.type]: data.data };
            setResults({ ...partialResults });
          }
        } catch (e) {
          // Ignore incomplete final buffer
        }
      }
    } catch (err) {
      // Fallback to non-streaming endpoint
      try {
        const response = await fetch('/api/dxo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: questionText, roles }),
        });

        if (!response.ok) {
          throw new Error('Failed to get DxO response');
        }

        const data = await response.json();
        setResults(data.data);
      } catch (fallbackErr) {
        setError(fallbackErr.message);
      }
      setIsLoading(false);
      setLoadingPhase(null);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setResults(null);
    setError(null);
    setLoadingPhase(null);
  };

  const getPhaseStatus = (phase) => {
    if (results?.[phase]) return 'complete';
    if (loadingPhase === phase || (isLoading && !results && phase === 'leadResearcher')) return 'loading';
    return 'pending';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Decision Orchestrator
        </h1>
        <p className="text-lg text-deepr-text-muted max-w-2xl mx-auto">
          Inspired by Microsoft's MAI-DxO research. Assign different AI models to 
          specialized roles for collaborative decision-making, research synthesis, 
          and problem-solving.
        </p>
      </div>

      {/* Question Input */}
      <QuestionInput 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onReset={handleReset}
        hasResults={!!results}
        mode="dxo"
      />

      {/* Role Selector (shown when no results) */}
      {!results && !isLoading && (
        <DxORoleSelector
          roles={roles}
          onRolesChange={setRoles}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="card border-deepr-error/50 bg-deepr-error/10">
          <p className="text-deepr-error">{error}</p>
        </div>
      )}

      {/* Results - Sequential Flow */}
      {(isLoading || results) && (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {['Lead', 'Reviewer', 'Expert', 'Analyst', 'Final'].map((label, index) => {
              const phase = phases[index];
              const status = getPhaseStatus(phase);
              
              return (
                <div key={phase} className="flex items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${status === 'complete' 
                      ? 'bg-deepr-success text-white' 
                      : status === 'loading'
                        ? 'bg-deepr-accent text-white animate-pulse'
                        : 'bg-deepr-border text-deepr-text-muted'
                    }
                  `}>
                    {status === 'complete' ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm ${
                    status === 'complete' ? 'text-deepr-success' :
                    status === 'loading' ? 'text-deepr-accent' :
                    'text-deepr-text-muted'
                  }`}>
                    {label}
                  </span>
                  {index < 4 && (
                    <ArrowDown className="w-4 h-4 text-deepr-border mx-2 rotate-[-90deg]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Role Cards */}
          <div className="space-y-4">
            {/* Lead Researcher */}
            <RoleCard
              role={results?.leadResearcher}
              stepNumber={1}
              isLoading={getPhaseStatus('leadResearcher') === 'loading'}
              delay={0}
            />

            {/* Critical Reviewer */}
            {(results?.leadResearcher || getPhaseStatus('criticalReviewer') === 'loading') && (
              <RoleCard
                role={results?.criticalReviewer}
                stepNumber={2}
                isLoading={getPhaseStatus('criticalReviewer') === 'loading'}
                delay={200}
              />
            )}

            {/* Domain Expert */}
            {(results?.criticalReviewer || getPhaseStatus('domainExpert') === 'loading') && (
              <RoleCard
                role={results?.domainExpert}
                stepNumber={3}
                isLoading={getPhaseStatus('domainExpert') === 'loading'}
                delay={400}
              />
            )}

            {/* Data Analyst */}
            {(results?.domainExpert || getPhaseStatus('dataAnalyst') === 'loading') && (
              <RoleCard
                role={results?.dataAnalyst}
                stepNumber={4}
                isLoading={getPhaseStatus('dataAnalyst') === 'loading'}
                delay={600}
              />
            )}

            {/* Final Decision */}
            {(results?.dataAnalyst || getPhaseStatus('finalDecision') === 'loading') && (
              <div className="mt-8">
                <FinalDecisionCard
                  decision={results?.finalDecision}
                  isLoading={getPhaseStatus('finalDecision') === 'loading'}
                />
                {results?.finalDecision && getPhaseStatus('finalDecision') === 'complete' && (
                  <div className="flex justify-end mt-4">
                    <SaveShareButtons
                      prompt={question}
                      mode="dxo"
                      config={{ roles }}
                      results={results}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Explanation (shown when no results) */}
      {!results && !isLoading && (
        <div className="mt-12">
          <div className="card bg-gradient-to-br from-deepr-card to-deepr-accent/5 border-deepr-accent/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-deepr-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-6 h-6 text-deepr-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-deepr-text mb-2">
                  How DxO Works
                </h3>
                <div className="text-deepr-text-muted space-y-2">
                  <p>
                    The Decision Orchestrator (DxO) framework assigns specialized roles to different AI models, 
                    creating a collaborative decision-making process:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li><strong className="text-deepr-text">Lead Researcher</strong> provides initial analysis and recommendations</li>
                    <li><strong className="text-deepr-text">Critical Reviewer</strong> identifies gaps, weaknesses, and alternatives</li>
                    <li><strong className="text-deepr-text">Domain Expert</strong> adds specialized knowledge and best practices</li>
                    <li><strong className="text-deepr-text">Data Analyst</strong> provides quantitative analysis and data-driven insights</li>
                    <li><strong className="text-deepr-text">Final Decision</strong> synthesizes all inputs into a revised recommendation</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
