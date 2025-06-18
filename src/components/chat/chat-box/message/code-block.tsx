/* eslint-disable */
"use client";

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
  if (!inline) {
    return (
      <code 
        className="block text-sm w-full overflow-x-auto whitespace-pre-wrap break-words"
        {...props}
      >
        {children}
      </code>
    );
  } else {
    return (
      <code
        className={`${className} text-sm bg-zinc-100 bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
