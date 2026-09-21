import React, { useState } from "react";

const AddEmployeePopup = ({ onClose, onSubmit, data, formData, setFormData }) => {

    // const [formData, setFormData] = useState({
    //     name: "",
    //     email: "",
    //     password: "",
    //     salary: "",
    //     gender: "",
    //     phone: ""
    // });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Remove error while typing
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const validate = () => {

        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.salary) {
            newErrors.salary = "Salary is required";
        }

        if (!formData.gender) {
            newErrors.gender = "Please select gender";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10 digit phone number";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit(formData);
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.55)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "15px",
                zIndex: 1000,
                overflowY: "auto",
                minHeight : "70vh"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
                    overflow: "hidden",
                    margin: "20px auto"
                }}
            >

                {/* Header */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "18px 22px",
                        backgroundColor: "#2563eb",
                        color: "#fff"
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "21px",
                            fontWeight: "600"
                        }}
                    >
                        Add New Employee
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "transparent",
                            color: "#fff",
                            fontSize: "25px",
                            cursor: "pointer",
                            lineHeight: 1
                        }}
                    >
                        ×
                    </button>
                </div>


                {/* Form */}

                {data.loading ? <span style={{margin : "45% auto"}}> Loading... </span>:

                <form
                    onSubmit={handleSubmit}
                    style={{
                        padding: "22px"
                    }}
                >

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "18px"
                        }}
                    >

                        {/* Name */}

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={labelStyle}>
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter employee name"
                                style={inputStyle(errors.name)}
                            />

                            {errors.name && (
                                <span style={errorStyle}>
                                    {errors.name}
                                </span>
                            )}
                        </div>


                        {/* Email */}

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={labelStyle}>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                style={inputStyle(errors.email)}
                            />

                            {errors.email && (
                                <span style={errorStyle}>
                                    {errors.email}
                                </span>
                            )}
                        </div>


                        {/* Password */}

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={labelStyle}>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                style={inputStyle(errors.password)}
                            />

                            {errors.password && (
                                <span style={errorStyle}>
                                    {errors.password}
                                </span>
                            )}
                        </div>


                        {/* Salary */}

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={labelStyle}>
                                Salary
                            </label>

                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="Enter salary"
                                min="0"
                                style={inputStyle(errors.salary)}
                            />

                            {errors.salary && (
                                <span style={errorStyle}>
                                    {errors.salary}
                                </span>
                            )}
                        </div>


                        {/* Gender */}

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={labelStyle}>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={inputStyle(errors.gender)}
                            >
                                <option value="">
                                    Select gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>

                            {errors.gender && (
                                <span style={errorStyle}>
                                    {errors.gender}
                                </span>
                            )}
                        </div>


                        {/* Phone */}

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label style={labelStyle}>
                                Phone
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter 10 digit phone"
                                maxLength="10"
                                style={inputStyle(errors.phone)}
                            />

                            {errors.phone && (
                                <span style={errorStyle}>
                                    {errors.phone}
                                </span>
                            )}
                        </div>

                    </div>


                    {/* Buttons */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px",
                            marginTop: "25px",
                            flexWrap: "wrap"
                        }}
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "7px",
                                border: "1px solid #d1d5db",
                                backgroundColor: "#fff",
                                color: "#374151",
                                cursor: "pointer",
                                fontSize: "15px",
                                minWidth: "100px"
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                borderRadius: "7px",
                                border: "none",
                                backgroundColor: "#2563eb",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "15px",
                                minWidth: "130px"
                            }}
                        >
                            Add Employee
                        </button>

                    </div>

                </form>
                }

            </div>

                            {/* error message */}
                           {data.error ? <span style={{color:"red", margin : "6px auto"}}>{data.message}</span> : "" }
        </div>
    );
};


/* ---------- Inline Styles ---------- */

const labelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px"
};

const inputStyle = (hasError) => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    borderRadius: "7px",
    border: hasError
        ? "1px solid #dc2626"
        : "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#fff"
});

const errorStyle = {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "4px"
};

export default AddEmployeePopup;