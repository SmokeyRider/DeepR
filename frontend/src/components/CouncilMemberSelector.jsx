import { useState, useEffect } from 'react';
import { CheckSquare, Loader2 } from 'lucide-react';

const modelColors = {
  'gpt-5.2': '#10B981',
  'gpt-5.1': '#8B5CF6',
  'gpt-5': '#3B82F6',
  'gpt-5-mini': '#F59E0B',
  'gpt-4.1': '#EF4444',
  'gpt-4o': '#EC4899',
  'o3': '#14B8A6',
  'o3-mini': '#6366F1',
};

const defaultSelectedMembers = ['gpt-5.1', 'gpt-4.1', 'o3-mini'];
const defaultChairman = 'gpt-5';

export function CouncilMemberSelector({ selectedMembers, onSelectionChange, chairmanModel, onChairmanChange }) {
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        setAvailableModels(data.availableModels || []);
        
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
            Select 2+ models for best results
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {availableModels.map((model) => {
            const isSelected = selectedMembers.includes(model.id);
            const color = modelColors[model.id] || '#6B7280';
            
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
                style={{ borderColor: isSelected ? color : undefined }}
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
                    style={{ backgroundColor: isSelected ? color : undefined }}
                  >
                    {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <div className="font-medium text-deepr-text">{model.name}</div>
                    <div className="text-sm text-deepr-text-muted">{model.provider}</div>
                    <div className="text-xs text-deepr-text-muted mt-1">{model.description}</div>
                  </div>
                </div>
              </button>
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
          {availableModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} - {model.description}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
