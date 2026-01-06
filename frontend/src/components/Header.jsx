import { Settings, History, LogOut } from 'lucide-react';
import { ModeToggle } from './ModeToggle';

const navItems = [
  { id: 'superchat', label: 'Xiao Mei' },
  { id: 'council', label: 'Council' },
  { id: 'dxo', label: 'DxO' },
];

export function Header({ mode, onModeChange }) {
  return (
    <header className="sticky top-0 z-50 bg-deepr-bg/80 backdrop-blur-lg border-b border-deepr-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-deepr-accent to-deepr-info rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-deepr-text">DeepR</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'council' || item.id === 'dxo') {
                    onModeChange(item.id);
                  }
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${(item.id === mode) 
                    ? 'bg-deepr-accent text-white' 
                    : 'text-deepr-text-muted hover:text-deepr-text hover:bg-deepr-hover'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-deepr-text-muted hover:text-deepr-text transition-colors">
              <History className="w-5 h-5" />
            </button>
            <button className="p-2 text-deepr-text-muted hover:text-deepr-text transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-deepr-accent rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">S</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
