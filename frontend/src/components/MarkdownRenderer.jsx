import ReactMarkdown from 'react-markdown';

export function MarkdownRenderer({ content }) {
  if (!content || content.trim().length === 0) {
    return (
      <div className="markdown-content text-deepr-text-muted italic">
        No content available for this response.
      </div>
    );
  }

  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-deepr-text">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5 text-deepr-text">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4 text-deepr-text">{children}</h3>,
          p: ({ children }) => <p className="mb-3 leading-relaxed text-deepr-text-muted">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-deepr-text-muted">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-deepr-text-muted">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-deepr-text">{children}</strong>,
          code: ({ inline, children }) => 
            inline 
              ? <code className="bg-deepr-bg px-2 py-1 rounded text-sm text-deepr-accent">{children}</code>
              : <code>{children}</code>,
          pre: ({ children }) => <pre className="bg-deepr-bg p-4 rounded-lg overflow-x-auto mb-4 text-sm">{children}</pre>,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-deepr-bg">{children}</thead>,
          th: ({ children }) => <th className="border border-deepr-border px-4 py-2 text-left font-semibold text-deepr-text">{children}</th>,
          td: ({ children }) => <td className="border border-deepr-border px-4 py-2 text-deepr-text-muted">{children}</td>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-deepr-accent pl-4 my-4 italic text-deepr-text-muted">{children}</blockquote>,
          a: ({ children, href }) => <a href={href} className="text-deepr-accent hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
          hr: () => <hr className="border-deepr-border my-6" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
