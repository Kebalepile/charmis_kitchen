import React, { useState } from "react";
import "./auth.css";

const Authentication = () => {
    const [authMode, setAuthMode] = useState("login");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        selectedQuestions: [],
        answers: {},
        loginPhone: "",
        loginPassword: "",
        resetAnswers: {},
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
        setFormData({ ...formData, [name]: value });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        if (authMode === "register") {
            // Handle registration logic
        } else if (authMode === "login") {
            // Handle login logic
        } else if (authMode === "reset") {
            // Handle reset password logic
        }
    };

    return (
        <div className="auth-container">
            {authMode === "register" && (
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Register</h2>
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                    <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
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
                    <p>Answer your security questions:</p>
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
                    <button type="submit">Submit Answers</button>
                    <p onClick={() => setAuthMode("login")}>Back to Login</p>
                </form>
            )}
        </div>
    );
};

export default Authentication;
