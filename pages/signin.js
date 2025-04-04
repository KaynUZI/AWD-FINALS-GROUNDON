import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/SignIn.module.css';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Attempting to sign in with:', { email });
            
            const response = await fetch('/api/DIYHomes/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Response from server:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('User data stored:', data.user);
            
            // Redirect to homepage after successful login
            router.push('/');

        } catch (err) {
            console.error('Sign in error:', err);
            setError(err.message || 'An error occurred during sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1>Sign In</h1>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p className={styles.signupLink}>
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
} 