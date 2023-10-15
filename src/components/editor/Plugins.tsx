import React from 'react';

import {
  diffSourcePlugin,
  markdownShortcutPlugin,
  frontmatterPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
} from '@mdxeditor/editor';
import { CustomToolbar } from './ToolBar';

export const ALL_PLUGINS = [
  toolbarPlugin({ toolbarContents: () => <CustomToolbar /> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: 'JavaScript',
      css: 'CSS',
      txt: 'text',
      ts: 'TypeScript',
    },
  }),
  diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
  markdownShortcutPlugin(),
];
