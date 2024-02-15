'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar";
import createLinkPlugin from "@draft-js-plugins/anchor";
import { stateToHTML } from "draft-js-export-html";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  OrderedListButton,
  UnorderedListButton,
} from "@draft-js-plugins/buttons";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";

const text = "lorem lipsum dolor...";

const stripHTMLTags = (str) => {
  if ((str === null) || (str === ''))
    return false;
  else
    str = str.toString();
  return str.replace(/<[^>]*>/g, '');
}

const RgEditor = ({ content, onEditChange, onlyText }) => {
  const linkPlugin = createLinkPlugin();
  const [plugins, InlineToolbar] = useMemo(() => {
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    return [
      [inlineToolbarPlugin],
      inlineToolbarPlugin.InlineToolbar,
      linkPlugin,
    ];
  }, []);

  const [editorState, setEditorState] = useState(() =>
    createEditorStateWithText("")
  );

  useEffect(() => {
    const blocksFromHTML = onlyText ? convertFromHTML(stripHTMLTags(content ? content : ' ')) : convertFromHTML(content ? content : ' ');
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    const editorStateFromContent = EditorState.createWithContent(state);
    setEditorState(editorStateFromContent);
  }, []);

  const editor = useRef(null);

  const onChange = (value) => {
    setEditorState(value);
    const textVal = value.getCurrentContent().getPlainText();
    const htmlContent = stateToHTML(value.getCurrentContent());
    onEditChange(textVal, htmlContent);
  };

  const focus = () => {
    editor.current?.focus();
  };

  return (
    <div className="editor relative" onClick={focus}>
      <Editor
        editorKey="SimpleInlineToolbarEditor"
        editorState={editorState}
        onChange={onChange}
        plugins={plugins}
        ref={(element) => {
          editor.current = element;
        }}
        className="text-sm font-light"
      />
      <InlineToolbar>
        {
          // may be use React.Fragment instead of div to improve perfomance after React 16
          (externalProps) => (
            <>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <linkPlugin.LinkButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
            </>
          )
        }
      </InlineToolbar>
    </div>
  );
};

export default RgEditor;
