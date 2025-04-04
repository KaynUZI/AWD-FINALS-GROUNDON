import { NextResponse } from 'next/server';

// Sample data
const samplePosts = [
    {
        id: 1,
        title: "How to Build a Bookshelf",
        content: "Step by step guide to building your own bookshelf...",
        authorId: 1,
        images: ["bookshelf1.jpg", "bookshelf2.jpg"],
        createdAt: "2024-04-01T10:00:00Z"
    },
    {
        id: 2,
        title: "DIY Garden Planter",
        content: "Create a beautiful garden planter with these simple steps...",
        authorId: 2,
        images: ["planter1.jpg", "planter2.jpg"],
        createdAt: "2024-04-02T15:30:00Z"
    }
];

// GET /api/DIYHomes/posts
export async function GET() {
    try {
        return NextResponse.json(samplePosts);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/DIYHomes/posts
export async function POST(request) {
    try {
        const body = await request.json();
        const newPost = {
            id: samplePosts.length + 1,
            createdAt: new Date().toISOString(),
            ...body
        };
        samplePosts.push(newPost);
        return NextResponse.json(newPost);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/DIYHomes/posts
export async function PUT(request) {
    try {
        const body = await request.json();
        const index = samplePosts.findIndex(post => post.id === body.id);
        if (index !== -1) {
            samplePosts[index] = { ...samplePosts[index], ...body };
            return NextResponse.json(samplePosts[index]);
        }
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/DIYHomes/posts
export async function DELETE(request) {
    try {
        const body = await request.json();
        const index = samplePosts.findIndex(post => post.id === body.id);
        if (index !== -1) {
            samplePosts.splice(index, 1);
            return NextResponse.json({ message: "Post deleted successfully" });
        }
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 