import { AppFormHelperTextProps } from "@/components/AppFormHelperText";
import { AppInputLabelProps } from "@/components/AppInputLabel";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import ReactQuill from "react-quill";

import useStyles from "./QuillTextEditor.styles";
import AppButton from "@/components/AppButton";

type CustomQuillTextEditorProps = {};

type QuillTextEditorProps = {
  label?: React.ReactNode;
  inputLabelProps?: AppInputLabelProps;
  helperText?: React.ReactNode;
  formHelperTextProps?: AppFormHelperTextProps;
  name?: string;
  value?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const QuillToolbar = (props: { id: string }) => {
  const { id } = props;

  // const { classes, cx } = useStyles();

  return (
    <div id={id}>
      <select
        className="ql-header"
        defaultValue={""}
        onChange={(e) => e.persist()}
      >
        <option value="1" />
        <option value="2" />
        <option selected />
      </select>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
    </div>
  );
};

const QuillTextEditor = (props: QuillTextEditorProps) => {
  const [value, setValue] = useState("");

  const rId = useId();
  const quillRef = useRef<any>();

  const toolbarElId = `quill-toolbar-${rId.replaceAll(":", "i")}`;

  const quillModules = useMemo(() => {
    return {
      toolbar: {
        container: `#${toolbarElId}`,
      },
    };
  }, []);

  const quillFormats = useMemo(() => {
    return [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      // "list",
      // "align",
      // "blockquote",
      // "code-block",
    ];
  }, []);

  const { classes } = useStyles();

  useEffect(() => {
    console.log("quillRef", quillRef.current);
  }, []);

  return (
    <div className={classes.root}>
      <QuillToolbar id={toolbarElId} />
      <ReactQuill
        ref={quillRef}
        theme="snow"
        className={classes.quill}
        modules={quillModules}
        formats={quillFormats}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export default QuillTextEditor;
