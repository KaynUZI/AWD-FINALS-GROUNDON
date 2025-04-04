import { NextRequest, NextResponse } from "next/server";
import { PrismaClient as PostgresqlClient } from "@/../prisma/generated/postgresql";

const prisma = new PostgresqlClient();

// GET /api/DIYHomes/forum/[post_id] - Get a single post with its replies, with pagination, search, and filtering
export async function GET(request, { params }) {
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
        const sortOrder = searchParams.get('sortOrder') || 'asc';

        const where = {
            postId: params.post_id,
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

        const [post, totalReplies] = await Promise.all([
            prisma.postDIYHomes.findUnique({
                where: { id: params.post_id },
                include: {
                    replies: {
                        where: search || userId || (startDate && endDate) ? {
                            OR: [
                                { content: { contains: search, mode: 'insensitive' } },
                                { userName: { contains: search, mode: 'insensitive' } }
                            ],
                            ...(userId ? { userId } : {}),
                            ...(startDate && endDate ? {
                                createdAt: {
                                    gte: new Date(startDate),
                                    lte: new Date(endDate)
                                }
                            } : {})
                        } : {},
                        orderBy: {
                            [sortBy]: sortOrder
                        },
                        skip,
                        take: limit
                    }
                }
            }),
            prisma.replyDIYHomes.count({ where })
        ]);

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            post,
            pagination: {
                total: totalReplies,
                page,
                limit,
                totalPages: Math.ceil(totalReplies / limit)
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 }
        );
    }
}

// DELETE /api/DIYHomes/forum/[post_id] - Delete a post
export async function DELETE(request, { params }) {
    try {
        // First delete all replies associated with the post
        await prisma.replyDIYHomes.deleteMany({
            where: { postId: params.post_id }
        });

        // Then delete the post
        await prisma.postDIYHomes.delete({
            where: { id: params.post_id }
        });

        return NextResponse.json({ 
            message: "Post and its replies deleted successfully" 
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete post" },
            { status: 500 }
        );
    }
}

// PUT /api/DIYHomes/forum/[post_id] - Update a post
export async function PUT(request, { params }) {
    try {
        const { content } = await request.json();

        if (!content) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const updatedPost = await prisma.postDIYHomes.update({
            where: { id: params.post_id },
            data: { content }
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update post" },
            { status: 500 }
        );
    }
} 