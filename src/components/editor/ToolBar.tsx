import React from 'react';
import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  ListsToggle,
  Separator,
  UndoRedo,
} from '@mdxeditor/editor';

export const CustomToolbar: React.FC = () => {
  return (
    <DiffSourceToggleWrapper>
      <ConditionalContents
        options={[
          {
            when: (editor) => editor?.editorType === 'codeblock',
            contents: () => <ChangeCodeMirrorLanguage />,
          },

          {
            fallback: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />
                <InsertCodeBlock />
                <Separator />
              </>
            ),
          },
        ]}
      />
    </DiffSourceToggleWrapper>
  );
};
