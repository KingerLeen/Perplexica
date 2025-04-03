import { useState } from 'react';

const isEmpty = (v: any) => {
  if (typeof v === 'string') {
    return v.trim() === '';
  } else if (Array.isArray(v)) {
    return v.length === 0;
  }
  return v === undefined || v === null;
};

export type FormOptions = Array<{
  label: string;
  name: string;
  type: 'input' | 'select' | 'textarea' | 'switch' | 'number' | 'checkbox';
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

    if (required && isEmpty(v)) {
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
            <label
              style={{
                minWidth: '13rem',
              }}
            >
              {label}
            </label>
            {type === 'input' && (
              <div className="flex-1">
                <input
                  value={values[name] ?? ''}
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
                  className={`w-[100%] border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
                />
                {errors[name] && (
                  <div className="text-red-500 text-sm">{errors[name]}</div>
                )}
              </div>
            )}
            {type === 'textarea' && (
              <div className="flex-1">
                <textarea
                  value={values[name] ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    const newValues = { ...values, [name]: v };
                    setValues(newValues);
                    validate(name, newValues);
                  }}
                  name={name}
                  placeholder={placeholder}
                  required={required}
                  className={`w-[100%] border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
                />
                {errors[name] && (
                  <div className="text-red-500 text-sm">{errors[name]}</div>
                )}
              </div>
            )}
            {type === 'select' && (
              <div className="flex-1">
                <select
                  value={values[name] ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    const newValues = { ...values, [name]: v };
                    setValues(newValues);
                    validate(name, newValues);
                  }}
                  name={name}
                  required={required}
                  className={`w-[100%] border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
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
            {type === 'number' && (
              <div className="flex-1">
                <input
                  value={values[name] ?? undefined}
                  onChange={(e) => {
                    const v = e.target.value;
                    const newValues = { ...values, [name]: v };
                    setValues(newValues);
                    validate(name, newValues);
                  }}
                  name={name}
                  type="number"
                  placeholder={placeholder}
                  required={required}
                  className={`w-[100%] border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
                />
                {errors[name] && (
                  <div className="text-red-500 text-sm">{errors[name]}</div>
                )}
              </div>
            )}
            {type === 'checkbox' && (
              <div className="flex-1">
                {option?.options?.map((opt, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      className="w-5 h-5"
                      type="checkbox"
                      checked={values[name]?.includes(opt.value) ?? false}
                      onChange={(e) => {
                        const v = e.target.checked;
                        const newValues = {
                          ...values,
                          [name]: v
                            ? [...(values[name] || []), opt.value]
                            : values[name]?.filter(
                                (item: any) => item !== opt.value,
                              ),
                        };
                        setValues(newValues);
                        validate(name, newValues);
                      }}
                    />
                    <span className="ml-4">{opt.label}</span>
                  </div>
                ))}
                {errors[name] && (
                  <div className="w-[100%] text-red-500 text-sm">
                    {errors[name]}
                  </div>
                )}
              </div>
            )}
            {type === 'switch' && (
              <div className="flex-1">
                <input
                  className="w-5 h-5"
                  type="checkbox"
                  checked={values[name] ?? false}
                  onChange={(e) => {
                    const v = e.target.checked;
                    const newValues = { ...values, [name]: v };
                    setValues(newValues);
                    validate(name, newValues);
                  }}
                  name={name}
                />
                {errors[name] && (
                  <div className="w-[100%] text-red-500 text-sm">
                    {errors[name]}
                  </div>
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
