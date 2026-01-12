import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';

function generateCouncilMarkdown(prompt, config, results) {
  let md = `# DeepR Council Analysis\n\n`;
  md += `**Prompt:** ${prompt}\n\n`;
  
  if (config.selectedMembers?.length) {
    md += `**Council Members:** ${config.selectedMembers.join(', ')}\n`;
  }
  if (config.chairmanModel) {
    md += `**Chairman Model:** ${config.chairmanModel}\n`;
  }
  md += `\n---\n\n`;
  
  if (results.members?.length) {
    md += `## Council Member Responses\n\n`;
    for (const member of results.members) {
      md += `### ${member.model || member.id}\n\n`;
      md += `${member.analysis || member.response || ''}\n\n`;
    }
  }
  
  if (results.chairman) {
    md += `## Chairman's Synthesis\n\n`;
    md += `**Consensus Score:** ${results.chairman.consensusScore}%\n\n`;
    
    if (results.chairman.agreements?.length) {
      md += `**Key Agreements:**\n`;
      for (const point of results.chairman.agreements) {
        md += `- ${point}\n`;
      }
      md += `\n`;
    }
    
    if (results.chairman.disagreements?.length) {
      md += `**Key Disagreements:**\n`;
      for (const point of results.chairman.disagreements) {
        md += `- ${point}\n`;
      }
      md += `\n`;
    }
    
    md += `### Final Decision\n\n`;
    md += `${results.chairman.finalDecision || ''}\n\n`;
  }
  
  return md;
}

function generateDxOMarkdown(prompt, config, results) {
  let md = `# DeepR Decision Orchestrator Analysis\n\n`;
  md += `**Prompt:** ${prompt}\n\n`;
  
  if (config.roles?.length) {
    md += `**Roles:** ${config.roles.map(r => r.name).join(', ')}\n`;
  }
  md += `\n---\n\n`;
  
  const roleOrder = [
    { key: 'leadResearcher', title: 'Lead Researcher' },
    { key: 'criticalReviewer', title: 'Critical Reviewer' },
    { key: 'domainExpert', title: 'Domain Expert' },
    { key: 'dataAnalyst', title: 'Data Analyst' },
  ];
  
  for (const { key, title } of roleOrder) {
    if (results[key]) {
      const role = results[key];
      md += `## ${role.role || title}\n\n`;
      if (role.model) {
        md += `*Model: ${role.model}*\n\n`;
      }
      md += `${role.analysis || role.content || ''}\n\n`;
    }
  }
  
  if (results.finalDecision) {
    const fd = results.finalDecision;
    md += `## ${fd.title || fd.role || 'Final Decision'}\n\n`;
    
    if (fd.revisions?.length) {
      md += `**Key Revisions Made:**\n`;
      for (const rev of fd.revisions) {
        md += `- ~~${rev.from}~~ → **${rev.to}** *(${rev.reason})*\n`;
      }
      md += `\n`;
    }
    
    md += `${fd.content || fd.analysis || ''}\n\n`;
  }
  
  return md;
}

function generateAdversarialMarkdown(prompt, config, results) {
  let md = `# DeepR Adversarial Debate\n\n`;
  md += `**Topic:** ${prompt}\n\n`;
  md += `**Turn Limit:** ${config.turnLimit === 'smart' ? 'Smart (AI-determined)' : `${config.turnLimit} cycle(s)`}\n\n`;
  md += `---\n\n`;
  
  if (results.summary) {
    md += `**Summary:** ${results.summary}\n\n`;
  }
  
  if (results.cycles?.length) {
    for (let i = 0; i < results.cycles.length; i++) {
      const cycle = results.cycles[i];
      md += `## Debate Cycle ${i + 1}\n\n`;
      
      if (cycle.advocate_output) {
        md += `### Advocate\n\n`;
        md += `${cycle.advocate_output}\n\n`;
      }
      
      if (cycle.challenger_output) {
        md += `### Challenger\n\n`;
        md += `${cycle.challenger_output}\n\n`;
      }
      
      if (cycle.arbiter_output && i < results.cycles.length - 1) {
        md += `### Arbiter\n\n`;
        md += `${cycle.arbiter_output}\n\n`;
      }
    }
  }
  
  if (results.final_output) {
    md += `## Final Verdict\n\n`;
    md += `${results.final_output}\n\n`;
  }
  
  if (results.stop_reason) {
    md += `*${results.stop_reason}*\n\n`;
  }
  
  return md;
}

function generateMarkdown(mode, prompt, config, results) {
  const timestamp = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let md = '';
  
  switch (mode) {
    case 'council':
      md = generateCouncilMarkdown(prompt, config, results);
      break;
    case 'dxo':
      md = generateDxOMarkdown(prompt, config, results);
      break;
    case 'adversarial':
      md = generateAdversarialMarkdown(prompt, config, results);
      break;
    default:
      md = `# DeepR Export\n\n**Prompt:** ${prompt}\n\n`;
  }
  
  md += `---\n*Exported from DeepR on ${timestamp}*\n`;
  
  return md;
}

export function SaveShareButtons({ 
  prompt, 
  mode, 
  config, 
  results,
  className = '' 
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const generateExportData = () => {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      mode,
      prompt,
      config,
      results
    };
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      const data = generateExportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 10);
      const safePrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `deepr-${mode}-${safePrompt}-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const markdown = generateMarkdown(mode, prompt, config, results);
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
        title="Download as JSON"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Save</span>
      </button>
      <button
        onClick={handleCopyToClipboard}
        className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
        title="Copy as Markdown"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-deepr-success" />
            <span className="hidden sm:inline text-deepr-success">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
