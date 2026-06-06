import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import "./InputBox.css";
function InputBox({ label, type = "text", id, value, onChange, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);
  //   const [password, setPassword] = useState("");

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;
  return (
    <div className='form-group'>
      <label for={id}>{label} </label>
      <input
        type={inputType}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {type === "password" && (
        <FontAwesomeIcon
          icon={showPassword ? faEye : faEyeSlash}
          onClick={() => setShowPassword(!showPassword)}
          style={
            {
              //   cursor: "pointer",
              //   position: "absolute",
              //   right: "10px",
              //   top: "50%",
              //   transform: "translateY(-50%)",
            }
          }
        />
      )}
    </div>
  );
}

export default InputBox;
