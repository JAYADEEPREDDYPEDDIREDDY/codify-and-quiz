
import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  defaultCode: string;
  language: string;
  onChange: (value: string | undefined) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  defaultCode,
  language,
  onChange,
  height = "300px"
}) => {
  return (
    <div className="code-editor-container">
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={defaultCode}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          folding: true,
          lineNumbers: "on",
        }}
      />
    </div>
  );
};

export default CodeEditor;
