import { NextResponse } from 'next/server';

// Sample user database (in a real app, this would be in a database)
const users = [
    {
        id: 1,
        email: "admin@example.com",
        password: "admin123", // In real app, this would be hashed
        name: "Admin User",
        role: "admin"
    },
    {
        id: 2,
        email: "user@example.com",
        password: "user123", // In real app, this would be hashed
        name: "Regular User",
        role: "user"
    }
];

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Find user by email
        const user = users.find(u => u.email === email);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check password (in real app, compare hashed passwords)
        if (user.password !== password) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        // Return user data without password
        return NextResponse.json({
            user: userWithoutPassword,
            message: "Login successful"
        });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 