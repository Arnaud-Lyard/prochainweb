import { IUser } from '../user/user.type';
import { PostRepository } from './post.repository';
import { File } from '../types/file';
import { PostStatusEnumType } from '@prisma/client';
import { IPostUpdateDto } from './post.dto';
import AppError from '../utils/appError';
import { UserRepository } from '../user/user.repository';
import { removeResizedImages } from '../utils/removeImage';
import { AddPostInput, AddResponseInput, EditPostInput, GetPostInput, PublishPostInput } from './post.schema';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { promisify } from 'util';
import Email from '../utils/email';

export const postService = {
  postRepository: new PostRepository(),
  userRepository: new UserRepository(),

  addPost: async ({
    user,
    frenchContent,
    englishContent,
    frenchTitle,
    englishTitle,
    frenchDescription,
    englishDescription,
    slug,
    categoryIds,
    image,
    req,
    next,
  }: {
    user: IUser;
    frenchContent: string;
    englishContent: string;
    frenchTitle: string;
    englishTitle: string;
    frenchDescription: string;
    englishDescription: string;
    slug: string;
    categoryIds: string[];
    image: File | undefined;
    req: Request<{}, {}, AddPostInput>,
    next: NextFunction;
  }) => {
    try {
      const users = await postService.userRepository.findAll();
      const post = await postService.postRepository.create({
        user,
        frenchContent,
        englishContent,
        frenchDescription,
        englishDescription,
        frenchTitle,
        englishTitle,
        slug,
        categoryIds,
        image: image!.filename,
        users,
      });

      return post;
    } catch (err: any) {
      throw new AppError(400, 'Error while creating post.');
    }
  },

  addCategory: async ({ name }: { name: string }) => {
    return await postService.postRepository.createCategory({
      name,
    });
  },

  getAllCategories: async () => {
    return await postService.postRepository.getAllCategories();
  },

  getAllPosts: async () => {
    return await postService.postRepository.getAllPosts();
  },

  checkIfPostExist: async (id: string) => {
    return await postService.postRepository.getPostById(id);
  },

  changePostStatus: async ({
    req,
    status,
    next,
  }: {
    req: Request<PublishPostInput>;
    status: PostStatusEnumType;
    next: NextFunction;
  }) => {
    try {
      const postExist = await postService.checkIfPostExist(req.params.id);

      if (!postExist) {
        throw new AppError(404, 'Post not found.');
      }

      const postUpdated = await postService.postRepository.changeStatusByPostId({
        id: postExist.id,
        status,
      });

      if (status === 'published' && postUpdated.status === 'published') {
        const users = await postService.userRepository.findUsersWithMailSubscription();
        users.forEach(async (user) => {
          try {
            await new Email(
              user,
              `${process.env.CLIENT_URL}/articles/${postExist.slug}`,
            ).sendNewPostMessage(req.language);
          } catch (error) {
            return next(
              new AppError(
                500,
                req.language === 'fr'
                  ? 'Impossible d envoyer le message de nouveau article'
                  : 'Could not send new article message'
              )
            );
          }
        });
      }

    } catch (err: any) {
      throw new AppError(400, 'Error while updating post.');
    }
  },

  getPost: async (req: Request<GetPostInput>) => {
    return await postService.postRepository.getPostById(req.params.id);
  },

  editPost: async ({
    user,
    req,
  }: {
    user: IUser;
    req: Request<EditPostInput['params'], {}, EditPostInput['body']>;
  }) => {
    const postUpdate: IPostUpdateDto = {
      id: req.params.id,
      frenchContent: req.body.frenchContent,
      englishContent: req.body.englishContent,
      frenchTitle: req.body.frenchTitle,
      englishTitle: req.body.englishTitle,
      frenchDescription: req.body.frenchDescription,
      englishDescription: req.body.englishDescription,
      slug: req.body.slug,
      categoryIds: req.body.categoryIds,
      image: null,
    };
    const fileAttached = req.file;
    try {
      const postHasImage = await postService.postRepository.findByPostId(
        postUpdate.id
      );

      if (!postHasImage) {
        throw new AppError(404, 'Post not found.');
      }

      if (!fileAttached && postHasImage.image) {
        postUpdate.image = postHasImage.image;
      }

      if (fileAttached && postHasImage.image) {
        postUpdate.image = fileAttached.filename;
        await removeResizedImages({
          filename: postHasImage.image,
          environment: process.env.NODE_ENV!,
        });
      }
      await postService.postRepository.updatePost(postUpdate);
    } catch (err: any) {
      throw new AppError(400, 'Error while updating post.');
    }
  },

  getPublishPosts: async () => {
    return await postService.postRepository.getPublishPosts();
  },

  getPostBySlug: async (req: Request<{ slug: string }>) => {
    return await postService.postRepository.getPostBySlug(req.params.slug);
  },

  getNewPosts: async ({ user }: { user: IUser }) => {
    return await postService.postRepository.getNewPosts({ user });
  },

  resetNewPosts: async ({ user }: { user: IUser }) => {
    const posts = await postService.postRepository.findAll();
    return await postService.postRepository.resetNewPosts({ posts, user });
  },

  addComment: async ({ user, req }: { user: IUser; req: Request }) => {
    const comment = await postService.postRepository.addComment({
      user,
      postId: req.body.postId,
      comment: req.body.comment,
    });
  },

  getComments: async (req: Request) => {
    return await postService.postRepository.getComments(req.params.postid);
  },

  addResponse: async ({ user, req, next }: { user: IUser; req: Request<AddResponseInput['params'], {}, AddResponseInput['body']>, next: NextFunction }) => {

    const response = await postService.postRepository.addResponse({
      user,
      postId: req.params.postid,
      comment: req.body.comment,
      parentId: req.body.parentId,
    });

    const parentComment = await postService.postRepository.getComment(req.body.parentId);
    const post = await postService.postRepository.getPostById(req.params.postid);
    const parentCommentuser = await postService.userRepository.findUser(parentComment.userId);
    if (parentCommentuser.mailSubscription && user.id !== parentCommentuser.id) {
      try {
        await new Email(
          parentCommentuser,
          `${process.env.CLIENT_URL}/articles/${post!.slug}`,
        ).sendNewCommentMessage(req.language);
      } catch (error) {
        return next(
          new AppError(
            500,
            req.language === 'fr'
              ? "Impossible d envoyer le message d'ajout de réponse au commentaire"
              : 'Could not send new comment message'
          )
        );
      }
    }

    return response;
  },

  getNewComment: async ({ user }: { user: IUser }) => {
    return await postService.postRepository.getNewComment({ user });
  },

  resetNewComment: async ({ user }: { user: IUser }) => {
    return await postService.postRepository.resetNewComment({ user });
  },

  uploadImage: async (req: Request, res: Response, next: NextFunction) => {
    const uploadDirectory = path.join(__dirname, '../../../public/uploads');
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDirectory);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 },
    }).single('upload');
    const uploadAsync = promisify(upload);

    try {
      await uploadAsync(req, res);

      if (!req.file) {
        return next(new AppError(400, 'No file uploaded.'));
      }

      res.status(200).json({
        filename: req.file.filename,
        url: process.env.SERVER_URL + '/uploads/' + req.file.filename,
      });
    } catch (err: any) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            new AppError(400, 'File size is too large. Maximum size is 5MB.')
          );
        }
      }
      return next(
        new AppError(500, 'An unknown error occurred during file upload.')
      );
    }
  },
};
