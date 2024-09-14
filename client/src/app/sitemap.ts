import type { MetadataRoute } from 'next';
import { HttpService } from '@/services';
const http = new HttpService();
async function dynamicPagesForSitemap() {
  const {
    datas: { posts },
  } = await http.service().get<IGetPostsResponse>(`/posts/publish`);
  return posts.map((post) => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${process.env.NEXT_PUBLIC_APP_URL}/fr/post/${post.slug}`,
        en: `${process.env.NEXT_PUBLIC_APP_URL}/en/post/${post.slug}`,
      },
    },
  }));
}

const pagesBase = [
  {
    url: process.env.NEXT_PUBLIC_APP_URL!,
    lastModified: new Date().toISOString(),
    alternates: {
      languages: {
        fr: `${process.env.NEXT_PUBLIC_APP_URL}/fr`,
        en: `${process.env.NEXT_PUBLIC_APP_URL}/en`,
      },
    },
  },
  {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/post`,
    lastModified: new Date().toISOString(),
    alternates: {
      languages: {
        fr: `${process.env.NEXT_PUBLIC_APP_URL}/fr/post`,
        en: `${process.env.NEXT_PUBLIC_APP_URL}/en/post`,
      },
    },
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicPages = await dynamicPagesForSitemap();
  const pages = [...pagesBase, ...dynamicPages];
  return pages;
}

import { IGetPostsResponse } from '@/types/api';