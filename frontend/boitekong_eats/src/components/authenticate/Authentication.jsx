import React, { useState } from "react";
import "./auth.css";

const Authentication = ({ onClose }) => {
    const [authMode, setAuthMode] = useState("login");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        streetAddress: "", // Add streetAddress to the state
        selectedQuestions: [],
        answers: {},
        loginPhone: "",
        loginPassword: "",
        resetPhone: "",
        resetUsername: "",
        resetAnswers: {},
        newPassword: "",
    });

    const securityQuestions = [
        "What's the nickname your friends used for you?",
        "What was the name of the worst school teacher you ever had?",
        "What's the name of the street you grew up on?",
        "What's your favorite hangout spot in the neighborhood?",
        "What was your first cellphone model?",
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckboxChange = (question) => {
        const { selectedQuestions } = formData;
        if (selectedQuestions.includes(question)) {
            setFormData({
                ...formData,
                selectedQuestions: selectedQuestions.filter((q) => q !== question),
            });
        } else if (selectedQuestions.length < 2) {
            setFormData({
                ...formData,
                selectedQuestions: [...selectedQuestions, question],
            });
        }
    };

    const handleAnswerChange = (question, value) => {
        setFormData((prevData) => ({
            ...prevData,
            answers: {
                ...prevData.answers,
                [question]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (authMode === "register") {
            // Handle registration logic
        } else if (authMode === "login") {
            // Handle login logic
        } else if (authMode === "reset") {
            if (!formData.resetPhone || !formData.resetUsername) {
                alert("Please enter both phone number and username.");
                return;
            }
            // Simulate API call to fetch security questions based on phone and username
            setFormData((prevData) => ({
                ...prevData,
                selectedQuestions: securityQuestions.slice(0, 2), // Mocked selection for testing
            }));
        } else if (authMode === "newPassword") {
            // Send security answers and new password to backend
            console.log("Submitting new password:", formData.newPassword);
        }
    };

    return (
        <div className="auth-container">
            {authMode === "register" && (
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Register</h2>
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                    <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
                    <input type="text" name="streetAddress" placeholder="Street Address" value={formData.streetAddress} onChange={handleInputChange} required /> {/* New input field */}
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />

                    <p>Select 2 security questions:</p>
                    {securityQuestions.map((question) => (
                        <div key={question} className="question-option">
                            <input
                                type="checkbox"
                                id={question}
                                checked={formData.selectedQuestions.includes(question)}
                                onChange={() => handleCheckboxChange(question)}
                                disabled={!formData.selectedQuestions.includes(question) && formData.selectedQuestions.length === 2}
                            />
                            <label htmlFor={question}>{question}</label>
                            {formData.selectedQuestions.includes(question) && (
                                <input
                                    type="text"
                                    placeholder="Your Answer"
                                    value={formData.answers[question] || ""}
                                    onChange={(e) => handleAnswerChange(question, e.target.value)}
                                    required
                                />
                            )}
                        </div>
                    ))}

                    <button type="submit">Register</button>
                    <p onClick={() => setAuthMode("login")}>Already have an account? Login</p>
                </form>
            )}

            {authMode === "login" && (
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Login</h2>
                    <input type="text" name="loginPhone" placeholder="Phone" value={formData.loginPhone} onChange={handleInputChange} required />
                    <input type="password" name="loginPassword" placeholder="Password" value={formData.loginPassword} onChange={handleInputChange} required />
                    <button type="submit">Login</button>
                    <p onClick={() => setAuthMode("reset")}>Forgot password?</p>
                    <p onClick={() => setAuthMode("register")}>Don't have an account? Register</p>
                </form>
            )}

            {authMode === "reset" && (
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Reset Password</h2>
                    <input
                        type="text"
                        name="resetPhone"
                        placeholder="Phone"
                        value={formData.resetPhone}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="resetUsername"
                        placeholder="Username"
                        value={formData.resetUsername}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Submit</button>
                    <p onClick={() => setAuthMode("login")}>Back to Login</p>
                </form>
            )}

            {authMode === "newPassword" && (
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Answer Security Questions</h2>
                    {formData.selectedQuestions.map((question) => (
                        <div key={question} className="question-option">
                            <label>{question}</label>
                            <input
                                type="text"
                                placeholder="Your Answer"
                                value={formData.resetAnswers[question] || ""}
                                onChange={(e) => setFormData((prevData) => ({
                                    ...prevData,
                                    resetAnswers: { ...prevData.resetAnswers, [question]: e.target.value },
                                }))}
                                required
                            />
                        </div>
                    ))}
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Submit New Password</button>
                    <p onClick={() => setAuthMode("login")}>Back to Login</p>
                </form>
            )}
            <button className="close-button" onClick={onClose}>Close</button> 
        </div>
    );
};

export default Authentication;
