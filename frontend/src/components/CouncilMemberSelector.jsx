import { useState } from 'react';
import { CheckSquare } from 'lucide-react';

const availableModels = [
  { id: 'gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI Flagship' },
  { id: 'claude-opus', name: 'Claude Opus 4.5', provider: 'Anthropic Flagship' },
  { id: 'gemini-pro', name: 'Gemini 3 Pro', provider: 'Google Flagship' },
  { id: 'llama-maverick', name: 'Llama 4 Maverick', provider: 'Meta Flagship' },
  { id: 'mistral-large', name: 'Mistral Large 3', provider: 'Mistral AI Flagship' },
  { id: 'kimi-k2', name: 'Kimi K2 Thinking', provider: 'Moonshot AI Reasoning' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek Reasoning' },
  { id: 'grok-fast', name: 'Grok 4.1 Fast', provider: 'xAI Flagship' },
];

const chairmanModels = [
  { id: 'claude-opus', name: 'Claude Opus 4.5 (Recommended)' },
  { id: 'gpt-5.1', name: 'GPT-5.1' },
  { id: 'gemini-pro', name: 'Gemini 3 Pro' },
];

export function CouncilMemberSelector({ selectedMembers, onSelectionChange, chairmanModel, onChairmanChange }) {
  const toggleMember = (modelId) => {
    if (selectedMembers.includes(modelId)) {
      onSelectionChange(selectedMembers.filter(id => id !== modelId));
    } else {
      onSelectionChange([...selectedMembers, modelId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Council Members Selection */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-deepr-text">Council Members</h3>
          <span className="text-sm text-deepr-text-muted">
            Select 2+ models for best results
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableModels.map((model) => {
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
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                    ${isSelected 
                      ? 'bg-deepr-accent border-deepr-accent' 
                      : 'border-deepr-border'
                    }
                  `}>
                    {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <div className="font-medium text-deepr-text">{model.name}</div>
                    <div className="text-sm text-deepr-text-muted">{model.provider}</div>
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
          {chairmanModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
