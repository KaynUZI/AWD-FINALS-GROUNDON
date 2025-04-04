import { NextRequest, NextResponse } from "next/server";
import { PrismaClient as PostgresqlClient } from "@/../prisma/generated/postgresql";

const prisma = new PostgresqlClient();

// GET /api/DIYHomes/forum - Get all posts with their replies, sorted by most recent, with pagination, search, and filtering
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';
        const userId = searchParams.get('userId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const where = {
            ...(search ? {
                OR: [
                    { content: { contains: search, mode: 'insensitive' } },
                    { userName: { contains: search, mode: 'insensitive' } }
                ]
            } : {}),
            ...(userId ? { userId } : {}),
            ...(startDate && endDate ? {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            } : {})
        };

        const [posts, total] = await Promise.all([
            prisma.postDIYHomes.findMany({
                where,
                include: {
                    replies: {
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }
                },
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit
            }),
            prisma.postDIYHomes.count({ where })
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

// POST /api/DIYHomes/forum - Create a new post
export async function POST(request) {
    try {
        const { content, userId, userName } = await request.json();

        if (!content || !userId || !userName) {
            return NextResponse.json(
                { error: "Content, userId, and userName are required" },
                { status: 400 }
            );
        }

        const newPost = await prisma.postDIYHomes.create({
            data: {
                content,
                userId,
                userName
            }
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}

// POST /api/DIYHomes/forum/reply - Add a reply to a post
export async function POST(request) {
    try {
        const body = await request.json();
        
        if (!body.postId || !body.content || !body.userId || !body.userName) {
            return NextResponse.json(
                { error: "postId, content, userId, and userName are required" },
                { status: 400 }
            );
        }

        const reply = await prisma.replyDIYHomes.create({
            data: {
                content: body.content,
                userId: body.userId,
                userName: body.userName,
                postId: body.postId
            }
        });

        return NextResponse.json(reply);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create reply" },
            { status: 500 }
        );
    }
}