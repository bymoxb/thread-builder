import { useState } from "preact/hooks";

type CopyButtonProps = { text: string, class?: string }

export default function CopyButton({ text, class: _class }: CopyButtonProps) {
  const [copiedText, setCopiedText] = useState({ state: false })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText({ state: true });
        setTimeout(() => {
          setCopiedText({ state: false });
        }, 1500);
      });
  }

  return (
    <button
      class={"transition hover:scale-110 text-sm " + (_class ?? "")}
      onClick={() => copyToClipboard(text)}
    >
      <span>📋 {!copiedText.state ? "Copy" : "Copied"}</span>
    </button>
  )
}