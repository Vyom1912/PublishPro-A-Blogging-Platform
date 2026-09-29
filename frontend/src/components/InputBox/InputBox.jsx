import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "./InputBox.css";

function InputBox({
  label,
  type = "text",
  id,
  value,
  rows = 1,
  onChange,
  placeholder,
  autoComplete,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className='input-field-group'>
      {label && <label htmlFor={id}>{label}</label>}

      <div className='form-input-box'>
        {rows > 1 ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            {...rest}
          />
        ) : (
          <>
            <input
              type={inputType}
              id={id}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              autoComplete={
                autoComplete ??
                (type === "password" ? "current-password" : undefined)
              }
              {...rest}
            />

            {type === "password" && (
              <button
                type='button'
                className='input-eye-icone'
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InputBox;
