import { useState, useEffect } from 'react';
import { Swords, ArrowDown, Loader2 } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SaveShareButtons } from './SaveShareButtons';

const defaultRoles = [
  { 
    id: 'advocate', 
    name: 'Advocate', 
    model: 'gpt-5.1', 
    focus: 'Strong initial opinion',
    instructions: 'Provide your strongest, clearest opinion. Take a firm stance. Do not hedge. Present your reasoning in a structured way.'
  },
  { 
    id: 'challenger', 
    name: 'Challenger', 
    model: 'gpt-5.1', 
    focus: 'Critique and attack reasoning',
    instructions: 'Critique the Advocate\'s argument. Identify logical flaws, missing evidence, weak assumptions, and alternative interpretations. Be adversarial, rigorous, and unsparing.'
  },
  { 
    id: 'arbiter', 
    name: 'Arbiter', 
    model: 'gpt-5.1', 
    focus: 'Evaluate and synthesize',
    instructions: 'Evaluate both the Advocate\'s argument and the Challenger\'s critique. Identify which points hold up and synthesize the strongest possible final position.'
  },
];

const turnLimitOptions = [
  { value: 'smart', label: 'Smart', description: 'AI determines when conclusion is refined enough (max 5 turns)' },
  { value: '1', label: '1 Turn', description: 'Single debate cycle' },
  { value: '2', label: '2 Turns', description: 'Two debate cycles for deeper refinement' },
  { value: '3', label: '3 Turns', description: 'Three debate cycles for thorough analysis' },
];

function AdversarialRoleSelector({ roles, onRolesChange }) {
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        setAvailableModels(data.availableModels || []);
        
        if (data.availableModels?.length && roles) {
          const defaultModel = data.availableModels[0]?.id || 'gpt-5.1';
          const updatedRoles = roles.map((role) => {
            const modelExists = data.availableModels.some(m => m.id === role.model);
            if (!modelExists) {
              return { ...role, model: defaultModel };
            }
            return role;
          });
          onRolesChange?.(updatedRoles);
        }
      } catch (err) {
        console.error('Failed to fetch config:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const updateRole = (index, field, value) => {
    const newRoles = [...roles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    onRolesChange?.(newRoles);
  };

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-deepr-accent animate-spin" />
        <span className="ml-2 text-deepr-text-muted">Loading available models...</span>
      </div>
    );
  }

  const roleIcons = {
    advocate: '⚔️',
    challenger: '🛡️',
    arbiter: '⚖️'
  };

  const roleColors = {
    advocate: '#10B981',
    challenger: '#EF4444',
    arbiter: '#F59E0B'
  };

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-deepr-text">Debate Roles</h3>
        <p className="text-sm text-deepr-text-muted">
          Configure the AI models and instructions for each debate role.
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((role, index) => (
          <div 
            key={role.id}
            className="p-4 bg-deepr-bg rounded-lg border border-deepr-border"
            style={{ borderLeftColor: roleColors[role.id], borderLeftWidth: '4px' }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
              <div className="flex items-center gap-2 md:w-32 flex-shrink-0">
                <span className="text-2xl">{roleIcons[role.id]}</span>
                <span className="font-semibold text-deepr-text">{role.name}</span>
              </div>

              <div className="flex-1 min-w-0">
                <label className="block text-sm text-deepr-text-muted mb-1">Model</label>
                <select
                  value={role.model}
                  onChange={(e) => updateRole(index, 'model', e.target.value)}
                  className="input-field w-full"
                >
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-0">
                <label className="block text-sm text-deepr-text-muted mb-1">Focus</label>
                <input
                  type="text"
                  value={role.focus}
                  onChange={(e) => updateRole(index, 'focus', e.target.value)}
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm text-deepr-text-muted mb-1">
                Role Instructions
              </label>
              <textarea
                value={role.instructions}
                onChange={(e) => updateRole(index, 'instructions', e.target.value)}
                className="textarea-field h-20"
                placeholder="Define specific instructions for this role..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CycleCard({ cycle, cycleNumber, isExpanded, onToggle, isLastCycle }) {
  const roleData = [
    { key: 'advocate', name: 'Advocate', icon: '⚔️', color: '#10B981' },
    { key: 'challenger', name: 'Challenger', icon: '🛡️', color: '#EF4444' },
    ...(isLastCycle ? [] : [{ key: 'arbiter', name: 'Arbiter', icon: '⚖️', color: '#F59E0B' }]),
  ];

  return (
    <div className="card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-deepr-accent/20 rounded-full flex items-center justify-center">
            <span className="font-bold text-deepr-accent">{cycleNumber}</span>
          </div>
          <span className="font-semibold text-deepr-text">Debate Cycle {cycleNumber}</span>
          {cycle.converged && (
            <span className="px-2 py-1 bg-deepr-success/20 text-deepr-success text-xs rounded-full">
              Converged
            </span>
          )}
        </div>
        <ArrowDown className={`w-5 h-5 text-deepr-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {roleData.map(({ key, name, icon, color }) => (
            <div 
              key={key}
              className="p-4 bg-deepr-bg rounded-lg border-l-4"
              style={{ borderLeftColor: color }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{icon}</span>
                <span className="font-semibold text-deepr-text">{name}</span>
              </div>
              <div className="prose-custom">
                <MarkdownRenderer content={cycle[`${key}_output`] || ''} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingCycle({ currentRole }) {
  const roles = ['advocate', 'challenger', 'arbiter'];
  const roleNames = { advocate: 'Advocate', challenger: 'Challenger', arbiter: 'Arbiter' };
  const roleIcons = { advocate: '⚔️', challenger: '🛡️', arbiter: '⚖️' };
  
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="w-5 h-5 text-deepr-accent animate-spin" />
        <span className="font-semibold text-deepr-text">Debate in progress...</span>
      </div>
      <div className="flex items-center gap-4">
        {roles.map((role, index) => {
          const isActive = role === currentRole;
          const isComplete = roles.indexOf(currentRole) > index;
          return (
            <div key={role} className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isComplete ? 'bg-deepr-success text-white' : 
                  isActive ? 'bg-deepr-accent text-white animate-pulse' : 
                  'bg-deepr-border text-deepr-text-muted'}
              `}>
                {isComplete ? '✓' : roleIcons[role]}
              </div>
              <span className={`text-sm ${isActive ? 'text-deepr-accent' : 'text-deepr-text-muted'}`}>
                {roleNames[role]}
              </span>
              {index < 2 && <ArrowDown className="w-4 h-4 text-deepr-border rotate-[-90deg] mx-2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdversarialView() {
  const [question, setQuestion] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState(defaultRoles);
  const [turnLimit, setTurnLimit] = useState('smart');
  const [expandedCycles, setExpandedCycles] = useState({});
  const [currentRole, setCurrentRole] = useState(null);
  const [currentCycle, setCurrentCycle] = useState(0);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setQuestion(inputValue);
    setIsLoading(true);
    setError(null);
    setResults(null);
    setExpandedCycles({});
    setCurrentCycle(1);
    setCurrentRole('advocate');

    try {
      const response = await fetch('/api/adversarial/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: inputValue, 
          roles,
          turnLimit: turnLimit === 'smart' ? 'smart' : Number(turnLimit)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get Adversarial response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let cycles = [];
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
              
              if (data.type === 'cycle_start') {
                setCurrentCycle(data.cycle);
                setCurrentRole('advocate');
              } else if (data.type === 'role_complete') {
                if (data.role === 'advocate') {
                  setCurrentRole('challenger');
                } else if (data.role === 'challenger') {
                  setCurrentRole('arbiter');
                }
              } else if (data.type === 'cycle_complete') {
                cycles = [...cycles, data.data];
                setResults({ cycles, final_output: null, summary: null });
                setExpandedCycles(prev => ({ ...prev, [data.cycle]: data.cycle === cycles.length }));
              } else if (data.type === 'complete') {
                setResults({ 
                  cycles, 
                  final_output: data.final_output,
                  summary: data.summary,
                  stop_reason: data.stop_reason
                });
                setIsLoading(false);
                setCurrentRole(null);
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
            } catch (e) {
              if (e.message !== 'Failed to get Adversarial response') {
                console.warn('Failed to parse SSE data:', line, e);
              } else {
                throw e;
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setCurrentRole(null);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setInputValue('');
    setResults(null);
    setError(null);
    setExpandedCycles({});
    setCurrentCycle(0);
    setCurrentRole(null);
  };

  const toggleCycle = (cycleNum) => {
    setExpandedCycles(prev => ({ ...prev, [cycleNum]: !prev[cycleNum] }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Adversarial Debate
        </h1>
        <p className="text-lg text-deepr-text-muted max-w-2xl mx-auto">
          A single model argues, critiques itself, and judges the debate to produce a refined, high-confidence conclusion.
        </p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Swords className="w-5 h-5 text-deepr-accent" />
          <h3 className="text-lg font-semibold text-deepr-text">Debate Topic</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a topic or question for adversarial debate..."
            className="textarea-field h-32 mb-4"
            disabled={isLoading}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
            <div className="w-full sm:w-auto">
              <label className="block text-sm text-deepr-text-muted mb-2">Turn Limit</label>
              <select
                value={turnLimit}
                onChange={(e) => setTurnLimit(e.target.value)}
                className="input-field w-full sm:w-48"
                disabled={isLoading}
              >
                {turnLimitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-deepr-text-muted mt-1">
                {turnLimitOptions.find(o => o.value === turnLimit)?.description}
              </p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {results && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary flex-1 sm:flex-none"
                >
                  New Debate
                </button>
              )}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Debating...
                  </>
                ) : (
                  <>
                    <Swords className="w-4 h-4" />
                    Start Debate
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {!results && !isLoading && (
        <AdversarialRoleSelector
          roles={roles}
          onRolesChange={setRoles}
        />
      )}

      {error && (
        <div className="card border-deepr-error/50 bg-deepr-error/10">
          <p className="text-deepr-error">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          <div className="text-center text-deepr-text-muted">
            Cycle {currentCycle} of {turnLimit === 'smart' ? '5 max' : turnLimit}
          </div>
          <LoadingCycle currentRole={currentRole} />
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <div className="card bg-deepr-accent/10 border-deepr-accent/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📊</span>
              <span className="font-semibold text-deepr-text">Debate Summary</span>
            </div>
            <p className="text-deepr-text-muted">
              {results.summary || `Completed ${results.cycles?.length || 0} debate cycle${results.cycles?.length !== 1 ? 's' : ''}.`}
              {results.stop_reason && (
                <span className="block mt-2 text-sm italic">
                  {results.stop_reason}
                </span>
              )}
            </p>
          </div>

          {results.cycles?.map((cycle, index) => (
            <CycleCard
              key={index}
              cycle={cycle}
              cycleNumber={index + 1}
              isExpanded={expandedCycles[index + 1]}
              onToggle={() => toggleCycle(index + 1)}
              isLastCycle={index === results.cycles.length - 1 && !!results.final_output}
            />
          ))}

          {results.final_output && (
            <div className="card bg-gradient-to-br from-deepr-card to-deepr-warning/10 border-deepr-warning/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚖️</span>
                  <span className="text-xl font-bold text-deepr-text">Final Verdict</span>
                </div>
                <SaveShareButtons
                  prompt={question}
                  mode="adversarial"
                  config={{ roles, turnLimit }}
                  results={results}
                />
              </div>
              <div className="prose-custom">
                <MarkdownRenderer content={results.final_output} />
              </div>
            </div>
          )}
        </div>
      )}

      {!results && !isLoading && (
        <div className="mt-12">
          <div className="card bg-gradient-to-br from-deepr-card to-deepr-accent/5 border-deepr-accent/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-deepr-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Swords className="w-6 h-6 text-deepr-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-deepr-text mb-2">
                  How Adversarial Debate Works
                </h3>
                <div className="text-deepr-text-muted space-y-2">
                  <p>
                    The Adversarial Debate framework uses three roles in a cyclical debate pattern:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li><strong className="text-deepr-text">Advocate</strong> takes a strong position and argues for it</li>
                    <li><strong className="text-deepr-text">Challenger</strong> attacks the argument, finding flaws and weaknesses</li>
                    <li><strong className="text-deepr-text">Arbiter</strong> evaluates both sides and synthesizes the best conclusion</li>
                  </ol>
                  <p className="mt-2">
                    In Smart mode, the Arbiter decides whether another cycle would improve the conclusion, 
                    automatically stopping when the argument has been sufficiently refined.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
