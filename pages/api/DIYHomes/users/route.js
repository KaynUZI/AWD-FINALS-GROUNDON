import { NextResponse } from 'next/server';

// Sample data
const sampleUsers = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "user"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user"
    }
];

// GET /api/DIYHomes/users
export async function GET() {
    try {
        return NextResponse.json(sampleUsers);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/DIYHomes/users
export async function POST(request) {
    try {
        const body = await request.json();
        const newUser = {
            id: sampleUsers.length + 1,
            ...body
        };
        sampleUsers.push(newUser);
        return NextResponse.json(newUser);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/DIYHomes/users
export async function PUT(request) {
    try {
        const body = await request.json();
        const index = sampleUsers.findIndex(user => user.id === body.id);
        if (index !== -1) {
            sampleUsers[index] = { ...sampleUsers[index], ...body };
            return NextResponse.json(sampleUsers[index]);
        }
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/DIYHomes/users
export async function DELETE(request) {
    try {
        const body = await request.json();
        const index = sampleUsers.findIndex(user => user.id === body.id);
        if (index !== -1) {
            sampleUsers.splice(index, 1);
            return NextResponse.json({ message: "User deleted successfully" });
        }
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 