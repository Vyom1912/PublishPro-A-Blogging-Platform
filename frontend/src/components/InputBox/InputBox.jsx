import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./InputBox.css";

function InputBox({ label, type = "text", id, value, onChange, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="input-field-group">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="form-input-box">
        <input
          type={inputType}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={type === "password" ? "current-password" : undefined}
        />
        {type === "password" && (
          <FontAwesomeIcon
            className="input-eye-icone"
            icon={showPassword ? faEye : faEyeSlash}
            onClick={() => setShowPassword((s) => !s)}
          />
        )}
      </div>
    </div>
  );
}

export default InputBox;
