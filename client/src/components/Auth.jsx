import React, { useState } from "react";
import axios from "axios";
import InputSet from "./InputSet";
// import InputSet {inputGroupStyle, lebelStyle, labelText, inputType, inputName, inputValue, inputOnChange, inputPlaceHolder, inputStyle, autoComplete } from "./InputSet {inputGroupStyle, lebelStyle, labelText, inputType, inputName, inputValue, inputOnChange, inputPlaceHolder, inputStyle, autoComplete }";

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        phone: "",
        salary: 0
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [data, setData] = useState({
        loading: false,
        error: false,
        success: false,
        message: ""
    });

    // =========================
    // Handle Input Change
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Clear message when user starts typing
        setData((prev) => ({
            ...prev,
            error: false,
            success: false,
            message: ""
        }));
    };

    // =========================
    // Toggle Sign In / Sign Up
    // =========================
    const toggleAuth = () => {
        setIsSignUp((prev) => !prev);

        setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        });

        setData({
            loading: false,
            error: false,
            success: false,
            message: ""
        });
    };

    // =========================
    // Submit Form
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email.trim() || !formData.password.trim()) {
            setData({
                loading: false,
                error: true,
                success: false,
                message: "Email and password are required."
            });

            return;
        }

        if (isSignUp && !formData.name.trim()) {
            setData({
                loading: false,
                error: true,
                success: false,
                message: "Name is required."
            });

            return;
        }

        if (isSignUp && formData.password !== formData.confirmPassword) {
            setData({
                loading: false,
                error: true,
                success: false,
                message: "Passwords do not match."
            });

            return;
        }

        try {
            setData({
                loading: true,
                error: false,
                success: false,
                message: ""
            });

            // ==========================================
            // API CALL GOES HERE
            // ==========================================

            /*
            Example:

            const url = isSignUp
                ? "https://localhost:7243/api/Account/Register"
                : "https://localhost:7243/api/Account/Login";

            const response = await axios.post(url, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            */

            // Temporary simulation
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setData({
                loading: false,
                error: false,
                success: true,
                message: isSignUp
                    ? "Account created successfully!"
                    : "Signed in successfully!"
            });

        } catch (error) {
            setData({
                loading: false,
                error: true,
                success: false,
                message:
                    error?.response?.data?.message ||
                    "Something went wrong. Please try again."
            });
        }
    };

    // signin fun
    async function signinFun() {
        try {
            let res = await axios.post("https://localhost:7243/api/Employees/Login", formData, {
                headers: {
                    "Content-Type": "Application/json"
                },
                withCredentials: true
            });
            console.log("res in success login - ", res);
        }
        catch (error) {
            console.log("exception error in login - ", error)
        }

    }

    // signup fun
    async function signupFun() {
        try {
            var res = await axios.post("https://localhost:7243/api/Employees/Signup", formData, {
                headers: {
                    "Content-Type": "Application/json"
                }
            });

            console.log("signup response - ", res);
        }
        catch (error) {
            console.log(`Error occure while signup - ${error}`);
        }
    }

    // =========================
    // Styles
    // =========================

    const styles = {
        page: {
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box",
            background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontFamily:
                "Arial, Helvetica, sans-serif"
        },

        card: {
            width: "100%",
            maxWidth: "900px",
            minHeight: "550px",
            display: "flex",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.20)"
        },

        leftSection: {
            flex: "1",
            background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "50px 35px",
            boxSizing: "border-box"
        },

        rightSection: {
            flex: "1",
            padding: "45px 40px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        },

        title: {
            margin: "0 0 10px 0",
            fontSize: "32px",
            fontWeight: "700",
            color: "#222222"
        },

        subtitle: {
            margin: "0 0 30px 0",
            fontSize: "14px",
            color: "#777777"
        },

        welcomeTitle: {
            margin: "0 0 15px 0",
            fontSize: "34px",
            fontWeight: "700"
        },

        welcomeText: {
            fontSize: "15px",
            lineHeight: "1.7",
            margin: "0 0 30px 0",
            opacity: "0.9"
        },

        inputGroup: {
            marginBottom: "18px"
        },

        label: {
            display: "block",
            marginBottom: "7px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#333333"
        },

        inputWrapper: {
            position: "relative",
            width: "100%"
        },

        input: {
            width: "100%",
            height: "48px",
            padding: "0 14px",
            boxSizing: "border-box",
            border: "1px solid #dddddd",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            color: "#333333",
            backgroundColor: "#fafafa",
            transition: "0.2s"
        },

        passwordInput: {
            paddingRight: "70px"
        },

        showButton: {
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            color: "#667eea",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            padding: "5px"
        },

        submitButton: {
            width: "100%",
            height: "48px",
            border: "none",
            borderRadius: "8px",
            background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "8px",
            transition: "0.2s"
        },

        switchText: {
            marginTop: "25px",
            textAlign: "center",
            fontSize: "14px",
            color: "#777777"
        },

        switchButton: {
            border: "none",
            background: "transparent",
            color: "#667eea",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "14px",
            padding: "0",
            marginLeft: "5px"
        },

        message: {
            padding: "11px 12px",
            borderRadius: "7px",
            marginBottom: "18px",
            fontSize: "13px",
            textAlign: "center"
        },

        errorMessage: {
            backgroundColor: "#fff0f0",
            color: "#d93025",
            border: "1px solid #ffd0d0"
        },

        successMessage: {
            backgroundColor: "#effaf3",
            color: "#18864b",
            border: "1px solid #c8efd8"
        },

        forgotPassword: {
            display: "block",
            textAlign: "right",
            marginTop: "-8px",
            marginBottom: "18px",
            fontSize: "13px",
            color: "#667eea",
            cursor: "pointer"
        },

        feature: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
            fontSize: "14px"
        },

        featureIcon: {
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px"
        }
    };

    console.log("signup - ", isSignUp);
    return (
        <div style={styles.page}>

            <div style={styles.card}>

                {/* =========================
                    LEFT SECTION
                ========================== */}

                <div style={styles.leftSection}>

                    <h1 style={styles.welcomeTitle}>
                        {isSignUp ? "Welcome!" : "Welcome Back!"}
                    </h1>

                    <p style={styles.welcomeText}>
                        {isSignUp
                            ? "Create your account and start managing everything from one place."
                            : "Sign in to your account and continue where you left off."}
                    </p>

                    <div style={{ width: "100%", maxWidth: "280px" }}>

                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>✓</div>
                            <span>Simple and secure authentication</span>
                        </div>

                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>✓</div>
                            <span>Responsive across all devices</span>
                        </div>

                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>✓</div>
                            <span>Easy to connect with your API</span>
                        </div>

                    </div>

                </div>

                {/* =========================
                    RIGHT SECTION
                ========================== */}

                <div style={styles.rightSection}>

                    <h2 style={styles.title}>
                        {isSignUp ? "Create Account" : "Sign In"}
                    </h2>

                    <p style={styles.subtitle}>
                        {isSignUp
                            ? "Fill in the details to create your account"
                            : "Enter your credentials to access your account"}
                    </p>

                    {/* Message */}

                    {data.message && (
                        <div
                            style={{
                                ...styles.message,
                                ...(data.error
                                    ? styles.errorMessage
                                    : styles.successMessage)
                            }}
                        >
                            {data.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Name - Sign Up Only */}

                        {isSignUp && <>
                        
                            <InputSet inputGroupStyle={styles.inputGroup} labelStyle={styles.label} labelText="Full Name" inputType="text" inputName="name" inputValue={formData.name} inputOnChange={handleChange} inputPlaceHolder="Please enter your name" inputStyle={styles.input} autoComplete="name"  />
                            <InputSet inputGroupStyle={styles.inputGroup} labelStyle={styles.label} labelText="Phone Number" inputType="tel" inputName="phone" inputValue={formData.phone} inputOnChange={handleChange} inputPlaceHolder="Please enter your number" inputStyle={styles.input} autoComplete="phone"  />
                        
                        </>}

                        {/* Gender */}

                        {/* <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div> */}

                        {/* Email */}

                            <InputSet inputGroupStyle={styles.inputGroup} labelStyle={styles.label} labelText="Email" inputType="email" inputName="email" inputValue={formData.email} inputOnChange={handleChange} inputPlaceHolder="Please enter your email id" inputStyle={styles.input} autoComplete="email"  />
                        

                        {/* Password */}

                        <div style={styles.inputGroup}>

                            <label style={styles.label}>
                                Password
                            </label>

                            <div style={styles.inputWrapper}>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    style={{
                                        ...styles.input,
                                        ...styles.passwordInput
                                    }}
                                    autoComplete={
                                        isSignUp
                                            ? "new-password"
                                            : "current-password"
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    style={styles.showButton}
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>

                            </div>

                        </div>

                        {/* Confirm Password */}

                        {isSignUp && (
                            <div style={styles.inputGroup}>

                                <label style={styles.label}>
                                    Confirm Password
                                </label>

                                <div style={styles.inputWrapper}>

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={
                                            formData.confirmPassword
                                        }
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        style={{
                                            ...styles.input,
                                            ...styles.passwordInput
                                        }}
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        style={styles.showButton}
                                    >
                                        {showConfirmPassword
                                            ? "HIDE"
                                            : "SHOW"}
                                    </button>

                                </div>

                            </div>
                        )}

                        {/* Forgot Password */}

                        {!isSignUp && (
                            <div style={styles.forgotPassword}>
                                Forgot Password?
                            </div>
                        )}

                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={data.loading}
                            style={{
                                ...styles.submitButton,
                                opacity: data.loading ? 0.7 : 1,
                                cursor: data.loading
                                    ? "not-allowed"
                                    : "pointer"
                            }}
                            onClick={() => isSignUp ? signupFun() : signinFun()}
                        >
                            {data.loading
                                ? "Please wait..."
                                : isSignUp
                                    ? "Create Account"
                                    : "Sign In"}
                        </button>

                    </form>

                    {/* Toggle */}

                    <div style={styles.switchText}>

                        {isSignUp
                            ? "Already have an account?"
                            : "Don't have an account?"}

                        <button
                            type="button"
                            onClick={toggleAuth}
                            style={styles.switchButton}
                        >
                            {isSignUp
                                ? "Sign In"
                                : "Create Account"}
                        </button>

                    </div>

                </div>

            </div>

            {/* Responsive CSS using style tag */}

            <style>
                {`
                    @media (max-width: 700px) {

                        * {
                            box-sizing: border-box;
                        }

                        body {
                            margin: 0;
                        }

                        .auth-card {
                            flex-direction: column;
                        }
                    }
                `}
            </style>

        </div>
    );
};

export default Auth;