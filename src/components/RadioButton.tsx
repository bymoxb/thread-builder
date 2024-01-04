import type { TargetedEvent } from "preact/compat"

type RadioButtonProps = {
  checked: boolean,
  onChange: (e: TargetedEvent<HTMLInputElement, Event>) => void,
  label: string,
  name: string,
  id: string,
  class?: string,
}

export default function RadioButton({
  id,
  name,
  label,
  checked,
  onChange,
  class: _class
}: RadioButtonProps) {
  return (
    <div class={"flex items-center me-4 " + (_class ?? "")}>
      <input id={id} type="radio" checked={checked} name={name} onChange={onChange} />
      <label for={id} class="ms-2">{label}</label>
    </div>
  )
}