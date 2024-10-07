'use client'

import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Link from 'next/link';

/**
 * SignupForm component renders the signup form and handles requests to signup for an account
 * @returns Form with submit
 */
export default function RegisterForm() {
    const [signupName, setSignupName] = useState<string>('');
    const [signupEmail, setSignupEmail] = useState<string>('');
    const [signupPassword, setSignupPassword] = useState<string>('');
    const [signupUsername, setSignupUsername] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [validName, setValidName] = useState<boolean>(false)
    const [validEmail, setValidEmail] = useState<boolean>(false)
    const [validPassword, setValidPassword] = useState<boolean>(false)
    const [validUsername, setValidUsername] = useState<boolean>(false)
    const [showLoginRoute, setShowLoginRoute] = useState<boolean>(false)
    const [flash, setFlash] = useState<boolean>(false);

    /**
     * Effect used to apply flash effect to error message.
     * Triggers on error message state updating.
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
     * Handles creation of user. Attempts to run saveUser server action.
     * On success sets success message and displays link to login route.
     * On failure sets error message and sets flash effect on error message
     * @param event Submit form event
     */
    const handleSubmitCreateUser = (event : React.FormEvent) => {
        const runCreate = async (event : React.FormEvent) => {
            event.preventDefault()
            setFlash(false)

            try {
                // TODO Update saveUser route to handle submit
                // await saveUser(signupName, signupEmail, signupPassword);
                setMessage('User created and saved!')
                setShowLoginRoute(true)
                setError(null);
            } catch (error) {
                setError('Failed to create user')
                setMessage(null)
                setFlash(true)
            }
        }
        runCreate(event)
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
                        ? <button type="submit" className={styles.submitButton}>Create Account</button>
                        : <button className={styles.disableSubmit} disabled={true}>Create Account</button>
                    }
                </form>
                {error && <p className={`${styles.messageText} ${flash ? styles.flash : ''}`}>{error}</p>}
                {message && <p>{message}</p>}
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