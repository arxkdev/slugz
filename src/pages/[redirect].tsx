import { prisma } from "../server/db";
import ErrorPage from "next/error";

type ContextType = {
  params: {
    redirect: string;
  };
  
  res: {
    statusCode: number;
  };
};

// Here is the slug page
// The query slug will be the ID of the slug, redirect to the query slug

export const getServerSideProps = async ({ params, res }: ContextType) => {
  try {
    const url = await prisma.slug.findFirst({
      where: {
        slug: params.redirect,
      },
    });

    if (url) {
      return {
        redirect: {
          destination: url.url,
        },
      };
    }

    if (!url) {
      res.statusCode = 404;
      return { props: { url: null } };
    }
  } catch (error) {
    console.error();
  }
};

const Link = () => {
  return <ErrorPage statusCode={404} />;
};

export default Link;