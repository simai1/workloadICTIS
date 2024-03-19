import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import Comment from '../models/comment.js';
import CommentDto from '../dtos/comment-dto.js';
import Educator from '../models/educator.js';

export default {
    async createComment({ body: { workloadId, text } }, res) {
        if (!workloadId) throw new AppErrorMissing('workloadId');
        if (!text) throw new AppErrorMissing('text');

        const comment = await Comment.create({
            workloadId,
            text,
        });
        res.json(comment);
    },

    async deleteComment({ params: { commentId } }, res) {
        if (!commentId) throw new AppErrorMissing('commentId');
        const comment = await Comment.findByPk(commentId);
        await comment.destroy({ force: true });
        res.status(200).json('Successfully checked');
    },

    async getAllComments(req, res) {
        const comments = await Comment.findAll({});

        const commentDtos = [];

        for (const comment of comments) {
            const commentsDto = new CommentDto(comment);
            commentDtos.push(commentsDto);
        }

        res.json(commentDtos);
    },
};
