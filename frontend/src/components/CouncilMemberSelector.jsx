import { useState, useEffect } from 'react';
import { CheckSquare, Loader2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const defaultSelectedMembers = ['gpt-4.1', 'o4-mini'];
const defaultChairman = 'gpt-4.1'; // Using a reliable model as default chairman

export function CouncilMemberSelector({ selectedMembers, onSelectionChange, chairmanModel, onChairmanChange }) {
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProviders, setExpandedProviders] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        setAvailableModels(data.availableModels || []);
        
        const providers = [...new Set((data.availableModels || []).map(m => m.providerKey || m.provider))];
        setExpandedProviders(providers.reduce((acc, p) => ({ ...acc, [p]: true }), {}));
        
        if (data.availableModels?.length && selectedMembers.length === 0) {
          onSelectionChange(defaultSelectedMembers.filter(id => 
            data.availableModels.some(m => m.id === id)
          ));
        }
        if (data.availableModels?.length && !chairmanModel) {
          const defaultChairExists = data.availableModels.some(m => m.id === defaultChairman);
          onChairmanChange(defaultChairExists ? defaultChairman : data.availableModels[0]?.id);
        }
      } catch (err) {
        console.error('Failed to fetch config:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const toggleMember = (modelId) => {
    if (selectedMembers.includes(modelId)) {
      onSelectionChange(selectedMembers.filter(id => id !== modelId));
    } else {
      onSelectionChange([...selectedMembers, modelId]);
    }
  };

  const toggleProvider = (providerKey) => {
    setExpandedProviders(prev => ({ ...prev, [providerKey]: !prev[providerKey] }));
  };

  const groupedModels = availableModels.reduce((acc, model) => {
    const key = model.providerKey || model.provider;
    if (!acc[key]) acc[key] = [];
    acc[key].push(model);
    return acc;
  }, {});

  const providerLabels = {
    openai: { name: 'Azure OpenAI', icon: '🤖', color: '#10B981' },
    xai: { name: 'xAI via Azure', icon: '⚡', color: '#06B6D4' },
    anthropic: { name: 'Anthropic', icon: '🧠', color: '#EA580C' },
    gemini: { name: 'Google Gemini', icon: '✨', color: '#4285F4' },
    openrouter: { name: 'OpenRouter (300+ Models)', icon: '🌐', color: '#7C3AED' },
  };

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-deepr-accent animate-spin" />
        <span className="ml-2 text-deepr-text-muted">Loading available models...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-deepr-text">Council Members</h3>
          <span className="text-sm text-deepr-text-muted">
            {selectedMembers.length} selected | Select 2+ models for best results
          </span>
        </div>
        
        <div className="space-y-4">
          {Object.entries(groupedModels).map(([providerKey, models]) => {
            const provider = providerLabels[providerKey] || { name: providerKey, icon: '🔮', color: '#6B7280' };
            const isExpanded = expandedProviders[providerKey];
            const selectedCount = models.filter(m => selectedMembers.includes(m.id)).length;
            
            return (
              <div key={providerKey} className="border border-deepr-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleProvider(providerKey)}
                  className="w-full flex items-center justify-between p-3 bg-deepr-card hover:bg-deepr-hover transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{provider.icon}</span>
                    <span className="font-medium text-deepr-text">{provider.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-deepr-border text-deepr-text-muted">
                      {models.length} models
                    </span>
                    {selectedCount > 0 && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: provider.color }}
                      >
                        {selectedCount} selected
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-deepr-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-deepr-text-muted" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="p-3 bg-deepr-bg/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {models.map((model) => {
                      const isSelected = selectedMembers.includes(model.id);
                      const color = model.color || '#6B7280';
                      const isSlow = model.slow === true;
                      const isDeployed = model.deployed !== false; // Default to deployed if not specified
                      
                      return (
                        <button
                          key={model.id}
                          onClick={() => isDeployed && toggleMember(model.id)}
                          disabled={!isDeployed}
                          className={`
                            relative p-3 rounded-lg border text-left transition-all duration-200
                            ${!isDeployed 
                              ? 'opacity-50 cursor-not-allowed border-deepr-border bg-deepr-card/50'
                              : isSelected 
                                ? 'border-2 bg-opacity-10' 
                                : 'border-deepr-border bg-deepr-card hover:border-deepr-border/80 hover:bg-deepr-hover'
                            }
                          `}
                          style={{ 
                            borderColor: isSelected ? color : undefined,
                            backgroundColor: isSelected ? `${color}15` : undefined
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <div 
                              className={`
                                w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5
                                ${isSelected ? '' : 'border border-deepr-border'}
                              `}
                              style={{ backgroundColor: isSelected ? color : undefined }}
                            >
                              {isSelected && <CheckSquare className="w-3 h-3 text-white" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-deepr-text text-sm truncate">{model.name}</span>
                                {isSlow && (
                                  <span title="This model may be slow to respond" className="text-amber-500">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                  </span>
                                )}
                                {!isDeployed && (
                                  <span className="text-xs text-deepr-text-muted">(not deployed)</span>
                                )}
                              </div>
                              <div className="text-xs text-deepr-text-muted truncate">{model.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-deepr-text">Chairperson</h3>
          <p className="text-sm text-deepr-text-muted">Synthesizes the final answer from all council members</p>
        </div>
        
        <select
          value={chairmanModel}
          onChange={(e) => onChairmanChange(e.target.value)}
          className="input-field"
        >
          {Object.entries(groupedModels).map(([providerKey, models]) => {
            const provider = providerLabels[providerKey] || { name: providerKey };
            return (
              <optgroup key={providerKey} label={`${provider.icon || ''} ${provider.name}`}>
                {models.filter(m => m.deployed !== false).map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}{model.slow ? ' ⚠️' : ''}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </div>
    </div>
  );
}
