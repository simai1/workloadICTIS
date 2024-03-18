import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import Comment from '../models/comment.js';
import CommentDto from '../dtos/comment-dto.js';
import Educator from '../models/educator.js';

export default {
    async createComment({ body: { educatorId, workloadId, text } }, res) {
        if (!educatorId) throw new AppErrorMissing('educatorId');
        if (!workloadId) throw new AppErrorMissing('workloadId');
        if (!text) throw new AppErrorMissing('text');

        const comment = await Comment.create({
            educatorId,
            workloadId,
            text,
        });
        res.status(200).json('Okay');
    },

    async deleteComment({ params: { commentId } }, res) {
        if (!commentId) throw new AppErrorMissing('commentId');
        const comment = await Comment.findByPk(commentId);
        await comment.destroy({ force: true });
        res.status(200).json('Successfully checked');
    },

    async getAllComments(req, res) {
        const comments = await Comment.findAll({
            include: [{ model: Educator }],
        });

        const commentDtos = [];

        for (const comment of comments) {
            const commentsDto = new CommentDto(comment);
            commentDtos.push(commentsDto);
        }

        // console.log(comments);
        res.json(commentDtos);
    },
};

// Todo Check

// ToDo getAll
