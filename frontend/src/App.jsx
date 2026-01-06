import { useState, useEffect } from 'react';
import { Header, CouncilView, DxOView } from './components';

function App() {
  const [mode, setMode] = useState('council');
  const [apiStatus, setApiStatus] = useState(null);

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setApiStatus(data);
      } catch (err) {
        setApiStatus({ status: 'error', message: 'Backend not connected' });
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-deepr-bg">
      <Header mode={mode} onModeChange={setMode} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Status Indicator (shown only in development) */}
        {apiStatus && (
          <div className="mb-4 flex justify-end">
            <div className={`
              inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs
              ${apiStatus.status === 'ok' 
                ? 'bg-deepr-success/20 text-deepr-success' 
                : 'bg-deepr-error/20 text-deepr-error'
              }
            `}>
              <span className={`w-2 h-2 rounded-full ${
                apiStatus.status === 'ok' ? 'bg-deepr-success' : 'bg-deepr-error'
              }`} />
              {apiStatus.status === 'ok' 
                ? `API: ${apiStatus.mode === 'mock' ? 'Mock Mode' : 'Live'}`
                : 'API Disconnected'
              }
            </div>
          </div>
        )}

        {/* Mode Views */}
        {mode === 'council' && <CouncilView />}
        {mode === 'dxo' && <DxOView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-deepr-border mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-deepr-accent to-deepr-info rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-deepr-text font-semibold">DeepR</span>
              <span className="text-deepr-text-muted text-sm">AI Decision Frameworks</span>
            </div>
            <div className="text-deepr-text-muted text-sm">
              Demonstrating multi-model AI deliberation patterns
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
