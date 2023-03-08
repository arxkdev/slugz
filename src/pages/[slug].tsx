import { type NextPage } from "next";
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

  return <div></div>
};

export default Slug;