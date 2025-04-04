import { NextRequest, NextResponse } from "next/server";
import { PrismaClient as PostgresqlClient } from "@/../prisma/generated/postgresql";

const prisma = new PostgresqlClient();

// GET /api/DIYHomes/forum/replies/[reply_id] - Get a single reply, with pagination, search, and filtering
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

        const reply = await prisma.replyDIYHomes.findUnique({
            where: { id: params.reply_id }
        });

        if (!reply) {
            return NextResponse.json(
                { error: "Reply not found" },
                { status: 404 }
            );
        }

        const where = {
            postId: reply.postId,
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
            reply,
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
            { error: "Failed to fetch reply" },
            { status: 500 }
        );
    }
}

// DELETE /api/DIYHomes/forum/replies/[reply_id] - Delete a reply
export async function DELETE(request, { params }) {
    try {
        await prisma.replyDIYHomes.delete({
            where: { id: params.reply_id }
        });

        return NextResponse.json({ 
            message: "Reply deleted successfully" 
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete reply" },
            { status: 500 }
        );
    }
}

// PUT /api/DIYHomes/forum/replies/[reply_id] - Update a reply
export async function PUT(request, { params }) {
    try {
        const { content } = await request.json();

        if (!content) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const updatedReply = await prisma.replyDIYHomes.update({
            where: { id: params.reply_id },
            data: { content }
        });

        return NextResponse.json(updatedReply);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update reply" },
            { status: 500 }
        );
    }
} 