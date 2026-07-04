/**
 * MDXComponents.tsx
 * ─────────────────────────────────────────────────────────────
 * Styled replacements for the default HTML tags MDX renders into.
 * Passed to <MDXRemote components={…} /> so every post inherits
 * the portfolio's typography without repeating class names.
 *
 * Keeping this file small and tag-based keeps individual .mdx
 * files portable — authors write plain Markdown; styling lives here.
 * ─────────────────────────────────────────────────────────────
 */

import type { MDXComponents } from "mdx/types"
import Link from "next/link"

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-[22px] font-semibold text-white leading-tight mt-6 mb-3"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-[16px] font-semibold text-white/90 mt-6 mb-2"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-[13px] font-semibold uppercase tracking-widest mt-5 mb-2"
      style={{ color: "var(--text-secondary)" }}
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="text-[13px] leading-[1.75] mb-4"
      style={{ color: "var(--text-secondary)" }}
      {...props}
    />
  ),
  a: ({ href = "", ...rest }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#")
    if (isInternal) {
      return <Link href={href} className="underline underline-offset-2 hover:text-white" {...rest} />
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-white"
        {...rest}
      />
    )
  },
  ul: (props) => <ul className="list-disc pl-5 space-y-1.5 mb-4 text-[13px]" style={{ color: "var(--text-secondary)" }} {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 space-y-1.5 mb-4 text-[13px]" style={{ color: "var(--text-secondary)" }} {...props} />,
  li: (props) => <li className="leading-[1.7]" {...props} />,
  strong: (props) => <strong className="text-white/90 font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="pl-4 py-0.5 my-4 text-[13px] italic"
      style={{ borderLeft: "2px solid var(--accent)", color: "var(--text-secondary)" }}
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="font-mono text-[12px] px-1.5 py-0.5 rounded"
      style={{ background: "var(--separator)", color: "var(--text-primary)" }}
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="font-mono text-[12px] p-4 rounded-lg overflow-x-auto mb-4 mac-scrollbar"
      style={{
        background: "var(--terminal-bg)",
        border: "1px solid var(--widget-border)",
        color: "rgba(255,255,255,0.85)",
      }}
      {...props}
    />
  ),
  hr: () => <hr className="my-6" style={{ border: "none", borderTop: "1px solid var(--separator)" }} />,
}
