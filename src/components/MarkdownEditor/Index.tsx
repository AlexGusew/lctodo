"use client";

import { useCallback, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@/components/ui/button";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedTodoAtom, setTodoAtom } from "@/state";
import { Separator } from "@/components/ui/separator";

export const MarkdownEditor = () => {
  const [display, setDisplay] = useState<"preview" | "edit">("preview");
  const selectedTodo = useAtomValue(selectedTodoAtom);
  const setTodo = useSetAtom(setTodoAtom);

  const onChange = useCallback(
    (description: string = "") => {
      setTodo({ ...selectedTodo, description });
    },
    [selectedTodo, setTodo]
  );

  if (!selectedTodo) return null;

  const editor = (
    <MDEditor
      value={selectedTodo.description}
      preview={"edit"}
      height="calc(100%-30px)"
      onChange={onChange}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
      textareaProps={{
        placeholder: "# Description",
      }}
      minHeight={120}
      hideToolbar
      visibleDragbar={false}
    />
  );

  const preview = (
    <MDEditor.Markdown
      source={selectedTodo.description}
      rehypePlugins={[[rehypeSanitize]]}
      style={{ whiteSpace: "pre-wrap", minHeight: 120 }}
    />
  );

  return (
    <div className="border rounded-lg">
      <div className="flex items-center">
        <Button
          className={display === "edit" ? "underline" : ""}
          variant="link"
          onClick={() => setDisplay("edit")}
        >
          Write
        </Button>

        <Button
          className={display === "preview" ? "underline" : ""}
          variant="link"
          onClick={() => setDisplay("preview")}
        >
          Preview
        </Button>
        <span className="mr-4 ml-auto text-xs font-mono opacity-60">md</span>
      </div>
      <Separator />
      {display === "edit" ? editor : preview}
    </div>
  );
};
