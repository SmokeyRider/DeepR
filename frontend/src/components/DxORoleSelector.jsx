import { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';

const quickTemplates = [
  { id: 'research', label: 'Research Team', icon: '👥' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'technical', label: 'Technical', icon: '💻' },
  { id: 'strategic', label: 'Strategic', icon: '🎯' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
];

export function DxORoleSelector({ roles, onRolesChange }) {
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoles, setEditingRoles] = useState(roles);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        setAvailableModels(data.availableModels || []);
        
        if (data.availableModels?.length && roles) {
          const defaultModel = data.availableModels[0]?.id || 'gpt-5.1';
          const updatedRoles = roles.map((role, index) => {
            const modelExists = data.availableModels.some(m => m.id === role.model);
            if (!modelExists) {
              const assignedModel = data.availableModels[index % data.availableModels.length]?.id || defaultModel;
              return { ...role, model: assignedModel };
            }
            return role;
          });
          setEditingRoles(updatedRoles);
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
    const newRoles = [...editingRoles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    setEditingRoles(newRoles);
    onRolesChange?.(newRoles);
  };

  const addRole = () => {
    const defaultModel = availableModels[0]?.id || 'gpt-5.1';
    const newRole = {
      id: `role-${Date.now()}`,
      name: 'New Role',
      model: defaultModel,
      focus: 'Specific perspective',
      instructions: 'Define the role\'s specific instructions...'
    };
    const newRoles = [...editingRoles, newRole];
    setEditingRoles(newRoles);
    onRolesChange?.(newRoles);
  };

  const removeRole = (index) => {
    if (editingRoles.length <= 2) return;
    const newRoles = editingRoles.filter((_, i) => i !== index);
    setEditingRoles(newRoles);
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

  return (
    <div className="space-y-6">
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
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                <div className="flex-1 min-w-0">
                  <label className="block text-sm text-deepr-text-muted mb-1">Role Name</label>
                  <input
                    type="text"
                    value={role.name}
                    onChange={(e) => updateRole(index, 'name', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <label className="block text-sm text-deepr-text-muted mb-1">Assigned Model</label>
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
                  <label className="block text-sm text-deepr-text-muted mb-1">Perspective/Focus</label>
                  <input
                    type="text"
                    value={role.focus}
                    onChange={(e) => updateRole(index, 'focus', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <button
                  onClick={() => removeRole(index)}
                  className="self-end md:self-auto md:mt-6 p-2 text-deepr-text-muted hover:text-deepr-error transition-colors"
                  disabled={editingRoles.length <= 2}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

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
