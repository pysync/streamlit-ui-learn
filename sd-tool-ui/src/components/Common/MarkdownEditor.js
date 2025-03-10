import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Tabs, 
  Tab, 
  TextField, 
  IconButton, 
  Tooltip,
  Divider,
  Button,
  ButtonGroup
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MarkdownViewer from './MarkdownViewer';

/**
 * Markdown editor component with preview
 */
const MarkdownEditor = ({ value, onChange, onSave }) => {
  const [tab, setTab] = useState(0);
  const [content, setContent] = useState(value || '');
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  
  // Handle content change
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };
  
  // Insert markdown syntax
  const insertMarkdown = (syntax, placeholder = '') => {
    const textarea = document.getElementById('markdown-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);
    
    let newText;
    if (syntax === 'bold') {
      newText = `${beforeText}**${selectedText}**${afterText}`;
    } else if (syntax === 'italic') {
      newText = `${beforeText}_${selectedText}_${afterText}`;
    } else if (syntax === 'code') {
      newText = `${beforeText}\`${selectedText}\`${afterText}`;
    } else if (syntax === 'codeblock') {
      newText = `${beforeText}\n\`\`\`\n${selectedText}\n\`\`\`\n${afterText}`;
    } else if (syntax === 'link') {
      newText = `${beforeText}[${selectedText}](url)${afterText}`;
    } else if (syntax === 'image') {
      newText = `${beforeText}![${selectedText}](image-url)${afterText}`;
    } else if (syntax === 'bulletList') {
      newText = `${beforeText}\n- ${selectedText}\n${afterText}`;
    } else if (syntax === 'numberedList') {
      newText = `${beforeText}\n1. ${selectedText}\n${afterText}`;
    } else if (syntax === 'table') {
      newText = `${beforeText}\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |\n${afterText}`;
    }
    
    setContent(newText);
    if (onChange) {
      onChange(newText);
    }
    
    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2 + selectedText.length);
    }, 0);
  };
  
  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
  };
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Edit" />
          <Tab label="Preview" />
        </Tabs>
      </Box>
      
      {tab === 0 && (
        <>
          <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
            <ButtonGroup variant="outlined" size="small" sx={{ mr: 1 }}>
              <Tooltip title="Bold">
                <Button onClick={() => insertMarkdown('bold', 'bold text')}>
                  <FormatBoldIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Italic">
                <Button onClick={() => insertMarkdown('italic', 'italic text')}>
                  <FormatItalicIcon fontSize="small" />
                </Button>
              </Tooltip>
            </ButtonGroup>
            
            <ButtonGroup variant="outlined" size="small" sx={{ mr: 1 }}>
              <Tooltip title="Bullet List">
                <Button onClick={() => insertMarkdown('bulletList', 'list item')}>
                  <FormatListBulletedIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Numbered List">
                <Button onClick={() => insertMarkdown('numberedList', 'list item')}>
                  <FormatListNumberedIcon fontSize="small" />
                </Button>
              </Tooltip>
            </ButtonGroup>
            
            <ButtonGroup variant="outlined" size="small" sx={{ mr: 1 }}>
              <Tooltip title="Inline Code">
                <Button onClick={() => insertMarkdown('code', 'code')}>
                  <CodeIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Code Block">
                <Button onClick={() => insertMarkdown('codeblock', 'code block')}>
                  <CodeIcon fontSize="small" />
                </Button>
              </Tooltip>
            </ButtonGroup>
            
            <ButtonGroup variant="outlined" size="small" sx={{ mr: 1 }}>
              <Tooltip title="Link">
                <Button onClick={() => insertMarkdown('link', 'link text')}>
                  <LinkIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Image">
                <Button onClick={() => insertMarkdown('image', 'image alt')}>
                  <ImageIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Table">
                <Button onClick={() => insertMarkdown('table')}>
                  <TableChartIcon fontSize="small" />
                </Button>
              </Tooltip>
            </ButtonGroup>
            
            {onSave && (
              <Tooltip title="Save">
                <IconButton onClick={handleSave} size="small">
                  <SaveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <TextField
            id="markdown-editor"
            multiline
            fullWidth
            variant="outlined"
            value={content}
            onChange={handleContentChange}
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                height: '100%',
                '& textarea': {
                  height: '100% !important',
                  fontFamily: 'monospace'
                }
              }
            }}
          />
        </>
      )}
      
      {tab === 1 && (
        <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1 }}>
          <MarkdownViewer content={content} />
        </Box>
      )}
    </Box>
  );
};

MarkdownEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSave: PropTypes.func
};

export default MarkdownEditor; 