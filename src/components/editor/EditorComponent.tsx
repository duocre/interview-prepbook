'use client';

import { FC } from 'react';
import { MDXEditor, MDXEditorMethods } from '@mdxeditor/editor';

import { ALL_PLUGINS } from './Plugins';

import '@mdxeditor/editor/style.css';

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({ markdown, editorRef }) => {
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      plugins={ALL_PLUGINS}
      className="prose prose-slate rounded w-full"
      contentEditableClassName="border-t border-gray-300 p-2 w-full min-h-[300px]"
    />
  );
};

export default Editor;
