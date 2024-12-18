// import { LoaderFunctionArgs } from '@vercel/remix';
import { LoaderFunctionArgs } from '@remix-run/node';
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson';
import { z } from 'zod';
import { authenticator } from '~/auth.server';
import { UserRepository } from '~/domain/faq/repositories/user-repository';
import { getCryptoPrice, SupportedCoins } from '~/infrastructure/crypto';
import prisma from '~/infrastructure/database/index.server';
import { Avatar, AvatarImage, AvatarFallback } from '~/ui/atoms/avatar';
import { MainLayout } from '~/ui/layouts/main';
import { NewQuestionButton } from '~/ui/molecules/new-question-button';
import { JoinButton } from '~/ui/organisms/auth/join';
import { LoginRegisterDialog } from '~/ui/organisms/auth/login-register-dialog';
import { ProfilePagination } from '~/ui/organisms/profile/pagination';
import { QuestionsList } from '~/ui/organisms/questions/questions-list';
import { ExternalLinkList } from '~/ui/organisms/social/external-links-list';
import { Wallet } from '~/ui/organisms/wallet';
import { decryptContent } from '~/utils/encryption.server';

const paginationSchema = z.object({
  page: z.coerce.number().min(0),
  size: z.coerce.number().max(1000),
});

export const loader = async (args: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(args.request);
  const username = args.params.username;
  const url = new URL(args.request.url);
  const searchParams = url.searchParams;
  const paginationResult = await paginationSchema.safeParseAsync({
    page: searchParams.get('page') ?? 0,
    size: searchParams.get('size') ?? 5,
  });

  if (paginationResult.error) {
    return redirect(url.pathname);
  }

  const user = await UserRepository.findByUsername(username?.toLowerCase()!, {
    questions: {
      page: paginationResult.data.page,
      size: paginationResult.data.size,
    },
  });

  if (!user) {
    return redirect('/404');
  }

  const isCreator = user?.id === session?.id;
  const [bonkPrice, totalAvailableQuestions, decryptedQuestions] =
    await Promise.all([
      getCryptoPrice(SupportedCoins.BONKUSDT, process.env.BINANCE_API_KEY),
      prisma.qA.count({ where: { userId: user?.id } }),
      isCreator
        ? user.UserProfile.QAs?.map((c) => ({
            id: c.id,
            decryptedAnswer:
              decryptContent(c.encryptedAnswer, c.IpfsPin?.symmetricKey!) ?? '',
          })) ?? []
        : [],
    ]);

  return typedjson({
    decryptedQuestions,
    bonkPrice,
    isCreator,
    user: user?.json(),
    totalAvailableQuestions,
    pagination: {
      ...paginationResult.data,
      pageCount: Math.ceil(
        totalAvailableQuestions / paginationResult.data.size
      ),
    },
  });
};

const UserProfile = () => {
  const data = useTypedLoaderData<typeof loader>();

  return (
    <MainLayout disableSiteNav className="items-center space-y-4">
      <div className="max-w-4xl w-full 2xl:w-[1080px] border-slate-300">
        <div className="flex flex-col p-4 space-y-8">
          <div className="flex flex-row items-center">
            <div className="ml-auto flex flex-row space-x-2 items-center">
              <Wallet />
              <LoginRegisterDialog
                username={data?.user?.username?.toLowerCase()!}
              />
            </div>
          </div>

          <div className="mx-auto text-center flex flex-col">
            <Avatar className="h-40 w-40 mx-auto mb-4">
              <AvatarImage
                src={data.user?.UserProfile?.Avatar?.url ?? ''}
                alt={data.user?.username ?? ''}
              />
              <AvatarFallback>
                {data.user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-bold text-xl mb-5">{data?.user?.username}</h1>
            <span className="text-gray-500 font-lg mb-4">
              {data?.user?.UserProfile?.about ?? 'No bio available'}
            </span>

            <ExternalLinkList links={data?.user?.UserProfile?.ExternalLinks} />
          </div>

          <NewQuestionButton isCreator={data?.isCreator} />
        </div>
      </div>
      <div className="max-w-4xl w-full 2xl:w-[1080px] flex flex-col">
        <QuestionsList
          questions={data?.user?.UserProfile?.QAs}
          cryptoPrice={data?.bonkPrice}
          isCreator={data?.isCreator}
          decryptedQuestions={data?.decryptedQuestions}
        />

        <ProfilePagination
          basePath={`/${data?.user?.username?.toLowerCase()}`}
          {...data?.pagination}
        />
      </div>

      <JoinButton username={data?.user?.username!} />
    </MainLayout>
  );
};

export default UserProfile;
