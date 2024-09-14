'use client'

import { useState, useEffect } from "react";
import { addComment, getComments } from "../action";
import Image from "next/image";
import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        name: string;
        image?: string;
    };
    replies?: Comment[];
    parentId?: string | null;
}

interface CommentSectionProps {
    movieId: number;
    userId: string;
}

function timeAgo(dateValue: Date) {
    const seconds = Math.floor((new Date().getTime() - dateValue.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return `${interval} minutes ago`;
    }
    return `${Math.floor(seconds)} seconds ago`;
}

export default function CommentSection({ movieId, userId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [replyState, setReplyState] = useState<{[key: string]: string}>({});

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
                replies: comment.replies.map(reply => ({
                    ...reply,
                    user: {
                        ...reply.user,
                        name: reply.user.name ?? '',
                        image: reply.user.image ?? undefined,
                    }
                })),
            }));
            setComments(transformedComments);
        }
        fetchComments();
    }, [movieId]);

    const handleCommentSubmit = async (event: React.FormEvent, parentId: string | null = null ) => {
        event.preventDefault();

        const content = parentId ? replyState[parentId] : newComment;
    
        if (!content.trim()) return; 
    
        const formData = new FormData();
        formData.append("content", content);
        formData.append("userId", userId);
        formData.append("movieId", movieId.toString());
        formData.append("parentId", parentId || '');
    
        try {
            await addComment(formData);
            
            if (parentId) {
                setReplyState((prev) => ({
                    ...prev,
                    [parentId]: '',
                }))
            } else {
                setNewComment('');
            }

            const updatedComments = await getComments(movieId);
            const transformedComments = updatedComments.map((comment) => ({
                ...comment,
                user: {
                    ...comment.user,
                    name: comment.user.name ?? '',
                    image: comment.user.image ?? undefined,
                },
                replies: comment.replies.map(reply => ({
                    ...reply,
                    user: {
                        ...reply.user,
                        name: reply.user.name ?? '',
                        image: reply.user.image ?? undefined,
                    }
                })) ?? [],
            }));
            setComments(transformedComments);
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        }
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleReply = (commentId: string) => {
        setReplyState(prev => ({
            ...prev,
            [commentId]: '',
        }));
    };

    const handleCancel = (commentId: string) => {
        setReplyState(prev => {
          const newState = { ...prev };
          delete newState[commentId];
          return newState;
        });
    };

    return (
        <div className=" my-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">All Comments</h2>

            <form onSubmit={(e) => handleCommentSubmit(e)} className="flex gap-2 items-center">
                <input
                    type="text"
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 bg-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                />
                <Button
                    variant="outline"
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Post
                </Button>
            </form>
            
            <div className="space-y-4 mt-4">
                {comments.map(comment => (
                    <div key={comment.id} className="border-b pb-4">
                        <div className="flex items-start space-x-3">
                            {comment.user.image && (
                                <Image
                                    src={comment.user.image}
                                    alt={comment.user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                            )}
                            <div className="flex flex-col w-full">
                                <div className="my-2">
                                    <p className="font-semibold text-lg">
                                        {comment.user.name}
                                        <span className="ml-1 text-sm text-gray-400">&bull; {timeAgo(comment.createdAt)}</span> 
                                    </p>
                                    <p>{comment.content}</p>
                                </div>

                                <button 
                                    onClick={() => handleReply(comment.id)} 
                                    className="flex items-center space-x-2 text-xs text-gray-400"
                                >
                                    <PencilLine className="mr-1 text-xs h-4 w-4 " />
                                    <p>Reply</p>
                                </button>

                                {replyState[comment.id] !== undefined && (
                                        <form onSubmit={(e) => handleCommentSubmit(e, comment.id)} className="flex gap-2 items-center mt-2">
                                            <input
                                                type="text"
                                                value={replyState[comment.id]}
                                                onChange={(e) => setReplyState(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                                placeholder={`Reply to ${comment.user.name}`}
                                                className="flex-1 px-4 py-2 bg-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                required
                                            />
                                            <Button 
                                                type="button"
                                                variant={"outline"} 
                                                onClick={() => handleCancel(comment.id)} 
                                                className="px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={!replyState[comment.id].trim()}
                                                variant={"outline"}
                                                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                Reply
                                            </Button>
                                        </form>
                                )}

                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-4 ml-4">
                                        {comment.replies.map(reply => (
                                            <div key={reply.id} className="border-b pb-4">
                                                <div className="flex items-start space-x-3">
                                                    {reply.user.image && (
                                                        <Image
                                                            src={reply.user.image}
                                                            alt={reply.user.name || 'User'}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full object-cover"
                                                        />
                                                    )}
                                                    <div className="flex flex-col w-full">
                                                        <div className="my-2">
                                                            <p className="font-semibold text-lg">
                                                                {reply.user.name}
                                                                <span className="ml-1 text-sm text-gray-400">&bull; {timeAgo(reply.createdAt)}</span> 
                                                            </p>
                                                            <p>{reply.content}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
