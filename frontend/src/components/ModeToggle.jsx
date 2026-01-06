import { Users, GitBranch } from 'lucide-react';

export function ModeToggle({ mode, onModeChange }) {
  const modes = [
    {
      id: 'council',
      label: 'Council',
      description: 'Karpathy Pattern Implementation',
      icon: Users,
    },
    {
      id: 'dxo',
      label: 'DxO',
      description: 'Role-Based Orchestration',
      icon: GitBranch,
    },
  ];

  return (
    <div className="flex gap-2 p-1 bg-deepr-card rounded-lg border border-deepr-border">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = mode === m.id;
        
        return (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
              ${isActive 
                ? 'bg-deepr-accent text-white' 
                : 'text-deepr-text-muted hover:text-deepr-text hover:bg-deepr-hover'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ModeIndicator({ mode }) {
  const modeConfig = {
    council: {
      label: 'Karpathy Pattern Implementation',
      color: 'bg-deepr-success',
    },
    dxo: {
      label: 'Role-Based Orchestration',
      color: 'bg-deepr-accent',
    },
  };

  const config = modeConfig[mode];

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-deepr-card/50 border border-deepr-border rounded-full">
      <span className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
      <span className="text-sm text-deepr-text-muted">{config.label}</span>
    </div>
  );
}
