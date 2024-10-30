"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { useLogin } from "@/hooks/useLoginUser";

/**
 * LoginForm component is used to handle login of a user through form fields.
 * @returns LoginForm components
 */
export default function LoginForm() {
  const { handleSignIn, loading, error } = useLogin();
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);

  /**
   * Flash effect for error message. Triggers on changes made to error state
   */
  useEffect(() => {
    if (error) {
      setFlash(true);
      // Remove flash class after animation is complete
      const timer = setTimeout(() => setFlash(false), 1000); // Duration matches CSS animation
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Handles a login attempt. Calls login server action and on success redirects.
   * On error the error message is updated and flash effect is triggered.
   * @param event Event passed from form submit
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFlash(false);
    await handleSignIn(loginUsername, loginPassword);
  };

  /**
   * Validates inputted password to be of correct syntax.
   * Currently unused but can be extended to include certain number of
   * characters, symbols, numbers, max/min length, etc.
   * @param value Inputted password
   */
  const validatePassword = (value: string) => {
    if (value === "") {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  };

  /**
   * Handles a specific error that occurs when the credentials aren't in the database
   * @param error
   * @returns "Invalid username or password" to display as error to the user
   */

  const handleError = (error: string) => {
    if (error == "CredentialsSignin") {
      return "Invalid username or password";
    }
  };
  /**
   * Client logic to validate inputed username, currently only rule is not an empty string.
   * @param value
   */
  const validateUsername = (value: string) => {
    if (value === "") {
      setValidUsername(false);
    } else {
      setValidUsername(true);
    }
  };

  return (
    <div data-testid="login-form-wrapper" className={styles.wrapper}>
      <div data-testid="login-form-container" className={styles.container}>
        <h2>Login</h2>
        <form data-testid="login-form-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="sername"
              value={loginUsername}
              onChange={(e) => {
                setLoginUsername(e.target.value);
                validateUsername(e.target.value);
              }}
              required
              className={validUsername ? styles.modifiedInput : ""}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
              className={validPassword ? styles.modifiedInput : ""}
            />
          </div>
          {validUsername && validPassword ? (
            <button type="submit" className={styles.submitButton}>
              Login
            </button>
          ) : (
            <button className={styles.disableSubmit} disabled={true}>
              Login
            </button>
          )}
        </form>
        {error && (
          <p className={`${styles.messageText} ${flash ? styles.flash : ""}`}>
            {handleError(error)}
          </p>
        )}
        {message && <p>{message}</p>}
        <div>
          <Link href="/register">Create new user</Link>
        </div>
      </div>
    </div>
  );
}
