import style from './ClassicalInput.module.scss';
import { kMaxLength } from 'buffer';

interface ClassicalInputProps {
  label: string;
  type?: string;
  maxLength?: number;
  textArea?: boolean;
};

const ClassicalInput = ({ label, type, maxLength, textArea, }: ClassicalInputProps) => {
  return (
    <div className={style.root}>
      <label>{label}</label>
      {
        textArea
        ? <textarea maxLength={maxLength}></textarea>
        : <input type={type||'text'} maxLength={maxLength} />
      }
    </div>
  )
};

export default ClassicalInput;