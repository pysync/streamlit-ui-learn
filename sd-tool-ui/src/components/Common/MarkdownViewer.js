import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Component for rendering markdown content
 */
const MarkdownViewer = ({ content }) => {
  return (
    <Box sx={{ 
      '& img': { maxWidth: '100%' },
      '& table': { 
        borderCollapse: 'collapse',
        width: '100%',
        marginBottom: 2
      },
      '& th, & td': { 
        border: '1px solid rgba(224, 224, 224, 1)',
        padding: '8px 16px',
        textAlign: 'left'
      },
      '& th': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
      '& blockquote': {
        borderLeft: '4px solid rgba(0, 0, 0, 0.12)',
        margin: '16px 0',
        padding: '0 16px'
      }
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={materialLight}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </Box>
  );
};

MarkdownViewer.propTypes = {
  content: PropTypes.string
};

export default MarkdownViewer; 