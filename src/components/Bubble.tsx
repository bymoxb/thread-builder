type BubbleProps = { value: number | string, class?: string }

export default function Bubble({ value, class: _class }: BubbleProps) {
  return (
    <span class={"inline-flex items-center justify-center text-xs text-center font-bold border rounded leading-none " + (_class ?? "")}>
      {value}
    </span>
  )
}