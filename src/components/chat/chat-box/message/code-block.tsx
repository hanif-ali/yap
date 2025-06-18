"use client";

import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import sql from "highlight.js/lib/languages/sql";
import java from "highlight.js/lib/languages/java";
import c from "highlight.js/lib/languages/c";
import typescript from "highlight.js/lib/languages/typescript";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import go from "highlight.js/lib/languages/go";
import ruby from "highlight.js/lib/languages/ruby";
import swift from "highlight.js/lib/languages/swift";
import kotlin from "highlight.js/lib/languages/kotlin";
import rust from "highlight.js/lib/languages/rust";

import "highlight.js/styles/github-dark.min.css";
import { useEffect, useMemo, useRef } from "react";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("java", java);
hljs.registerLanguage("c", c);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("go", go);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("rust", rust);

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const codeRef = useRef<any>(null);

  const language = useMemo(() => {
    // idk why it is this way but i get language-<language> in the className so hafve to parse it
    const className = node?.properties?.className?.[0] ?? "";
    const language = className.split("-")[1];
    return language;
  }, [node]);

  useEffect(() => {
    if (codeRef.current) {
      delete codeRef.current.dataset.highlighted;
      hljs.highlightElement(codeRef.current);
    }
  }, [codeRef, children]);

  if (!inline) {
    return (
      <code
        ref={codeRef}
        className={`block text-sm w-full overflow-x-auto whitespace-pre-wrap break-words text-gray-300 ${language}`}
        {...props}
      >
        {children}
      </code>
    );
  } else {
    return (
      <code
        ref={codeRef}
        className={`${className} text-sm bg-zinc-800 py-0.5 px-1 rounded-md text-gray-300 ${language}`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
