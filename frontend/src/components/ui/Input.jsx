import { useState } from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const inputClasses = `
    form-control
    ${error ? 'is-invalid' : ''}
    ${isFocused ? 'is-focused' : ''}
    ${className}
  `;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="required-indicator">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses.trim()}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Input;
