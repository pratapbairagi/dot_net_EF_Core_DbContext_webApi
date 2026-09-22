
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
// import { NavLink } from "react-router-dom";



const Header = () => {

const navigate = useNavigate();
const { isLoggedIn, logout } = useAuth();
    const [isMobile, setIsMobile] = useState(
        window.innerWidth <= 768
    );

    const [menuOpen, setMenuOpen] = useState(false);

    // =========================
    // Detect Screen Size
    // =========================
    useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);

            // Close menu when switching to desktop
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, []);

    // =========================
    // Styles
    // =========================

    const styles = {

        header: {
            position: "sticky",
            top: "0",
            zIndex: "1000",
            width: "100%",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)"
        },

        container: {
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile
                ? "0 18px"
                : "0 30px",
            minHeight: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box"
        },

        // =========================
        // Logo
        // =========================

        logo: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "#222222",
            cursor: "pointer"
        },

        logoIcon: {
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background:
                "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: "700"
        },

        logoText: {
            fontSize: "21px",
            fontWeight: "700",
            color: "#222222",
            whiteSpace: "nowrap"
        },

        // =========================
        // Desktop Navigation
        // =========================

        desktopRight: {
            display: "flex",
            alignItems: "center",
            gap: "12px"
        },

        loginButton: {
            width: "max-content",
            // minWidth: "90px",
            height: "40px",
            lineHeight: "40px",
            padding: "0 18px",
            border: "1px solid #667eea",
            borderRadius: "7px",
            backgroundColor: "#ffffff",
            color: "#667eea",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s"
        },

        signupButton: {
            minWidth: "90px",
            height: "40px",
            padding: "0 18px",
            border: "1px solid #667eea",
            borderRadius: "7px",
            background:
                "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s"
        },

        // =========================
        // Hamburger
        // =========================

        hamburger: {
            width: "42px",
            height: "42px",
            border: "1px solid #dddddd",
            borderRadius: "7px",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer"
        },

        hamburgerLine: {
            width: "20px",
            height: "2px",
            backgroundColor: "#333333",
            borderRadius: "2px"
        },

        // =========================
        // Mobile Menu
        // =========================

        mobileMenu: {
            width: "100%",
            padding: "15px 18px 20px",
            borderTop: "1px solid #eeeeee",
            backgroundColor: "#ffffff",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        },

        mobileButton: {
            width: "100%",
            height: "44px",
            borderRadius: "7px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
        }
    };

    // =========================
    // Button Handlers
    // =========================

    const handleLogin = () => {
        console.log("Login clicked");


        // Example:
        // navigate("/login");
    };

    const handleSignup = () => {
        console.log("Signup clicked");

        // Example:
        // navigate("/signup");
    };

    return (

        <header style={styles.header}>

            {/* =========================
                Main Header
            ========================== */}

            <div style={styles.container}>

                {/* LOGO */}

                <NavLink
                    style={styles.logo}
                    to="/"
                >

                    <div style={styles.logoIcon}>
                        A
                    </div>

                    <span style={styles.logoText}>
                        MyApp
                    </span>

                </NavLink>


                {/* =========================
                    DESKTOP BUTTONS
                ========================== */}

                {!isMobile && (

                    <div style={styles.desktopRight}>
                        {isLoggedIn ?
                            <button style={styles.loginButton} onClick={async () => { await logout(); navigate("/auth"); }}>
                                Logout
                            </button> :
                            <NavLink
                                type="button"
                                style={styles.loginButton}
                                // onClick={handleLogin}
                                to="/auth"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "#667eea";
                                    e.currentTarget.style.color =
                                        "#ffffff";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "#ffffff";
                                    e.currentTarget.style.color =
                                        "#667eea";
                                }}
                            >
                                Account
                            </NavLink>
                        }


                    </div>

                )}


                {/* =========================
                    MOBILE HAMBURGER
                ========================== */}

                {isMobile && (

                    <button
                        type="button"
                        style={styles.hamburger}
                        onClick={() =>
                            setMenuOpen((prev) => !prev)
                        }
                        aria-label="Toggle menu"
                    >

                        <span style={styles.hamburgerLine}></span>
                        <span style={styles.hamburgerLine}></span>
                        <span style={styles.hamburgerLine}></span>

                    </button>

                )}

            </div>


            {/* =========================
                MOBILE MENU
            ========================== */}

            {isMobile && menuOpen && (

                <div style={styles.mobileMenu}>

                    <button
                        type="button"
                        style={{
                            ...styles.mobileButton,
                            border: "1px solid #667eea",
                            backgroundColor: "#ffffff",
                            color: "#667eea"
                        }}
                        onClick={() => {
                            handleLogin();
                            setMenuOpen(false);
                        }}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        style={{
                            ...styles.mobileButton,
                            border: "1px solid #667eea",
                            background:
                                "linear-gradient(135deg, #667eea, #764ba2)",
                            color: "#ffffff"
                        }}
                        onClick={() => {
                            handleSignup();
                            setMenuOpen(false);
                        }}
                    >
                        Sign Up
                    </button>

                </div>

            )}

        </header>
    );
};

export default Header;
