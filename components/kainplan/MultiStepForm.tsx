import style from './MultiStepForm.module.scss';
import { useState, forwardRef, useImperativeHandle } from 'react';

interface MultiStepFormProps {
  forms: React.ReactElement[];
  labels: string[];
};

const MultiStepForm = ({ forms, labels, }: MultiStepFormProps, ref) => {
  const [cu, setCu] = useState(0);

  useImperativeHandle(ref, () => ({
    next: () => cu == forms.length-1 ? undefined : setCu(cu+1),
    goto: (i: number) => setCu(i),
  }));

  return (
    <div className={style.root}>
      <div className={style.progress}>
        {
          labels.map((l, i) => <div className={i <= cu ? style.active : ''} onClick={() => i <= cu ? setCu(i) : undefined}>{l}</div>)
        }
      </div>
      <div>
        {
          forms.map((f, i) => <div style={{
            display: i === cu ? 'block' : 'none',
          }}>
            {f}
          </div>)
        }
      </div>
    </div>
  );
};

export default forwardRef(MultiStepForm);