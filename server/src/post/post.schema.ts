import { object, string, TypeOf } from 'zod';

export const addPostSchema = object({
  body: object({
    frenchContent: string({
      required_error: 'Post can not be empty.',
    }).min(1, 'You must provide a post.'),
    englishContent: string({
      required_error: 'Post can not be empty.',
    }).min(1, 'You must provide a post.'),
    categoryIds: string().array().nonempty('You must chose a category.'),
    frenchTitle: string({
      required_error: 'Title can not be empty',
    }).min(1, 'You must provide a title'),
    englishTitle: string({
      required_error: 'Title can not be empty',
    }).min(1, 'You must provide a title'),
    frenchDescription: string({
      required_error: 'Description can not be empty',
    }).min(1, 'You must provide a description'),
    englishDescription: string({
      required_error: 'Description can not be empty',
    }).min(1, 'You must provide a description'),
    slug: string({
      required_error: 'Slug can not be empty',
    }).min(1, 'You must provide a slug'),
  }),
});

export const addCategorySchema = object({
  body: object({
    categoryName: string({
      required_error: 'Category name is required.',
    }).min(1, 'You must provide a category name.'),
  }),
});

export const publishPostSchema = object({
  params: object({
    id: string({
      required_error: 'Post id is required.',
    }),
  }),
});

export const disablePostSchema = object({
  params: object({
    id: string({
      required_error: 'Post id is required.',
    }),
  }),
});

export const getPostSchema = object({
  params: object({
    id: string({
      required_error: 'Post id is required.',
    }),
  }),
});

export const editPostSchema = object({
  params: object({
    id: string({
      required_error: 'Post id is required.',
    }),
  }),
  body: object({
    frenchContent: string({
      required_error: 'Post can not be empty.',
    }).min(1, 'You must provide a post.'),
    englishContent: string({
      required_error: 'Post can not be empty.',
    }).min(1, 'You must provide a post.'),
    categoryIds: string().array().nonempty('You must chose a category.'),
    frenchTitle: string({
      required_error: 'Title can not be empty',
    }).min(1, 'You must provide a title'),
    englishTitle: string({
      required_error: 'Title can not be empty',
    }).min(1, 'You must provide a title'),
    frenchDescription: string({
      required_error: 'Description can not be empty',
    }).min(1, 'You must provide a description'),
    englishDescription: string({
      required_error: 'Description can not be empty',
    }).min(1, 'You must provide a description'),
    slug: string({
      required_error: 'Slug can not be empty',
    }).min(1, 'You must provide a slug'),
  }),
});

export const addCommentSchema = object({
  body: object({
    postId: string({
      required_error: 'Unexpected error occured.',
    }),
    comment: string({
      required_error: 'Comment can not be empty.',
    }).min(1, 'You must provide a comment.'),
  }),
});

export const getCommentSchema = object({
  params: object({
    postid: string({
      required_error: 'Unexpected error occured.',
    }),
  }),
});

export const addResponseSchema = object({
  params: object({
    postid: string({
      required_error: 'Unexpected error occured.',
    }),
  }),
  body: object({
    parentId: string({
      required_error: 'Unexpected error occured.',
    }),
    comment: string({
      required_error: 'Response can not be empty.',
    }).min(1, 'You must provide a response.'),
  }),
});

export type AddPostInput = TypeOf<typeof addPostSchema>['body'];
export type AddCategoryInput = TypeOf<typeof addCategorySchema>['body'];

export type PublishPostInput = TypeOf<typeof publishPostSchema>['params'];
export type DisablePostInput = TypeOf<typeof disablePostSchema>['params'];

export type GetPostInput = TypeOf<typeof getPostSchema>['params'];

export type EditPostInput = TypeOf<typeof editPostSchema>;

export type AddCommentInput = TypeOf<typeof addCommentSchema>['body'];

export type GetCommentInput = TypeOf<typeof getCommentSchema>['params'];

export type AddResponseInput = TypeOf<typeof addResponseSchema>;
