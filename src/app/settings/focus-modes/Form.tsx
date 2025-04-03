import { useState } from 'react';

export type FormOptions = Array<{
  label: string;
  name: string;
  type: 'input' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: any; value: string }>;
  requiredMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
}>;
export const Form = ({
  options = [] as FormOptions,
  initValues = {},
  onSubmit = (values: { [key: string]: any }) => {
    console.log('Submitted values:', values);
  },
}) => {
  const [values, setValues] = useState<{ [key: string]: any }>(initValues);
  const [errors, setErrors] = useState<{ [key: string]: any }>({});

  const validate = (name: string, _values?: any) => {
    const option = options.find((opt) => opt.name === name);
    if (!option) return { isValid: false, error: 'not find this name' };

    const { required, maxLength, requiredMessage, maxLengthMessage } = option;
    const v = _values?.[name] ?? values[name];

    if (required && !v) {
      setErrors({ ...errors, [name]: requiredMessage });
      return { isValid: false, error: requiredMessage };
    } else if (maxLength && (v?.length || 0) > maxLength) {
      setErrors({ ...errors, [name]: maxLengthMessage });
      return { isValid: false, error: maxLengthMessage };
    } else {
      setErrors({ ...errors, [name]: undefined });
      return { isValid: true };
    }
  };
  const validateAll = () => {
    const newErrors: { [key: string]: any } = {};
    options.forEach((option) => {
      const { name } = option;
      const { isValid, error } = validate(name);
      if (!isValid) {
        newErrors[name] = error;
      }
    });
    setErrors(newErrors);
    return {
      errors: newErrors,
      isValid: Object.keys(newErrors).length === 0,
      values,
    };
  };

  return (
    <div>
      {options.map((option, index) => {
        const { label, name, type, required, placeholder } = option;
        return (
          <div key={index} className="flex mb-4 align-center">
            <label className="min-w-28">{label}</label>
            {type === 'input' && (
              <div className="flex-1">
                <input
                  value={values[name] || ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    const newValues = { ...values, [name]: v };
                    setValues(newValues);
                    validate(name, newValues);
                  }}
                  name={name}
                  type="text"
                  placeholder={placeholder}
                  required={required}
                  className={`border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
                />
                {errors[name] && (
                  <div className="text-red-500 text-sm">{errors[name]}</div>
                )}
              </div>
            )}
            {type === 'textarea' && (
              <div className="flex-1">
                <textarea
                  value={values[name] || ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    const newValues = { ...values, [name]: v };
                    setValues(newValues);
                    validate(name, newValues);
                  }}
                  name={name}
                  placeholder={placeholder}
                  required={required}
                  className={`border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
                />
                {errors[name] && (
                  <div className="text-red-500 text-sm">{errors[name]}</div>
                )}
              </div>
            )}
            {type === 'select' && (
              <div className="flex-1">
                <select
                  value={values[name] || ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    const newValues = { ...values, [name]: v };
                    setValues(newValues);
                    validate(name, newValues);
                  }}
                  name={name}
                  required={required}
                  className={`border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
                >
                  {option?.options?.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors[name] && (
                  <div className="text-red-500 text-sm">{errors[name]}</div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={() => {
          const { isValid, values } = validateAll();
          if (isValid) {
            onSubmit(values);
          } else {
            console.log('Form has errors:', errors);
          }
        }}
      >
        submit
      </button>
    </div>
  );
};
