import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import crypto from "crypto";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { api } from "~/utils/api";
import type { ToastProps } from "react-toastify/dist/types";

const originUrl = "slugz.ca";

function generateRandomSlug() {
  return crypto.randomBytes(3).toString("hex");
}

const urlPattern =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

const Home: NextPage = () => {
  const [url, setUrl] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [building, setBuilding] = useState<boolean>(false);
  const [builtUrl, setBuiltUrl] = useState<string>("");
  const [copiedSlug, setCopiedSlug] = useState<boolean>(false);

  const { mutate: createSlug } = api.slug.build.useMutation({
    onSuccess: (data) => {
      setBuiltUrl(data);
      notify("Slug created and copied!", "success");
      setSlug("");
      setUrl("");
      setBuilding(false);
      copyToClipboard(data);
    },
    onError: (error) => {
      notify(error.message, "error");
      setBuilding(false);
      setUrl("");
      setSlug("");
    }
  })

  function copyToClipboard(text: string) {
    setCopiedSlug(true);

    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy: ", err);
    });

    setTimeout(() => {
      setCopiedSlug(false);
    }, 1000);
  }

  const notify = (text: string, type: string) => {
    const props = {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      progress: undefined,
      delay: 0,
    } as ToastProps;

    type === "error" ? toast.error(text, props) : toast.success(text, props);
  }
  const build = () => {
    setBuilding(true);

    if (!url || url === "") {
      notify("Please enter a URL!", "error");
      setBuilding(false);
      return;
    }

    if (!slug || slug === "") {
      notify("Please enter a slug!", "error");
      setBuilding(false);
      return;
    }

    if (!slug || !url || slug === "" || url === "") {
      notify("Please enter a slug and URL!", "error");
      setBuilding(false);
      return;
    }

    if (!urlPattern.test(url)) {
      notify("Please enter a valid URL!", "error");
      setBuilding(false);
      return;
    }

    let newUrl = url;

    if (!/^https?:\/\//i.test(url)) {
      newUrl = `http://${url}`;
    }
    
    // Create slug
    createSlug({
      url: newUrl,
      slug
    });
  }

  useEffect(() => {
    if (!slug || slug === "") {
      setSlug(generateRandomSlug());
    }
  }, [slug])

  return (
    <>
      <ToastContainer />

      <Head>
        <title>Slugz</title>
        <meta name="description" content="Slugz is a URL shortener app that allows you to swiftly build slugs that point towards links." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Nav /> */}
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-700 via-blue-800 to-gray-900">
        <div className="container flex flex-col max-w-md pr-10 pl-10 items-center justify-center">
          <h1 className="hover:opacity-75 three-d mb-11 mt-2 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Slugz
          </h1>

          <p className="hover:opacity-75 text-center mb-5">Build a slug given a URL. When you build a slug, it is shown to you below and automatically copied to your clipboard.</p>

          <form className="form-control w-full mb-16">
              <div className="opacity-80">
                <label className="label">
                  <span className="label-text">Your URL</span>
                </label>
                <label className="input-group input-group-vertical">
                  <span className="pb-1">URL</span>
                  <input value={url} onChange={(e) => setUrl(e.target.value)} type="text" required placeholder="google.ca" className="input input-bordered" />
                </label>
              </div>

              <div className="opacity-80 mt-4">
                <label className="label">
                  <span className="label-text">Your Slug</span>
                </label>
                <label className="input-group input-group-vertical">
                  <span className="pb-1">Slug</span>
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} type="text" required placeholder="Your slug (if one is not given, one will be provided)" className="input input-bordered" />
                </label>
              </div>

              <p className="hover:opacity-75 mt-6 text-center">{originUrl}/{slug} <span className="text-blue-400">points to:</span> {url ? url : "nothing"}</p>

              <div className="opacity-80 mt-5 self-center">
                <div className='button w-72 h-16 bg-blue-500 rounded-lg cursor-pointer select-none
                  active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                  active:border-b-[0px]
                  transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
                  border-b-[1px] border-blue-400
                '>
                  <span onClick={() => build()} className='flex flex-col justify-center items-center h-full text-white font-bold text-lg '>
                    {building ? "Building..." : "Build"}
                  </span>
                </div>
              </div>

              {builtUrl && builtUrl !== "" ? (
                <div className="opacity-80 flex justify-center mt-10 mb-24">
                  <p className="hover:opacity-75 text-center text-md mt-3 mr-4">Your url: {builtUrl}</p>
                  <button type="button" onClick={() => copyToClipboard(builtUrl)} className="btn">{copiedSlug ? "Copied..." : "Copy"}</button>
                </div>
              ) : null}
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;