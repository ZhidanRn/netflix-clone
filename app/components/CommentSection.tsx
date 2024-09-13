'use client'

import { useState, useEffect } from "react";
import { addComment, getComments } from "../action";
import Image from "next/image";

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        name: string;
        image?: string;
    };
}

interface CommentSectionProps {
    movieId: number;
    userId: string;
}

export default function CommentSection({ movieId, userId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");

    useEffect(() => {
        async function fetchComments() {
            const comments = await getComments(movieId);
            const transformedComments = comments.map((comment) => ({
                ...comment,
                user: {
                    ...comment.user,
                    name: comment.user.name ?? '',
                    image: comment.user.image ?? undefined,
                },
            }));
            setComments(transformedComments);
        }
        fetchComments();
    }, [movieId]);

    const handleCommentSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!newComment.trim()) return; 

        const formData = new FormData();
        formData.append("content", newComment);
        formData.append("userId", userId);
        formData.append("movieId", movieId.toString());

        await addComment(formData);

        setNewComment("");
        const updatedComments = await getComments(movieId);
        const transformedComments = updatedComments.map((comment) => ({
        ...comment,
        user: {
            ...comment.user,
            name: comment.user.name ?? '',
            image: comment.user.image ?? undefined,
        },
        }));
        setComments(transformedComments);
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <div className="space-y-4 mb-4">
                {comments.map(comment => (
                    <div key={comment.id} className="border-b border-gray-200 pb-4">
                        <div className="flex items-start space-x-3">
                            {comment.user.image && (
                                <Image
                                    src={comment.user.image}
                                    alt={comment.user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}
                            <div>
                                <div className="font-semibold text-lg">{comment.user.name}</div>
                                <p className="mt-1 text-gray-600">{comment.content}</p>
                                <p className="mt-1 text-xs text-gray-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center">
                <input
                    type="text"
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
