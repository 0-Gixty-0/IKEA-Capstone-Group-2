'use client'

import React, {useEffect, useState} from 'react'
import styles from './styles.module.css'
import Link from 'next/link';
import {useRegisterUser} from "@/hooks/useRegisterUser";
import {SubmittableUser, UserRole} from "@/types";

/**
 * SignupForm component renders the signup form and handles requests to signup for an account
 * @returns Form with submit
 */
export default function RegisterForm() {
    const [signupName, setSignupName] = useState<string>('');
    const [signupEmail, setSignupEmail] = useState<string>('');
    const [signupPassword, setSignupPassword] = useState<string>('');
    const [signupUsername, setSignupUsername] = useState<string>('');
    const [valueError, setValueError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [validName, setValidName] = useState<boolean>(false)
    const [validEmail, setValidEmail] = useState<boolean>(false)
    const [validPassword, setValidPassword] = useState<boolean>(false)
    const [validUsername, setValidUsername] = useState<boolean>(false)
    const [showLoginRoute, setShowLoginRoute] = useState<boolean>(false)
    const [flash, setFlash] = useState<boolean>(false);

    const {registerUser, loading, error, success} = useRegisterUser();

    /**
     * Effect used to apply flash effect to valueError message.
     * Triggers on valueError message state updating.
     */
    useEffect(() => {
        if (error) {
            setValueError(error)
            setFlash(true);
            // Remove flash class after animation is complete
            const timer = setTimeout(() => setFlash(false), 1000); // Duration matches CSS animation
            return () => clearTimeout(timer);
        } else {
            setValueError(null)
            setFlash(false)
            setMessage(null)
        }
    }, [error]);

    /**
     * Effect for updating on success message.
     * Activates on success message changing
     */
    useEffect(() => {
        if (success) {
            setMessage('User created and saved!')
            setShowLoginRoute(true)
            setValueError(null);
        }
    }, [success]);

    /**
     * Validates inputted password to be of correct syntax.
     * Currently unused but can be extended to include certain number of
     * characters, symbols, numbers, max/min length, etc.
     * @param value Inputted password
     */
    const validatePassword = (value: string) => {
        if (value === '') {
            setValidPassword(false)
        } else {
            setValidPassword(true)
        }
    }

    /**
     * Validates inputted name to be of correct syntax.
     * Currently unused but can be extended to restrict to certain number of
     * characters, symbols, numbers, max/min length, etc.
     * @param value Inputted name
     */
    const validateName = (value: string) => {
        if (value === '') {
            setValidName(false)
        } else {
            setValidName(true)
        }
    }

    /**
     * Validates inputted username to be of correct syntax.
     * Currently unused but can be extended to restrict to certain number of
     * characters, symbols, numbers, max/min length, etc.
     * @param value Inputted username
     */
    const validateUsername = (value: string) => {
        if (value === '') {
            setValidUsername(false)
        } else {
            setValidUsername(true)
        }
    }

    /**
     * Validates inputted email to contain @ symbol preceded by any form of characters besides symbols
     * and succeeded by a dot and any form of characters besides symbols
     * @param value Inputted password to validate
     */
    const validateEmail = (value: string) => {
        const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
        setValidEmail(emailRegex.test(value))
    }

    /**
     * Handles creation of user. Attempts to run registerUser hook creating new user.
     * Default role of new user is standard "USER".
     * @param event Submit form event
     */
    const handleSubmitCreateUser = (event : React.FormEvent) => {
        const runCreate = async (event : React.FormEvent) => {
            event.preventDefault()
            setFlash(false)

            const userToSubmit: SubmittableUser = {
                id: null,
                email: signupEmail,
                username: signupUsername,
                password: signupPassword,
                name: signupName,
                roles: [UserRole.USER] // Default value for new user is standard user role
            }

            await registerUser(userToSubmit)
        }
        runCreate(event).catch((error) => {
            console.error("Error occurred while creating user:", error);
        });
    };

    return (
        <div data-testid='signup-form-wrapper' className={styles.wrapper}>
            <div data-testid='signup-form-container' className={styles.container}>
                <h2>Register New User</h2>
                <hr/>
                <form data-testid='signup-form-form' onSubmit={handleSubmitCreateUser}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            id="name"
                            type="text"
                            value={signupName}
                            onChange={(e) => {
                                setSignupName(e.target.value)
                                validateName(e.target.value)
                            }}
                            required
                            className={validName ? styles.modifiedInput : ''}
                        />
                    </div>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={signupUsername}
                            onChange={(e) => {
                                setSignupUsername(e.target.value)
                                validateUsername(e.target.value)
                            }}
                            required
                            className={validUsername ? styles.modifiedInput : ''}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={signupEmail}
                            onChange={(e) => {
                                setSignupEmail(e.target.value)
                                validateEmail(e.target.value)
                            }}
                            required
                            className={validEmail ? styles.modifiedInput : ''}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={signupPassword}
                            onChange={(e) => {
                                setSignupPassword(e.target.value)
                                validatePassword(e.target.value)
                            }}
                            required
                            className={validPassword ? styles.modifiedInput : ''}
                        />
                    </div>
                    {(validEmail && validPassword && validName && validUsername)
                        ? <button type="submit"
                                  className={success ? styles.disableSubmit : styles.submitButton}
                                  disabled={!!success}>Create Account
                          </button>
                        : <button className={styles.disableSubmit} disabled={true}>Create Account</button>
                    }
                </form>
                {valueError && <p className={`${styles.messageText} ${flash ? styles.flash : ''}`}>{valueError}</p>}
                {message && <p className={styles.message}>{message}</p>}
                {showLoginRoute && <Link href='/login'>To Login</Link>}
                {!showLoginRoute && (
                    <div>
                        <Link href='/login'>Already have an account? Login instead.</Link>
                    </div>
                )}
            </div>
        </div>
    )
}