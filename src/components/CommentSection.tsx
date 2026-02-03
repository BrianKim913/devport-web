import { useState, useEffect } from 'react';
import type { Comment, CommentTreeNode } from '../types';
import {
  getCommentsByArticle,
  createComment,
  updateComment,
  deleteComment,
  type CommentResponse,
} from '../services/api';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCommentsByArticle(articleId);
      const tree = buildCommentTree(data);
      setComments(tree);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const buildCommentTree = (flatComments: CommentResponse[]): CommentTreeNode[] => {
    const commentMap = new Map<string, CommentTreeNode>();
    const rootComments: CommentTreeNode[] = [];

    // First pass: create nodes
    flatComments.forEach((comment) => {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
      });
    });

    // Second pass: build tree
    flatComments.forEach((comment) => {
      const node = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(node);
        } else {
          // Parent not found (shouldn't happen), treat as root
          rootComments.push(node);
        }
      } else {
        rootComments.push(node);
      }
    });

    return rootComments;
  };

  const handleCreateComment = async (content: string) => {
    try {
      await createComment(articleId, { content });
      await loadComments();
    } catch (err) {
      console.error('Failed to create comment:', err);
      throw err;
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      await createComment(articleId, { content, parentCommentId: parentId });
      await loadComments();
    } catch (err) {
      console.error('Failed to create reply:', err);
      throw err;
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      await updateComment(articleId, commentId, { content });
      await loadComments();
    } catch (err) {
      console.error('Failed to edit comment:', err);
      throw err;
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(articleId, commentId);
      await loadComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      throw err;
    }
  };

  const totalCommentCount = comments.reduce((count, comment) => {
    const countReplies = (node: CommentTreeNode): number => {
      return 1 + node.replies.reduce((sum, reply) => sum + countReplies(reply), 0);
    };
    return count + countReplies(comment);
  }, 0);

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-surface-border border-t-accent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-lg p-8">
        <p className="text-text-muted text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <h2 className="text-xl font-bold text-text-primary">
          댓글 {totalCommentCount > 0 && <span className="text-accent">{totalCommentCount}</span>}
        </h2>
      </div>

      {/* Comment form */}
      <CommentForm onSubmit={handleCreateComment} />

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
