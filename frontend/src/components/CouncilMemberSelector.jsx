import { useState, useEffect } from 'react';
import { CheckSquare, Loader2 } from 'lucide-react';

export function CouncilMemberSelector({ selectedMembers, onSelectionChange, chairmanModel, onChairmanChange }) {
  const [availableModels, setAvailableModels] = useState([]);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        setAvailableModels(data.availableModels || []);
        setCouncilMembers(data.councilMembers || []);
        
        // Set default selections based on actual council members
        if (data.councilMembers?.length && selectedMembers.length === 0) {
          onSelectionChange(data.councilMembers.map(m => m.id));
        }
        if (data.councilMembers?.length && !chairmanModel) {
          onChairmanChange(data.councilMembers[0]?.id || 'gpt-5.1');
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
      {/* Available Models Info */}
      <div className="card bg-deepr-accent/5 border-deepr-accent/20">
        <h3 className="text-lg font-semibold text-deepr-text mb-2">Available Models (via Replit AI)</h3>
        <div className="flex flex-wrap gap-2">
          {availableModels.map((model) => (
            <span key={model.id} className="px-2 py-1 bg-deepr-card rounded text-sm text-deepr-text-muted">
              {model.name}
            </span>
          ))}
        </div>
      </div>

      {/* Council Members Selection */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-deepr-text">Council Members</h3>
          <span className="text-sm text-deepr-text-muted">
            Select 2+ models for best results
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {councilMembers.map((model) => {
            const isSelected = selectedMembers.includes(model.id);
            
            return (
              <button
                key={model.id}
                onClick={() => toggleMember(model.id)}
                className={`
                  relative p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${isSelected 
                    ? 'border-deepr-accent bg-deepr-accent/10' 
                    : 'border-deepr-border bg-deepr-card hover:border-deepr-border/80 hover:bg-deepr-hover'
                  }
                `}
                style={{ borderColor: isSelected ? model.color : undefined }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                      ${isSelected 
                        ? 'border-transparent' 
                        : 'border-deepr-border'
                      }
                    `}
                    style={{ backgroundColor: isSelected ? model.color : undefined }}
                  >
                    {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <div className="font-medium text-deepr-text">{model.name}</div>
                    <div className="text-sm text-deepr-text-muted">{model.provider}</div>
                    <div className="text-xs text-deepr-text-muted mt-1">Model: {model.model}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chairman Model Selection */}
      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-deepr-text">Chairman Model</h3>
          <p className="text-sm text-deepr-text-muted">Synthesizes the final answer</p>
        </div>
        
        <select
          value={chairmanModel}
          onChange={(e) => onChairmanChange(e.target.value)}
          className="input-field"
        >
          {councilMembers.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.model})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
