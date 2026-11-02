import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Step one', title: 'Choose a scheme' },
  { label: 'Step two', title: 'Your details' },
  { label: 'Step three', title: 'Eligibility card' },
];

type Props = { step: number };

export function StepTracker({ step }: Props) {
  const fill = step === 1 ? 0 : step === 2 ? 50 : 100;

  return (
    <ol className="step-tracker" aria-label="Application progress">
      {STEPS.map((item, index) => {
        const number = index + 1;
        const state = step > number ? 'done' : step === number ? 'active' : 'upcoming';
        return (
          <li key={item.title} className={`step-item ${state}`}>
            <span className="step-dot">{state === 'done' ? <Check size={15} /> : `0${number}`}</span>
            <div>
              <small>{item.label.toUpperCase()}</small>
              <strong>{item.title}</strong>
            </div>
            {index < STEPS.length - 1 && (
              <span className="step-connector" aria-hidden="true">
                <i style={{ width: `${step > number ? 100 : step === number ? fill : 0}%` }} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
