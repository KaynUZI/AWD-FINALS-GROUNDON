import { NextRequest, NextResponse } from "next/server";
import { PrismaClient as PostgresqlClient } from "@/../prisma/generated/postgresql";

const prisma = new PostgresqlClient();

// GET /api/DIYHomes/forum/replies - Get all replies of a specific post, with pagination, search, and filtering
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';
        const userId = searchParams.get('userId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || postId ? 'asc' : 'desc';

        const where = {
            ...(postId ? { postId } : {}),
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

        const [replies, total] = await Promise.all([
            prisma.replyDIYHomes.findMany({
                where,
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take: limit
            }),
            prisma.replyDIYHomes.count({ where })
        ]);

        return NextResponse.json({
            replies,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch replies" },
            { status: 500 }
        );
    }
}

// POST /api/DIYHomes/forum/replies - Create a new reply
export async function POST(request) {
    try {
        const { postId, content, userId, userName } = await request.json();

        if (!postId || !content || !userId || !userName) {
            return NextResponse.json(
                { error: "postId, content, userId, and userName are required" },
                { status: 400 }
            );
        }

        const newReply = await prisma.replyDIYHomes.create({
            data: {
                postId,
                content,
                userId,
                userName
            }
        });

        return NextResponse.json(newReply, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create reply" },
            { status: 500 }
        );
    }
} 