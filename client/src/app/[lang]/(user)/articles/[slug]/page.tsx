import { HttpService } from '@/services';
import { IGetPostResponse } from '@/types/api';
import moment from 'moment';
import 'moment/locale/fr';
import Image from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import Comment from '@/components/comment';

const http = new HttpService();
type Props = {
  params: { slug: string; lang: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const post = await http.service().get<IGetPostResponse>(`posts/slug/${slug}`);

  return {
    title:
      params.lang === 'fr'
        ? `${post.data.post.frenchTitle} | Prochainweb`
        : `${post.data.post.englishTitle} | Prochainweb`,
    description:
      params.lang === 'fr'
        ? post.data.post.frenchDescription
        : post.data.post.englishDescription,
    openGraph: {
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_UPLOADS_URL}/resized_1200x630_${post.data.post.image}`,
          width: 1200,
          height: 630,
          alt:
            params.lang === 'fr'
              ? post.data.post.frenchTitle
              : post.data.post.englishTitle,
        },
      ],
    },
    authors: [
      {
        name: post.data.post.user.username,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${params.lang}/articles/${params.slug}`,
      },
    ],
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${params.lang}/articles/${params.slug}`,
    },
  };
}

export default async function PostDetail({
  params,
}: {
  params: { slug: string; lang: string };
}) {
  const http = new HttpService();

  const response = await http
    .service()
    .get<IGetPostResponse>(`posts/slug/${params.slug}`);

  const postId = response.data.post.id;
  const title =
    params.lang === 'fr'
      ? response.data.post.frenchTitle
      : response.data.post.englishTitle;
  const description =
    params.lang === 'fr'
      ? response.data.post.frenchDescription
      : response.data.post.englishDescription;
  const postDatas =
    params.lang === 'fr'
      ? response.data.post.frenchContent
      : response.data.post.englishContent;
  const categories = response.data.post.categories.map((category) => {
    return category.category;
  });
  const image = `${process.env.NEXT_PUBLIC_UPLOADS_URL}/resized_1200x630_${response.data.post.image}`;
  const publishedAt = moment(response.data.post.createdAt)
    .locale(params.lang)
    .format('L');
  const updatedAt = moment(response.data.post.updatedAt)
    .locale(params.lang)
    .format('L');

  const socialNetwork = [
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${process.env.NEXT_PUBLIC_APP_URL}/${params.lang}/articles/${params.slug}`,
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 72 72" {...props}>
          <path d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z" />
          <path
            d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
            fill="#fff"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="px-3 py-16 lg:px-5">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-500">
        <div className="text-center">
          <Link
            href="/articles"
            className="hover:text-cyan-800 flex items-center justify-center"
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
                />
              </svg>
              <span className="ml-1">
                {params.lang === 'fr'
                  ? 'Retour aux articles'
                  : 'Back to articles'}
              </span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-5 mt-5">
            {title}
          </h1>
          <h2 className="text-2xl text-gray-700 mb-2">{description}</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              return (
                <span
                  key={category.id}
                  className="px-2 py-1 text-xs text-gray-400 rounded-md border border-gray-400"
                >
                  {category.name}
                </span>
              );
            })}
          </div>

          <Image
            src={image}
            alt={title}
            width={1200}
            height={630}
            priority={true}
            className="object-contain mx-auto mt-4 mb-4"
          />

          <p className="text-gray-400">
            {params.lang === 'fr'
              ? `Publié le  ${publishedAt}, dernière mise à jour le ${updatedAt}`
              : `Published on ${publishedAt}, last updated on ${updatedAt}`}
          </p>
        </div>

        <div className="mt-5">
          <div
            dangerouslySetInnerHTML={{ __html: postDatas }}
            className="ck-content"
          ></div>
        </div>
        <p className="text-center text-gray-400 mt-5">
          {params.lang === 'fr'
            ? 'Partage cet article sur les réseaux sociaux avec tes amis'
            : 'Share this article on social networks with your friends'}
        </p>
        <div className="mt-5 flex justify-center space-x-10">
          {socialNetwork.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="h-6 w-6" />
            </a>
          ))}
        </div>
        <Comment params={{ postId, lang: params.lang }} />
      </div>
    </div>
  );
}
