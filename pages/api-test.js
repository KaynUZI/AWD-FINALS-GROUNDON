'use client';

import { useState } from 'react';
import styles from '../styles/APITest.module.css';

export default function APITest() {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const testForumAPI = async () => {
        setLoading(true);
        try {
            // Test GET all messages
            const getResponse = await fetch('/api/DIYHomes/forum');
            const getData = await getResponse.json();
            
            setResponse(JSON.stringify(getData, null, 2));
        } catch (error) {
            setResponse(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Forum API Test</h1>
            <button 
                onClick={testForumAPI} 
                disabled={loading}
                className={styles.testButton}
            >
                {loading ? 'Testing...' : 'Test Forum API'}
            </button>
            
            <div className={styles.response}>
                <h2>API Response:</h2>
                <pre>{response || 'No response yet'}</pre>
            </div>
        </div>
    );
} 