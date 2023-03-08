import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api"; 

// Here is the slug page
// The query slug will be the ID of the slug, redirect to the query slug

const Slug: NextPage = () => {
  const router = useRouter();
  
  const fetchLongUrl = api.slug.get.useQuery({slugId: router.query.slug as string},
    {
      enabled: !!router.query.slug
    }
  );

  useEffect(() => {
    if (!fetchLongUrl.data) return;
    window.location.href = fetchLongUrl.data;
  }, [fetchLongUrl.data]);

  if (fetchLongUrl.isError) return <div className="text-center mt-10 text-3xl">404 - Not found</div>;
  return (
    <>

      <Head>
        <title>Slugz - {router.query.slug}</title>
        <meta name="description" content={`Slugz - ${router.query.slug as string}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </>
  )
};

export default Slug;