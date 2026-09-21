import React from "react";

const InputSet = ({inputGroupStyle, labelStyle, labelText, inputType, inputName, inputValue, inputOnChange, inputPlaceHolder, inputStyle, autoComplete }) => {

    return <div style={inputGroupStyle}>
    
                                    <label style={labelStyle}>
                                        {labelText}
                                    </label>
    
                                    <input
                                        type={inputType}
                                        name={inputName}
                                        value={inputValue}
                                        onChange={inputOnChange}
                                        placeholder={inputPlaceHolder}
                                        style={inputStyle}
                                        autoComplete={autoComplete}
                                    />
    
                                </div>
}

export default InputSet;