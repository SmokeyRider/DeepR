import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const defaultRoles = [
  { 
    id: 'lead', 
    name: 'Lead Researcher', 
    model: 'claude-opus', 
    focus: 'Primary analysis and synthesis',
    instructions: 'Conduct thorough research analysis, identify key findings and patterns.'
  },
  { 
    id: 'reviewer', 
    name: 'Critical Reviewer', 
    model: 'gpt-5.1', 
    focus: 'Identify gaps and weaknesses',
    instructions: 'Critically evaluate the research, identify methodological issues and limitations.'
  },
  { 
    id: 'expert', 
    name: 'Domain Expert', 
    model: 'gemini-pro', 
    focus: 'Deep domain knowledge',
    instructions: 'Provide specialized expertise and context from the relevant field.'
  },
  { 
    id: 'analyst', 
    name: 'Data Analyst', 
    model: 'kimi-k2', 
    focus: 'Quantitative reasoning',
    instructions: 'Focus on data, statistics, and quantitative aspects of the problem.'
  },
];

const availableModels = [
  { id: 'claude-opus', name: 'Claude Opus 4.5' },
  { id: 'gpt-5.1', name: 'GPT-5.1' },
  { id: 'gemini-pro', name: 'Gemini 3 Pro Preview' },
  { id: 'kimi-k2', name: 'Kimi K2 Thinking' },
  { id: 'llama-maverick', name: 'Llama 4 Maverick' },
  { id: 'mistral-large', name: 'Mistral Large 3' },
];

const quickTemplates = [
  { id: 'research', label: 'Research Team', icon: '👥' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'technical', label: 'Technical', icon: '💻' },
  { id: 'strategic', label: 'Strategic', icon: '🎯' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
];

export function DxORoleSelector({ roles, onRolesChange }) {
  const [editingRoles, setEditingRoles] = useState(roles || defaultRoles);

  const updateRole = (index, field, value) => {
    const newRoles = [...editingRoles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    setEditingRoles(newRoles);
    onRolesChange?.(newRoles);
  };

  const addRole = () => {
    const newRole = {
      id: `role-${Date.now()}`,
      name: 'New Role',
      model: 'claude-opus',
      focus: 'Specific perspective',
      instructions: 'Define the role\'s specific instructions...'
    };
    const newRoles = [...editingRoles, newRole];
    setEditingRoles(newRoles);
    onRolesChange?.(newRoles);
  };

  const removeRole = (index) => {
    if (editingRoles.length <= 2) return; // Minimum 2 roles
    const newRoles = editingRoles.filter((_, i) => i !== index);
    setEditingRoles(newRoles);
    onRolesChange?.(newRoles);
  };

  return (
    <div className="space-y-6">
      {/* Role Assignments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-deepr-text">Role Assignments</h3>
            <p className="text-sm text-deepr-text-muted">
              Assign AI models to specialized roles. Each role brings a unique perspective.
            </p>
          </div>
          <button
            onClick={addRole}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Role
          </button>
        </div>

        <div className="space-y-4">
          {editingRoles.map((role, index) => (
            <div 
              key={role.id}
              className="p-4 bg-deepr-bg rounded-lg border border-deepr-border"
            >
              <div className="flex items-start gap-4">
                {/* Role Name */}
                <div className="flex-1">
                  <label className="block text-sm text-deepr-text-muted mb-1">Role Name</label>
                  <input
                    type="text"
                    value={role.name}
                    onChange={(e) => updateRole(index, 'name', e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* Model Selection */}
                <div className="flex-1">
                  <label className="block text-sm text-deepr-text-muted mb-1">Assigned Model</label>
                  <select
                    value={role.model}
                    onChange={(e) => updateRole(index, 'model', e.target.value)}
                    className="input-field"
                  >
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Focus/Perspective */}
                <div className="flex-1">
                  <label className="block text-sm text-deepr-text-muted mb-1">Perspective/Focus</label>
                  <input
                    type="text"
                    value={role.focus}
                    onChange={(e) => updateRole(index, 'focus', e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeRole(index)}
                  className="mt-6 p-2 text-deepr-text-muted hover:text-deepr-error transition-colors"
                  disabled={editingRoles.length <= 2}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-3">
                <label className="block text-sm text-deepr-text-muted mb-1">
                  Role Instructions (Optional)
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

      {/* Quick Templates */}
      <div className="card">
        <h3 className="text-sm font-semibold text-deepr-text mb-3">Quick Templates</h3>
        <div className="flex flex-wrap gap-2">
          {quickTemplates.map((template) => (
            <button
              key={template.id}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <span>{template.icon}</span>
              {template.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
