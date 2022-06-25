import { ChangeEvent } from "react";

type TNoDeuce = {
  label?: string;
  id?: string;
  name: string;
  checked: boolean;
  checkboxContainerClass?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const InputCheckbox = (props: TNoDeuce) => {
  const containerClass = props.checkboxContainerClass || "checkbox_container";
  const checkboxLabel = props.label || "No Label";
  const checkboxId = props.id || props.name;
  return (
    <div className={containerClass}>
      <label htmlFor={checkboxId}>{checkboxLabel}&nbsp;</label>
      <input
        type="checkbox"
        id={checkboxId}
        name={props.name}
        onChange={props.onChange}
        checked={props.checked}
      />
    </div>
  );
};

export default InputCheckbox;
