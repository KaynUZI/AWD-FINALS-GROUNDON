import { useState, useEffect } from 'react';
import styles from '../styles/APIDisplay.module.css';

export default function APIDisplay() {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (endpoint) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/DIYHomes/${endpoint}`);
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleFetchUsers = async () => {
        const data = await fetchData('users');
        if (data) setUsers(data);
    };

    const handleFetchPosts = async () => {
        const data = await fetchData('posts');
        if (data) setPosts(data);
    };

    const handleFetchReports = async () => {
        const data = await fetchData('reports');
        if (data) setReports(data);
    };

    return (
        <div className={styles.container}>
            <h1>DIYHomes API Display</h1>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.section}>
                <h2>Users</h2>
                <button onClick={handleFetchUsers} disabled={loading}>
                    {loading ? 'Loading...' : 'Fetch Users'}
                </button>
                <pre className={styles.response}>
                    {JSON.stringify(users, null, 2)}
                </pre>
            </div>

            <div className={styles.section}>
                <h2>Posts</h2>
                <button onClick={handleFetchPosts} disabled={loading}>
                    {loading ? 'Loading...' : 'Fetch Posts'}
                </button>
                <pre className={styles.response}>
                    {JSON.stringify(posts, null, 2)}
                </pre>
            </div>

            <div className={styles.section}>
                <h2>Reports</h2>
                <button onClick={handleFetchReports} disabled={loading}>
                    {loading ? 'Loading...' : 'Fetch Reports'}
                </button>
                <pre className={styles.response}>
                    {JSON.stringify(reports, null, 2)}
                </pre>
            </div>
        </div>
    );
} 