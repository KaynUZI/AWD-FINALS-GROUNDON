'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/AdminForum.module.css';

export default function AdminForum() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/DIYHomes/forum');
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            setMessages(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteMessage = async (messageId) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        
        try {
            const response = await fetch(`/api/DIYHomes/forum/${messageId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete message');
            }

            // Refresh the messages list
            fetchMessages();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <h1>Admin Forum View</h1>
            <div className={styles.messages}>
                {messages.map(message => (
                    <div key={message.id} className={styles.message}>
                        <div className={styles.messageHeader}>
                            <span className={styles.userName}>{message.userName}</span>
                            <span className={styles.timestamp}>
                                {new Date(message.timestamp).toLocaleString()}
                            </span>
                            <button 
                                onClick={() => deleteMessage(message.id)}
                                className={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </div>
                        <p className={styles.content}>{message.content}</p>
                        
                        {message.replies && message.replies.length > 0 && (
                            <div className={styles.replies}>
                                <h3>Replies:</h3>
                                {message.replies.map(reply => (
                                    <div key={reply.id} className={styles.reply}>
                                        <div className={styles.replyHeader}>
                                            <span className={styles.userName}>{reply.userName}</span>
                                            <span className={styles.timestamp}>
                                                {new Date(reply.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className={styles.content}>{reply.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 