import style from './ClassicalInput.module.scss';
import { kMaxLength } from 'buffer';
import { forwardRef } from 'react';

interface ClassicalInputProps {
  label: string;
  type?: string;
  maxLength?: number;
  textArea?: boolean;
  required?: boolean;
};

const ClassicalInput = ({ label, type, maxLength, textArea, required, }: ClassicalInputProps, ref) => {
  return (
    <div className={style.root}>
      <label>{label}</label>
      {
        textArea
        ? <textarea ref={ref} required={required} maxLength={maxLength}></textarea>
        : <input ref={ref} required={required} type={type||'text'} maxLength={maxLength} />
      }
    </div>
  )
};

export default forwardRef(ClassicalInput);