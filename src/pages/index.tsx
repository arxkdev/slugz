import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import crypto from "crypto";
import Image from "next/image";
// import Nav from "~/components/navbar";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { api } from "~/utils/api";
import type { ToastProps } from "react-toastify/dist/types";

const originUrl = "slugz.ca";

function generateRandomSlug() {
  return crypto.randomBytes(3).toString("hex");
}

function isValidHttpUrl(string: string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

const Home: NextPage = () => {
  const [url, setUrl] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [building, setBuilding] = useState<boolean>(false);
  const [builtUrl, setBuiltUrl] = useState<string>("");
  const [copiedSlug, setCopiedSlug] = useState<boolean>(false);

  const { mutate: createSlug } = api.slug.build.useMutation({
    onSuccess: (data) => {
      setBuiltUrl(data);
      notify("Slug created!", "success");
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

    if (!isValidHttpUrl(url)) {
      notify("Please enter a valid URL!", "error");
      setBuilding(false);
      return;
    }
    
    // Create slug
    createSlug({
      url,
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
        <div className="container flex flex-col items-center justify-center pr-28 pl-28">
          <Image className="hover:opacity-75 rounded-3xl" height={50} width={50} alt="" src="/favicon.ico" />

          <h1 className="hover:opacity-75 mb-11 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Slugz
          </h1>

          <p className="hover:opacity-75 text-center mb-5">Build a slug given a URL. When you build a slug, it is shown to you below and automatically copied to your clipboard.</p>

          <form className="form-control min-w-full mb-16">
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

              <p className="hover:opacity-75 mt-6 text-center">{originUrl}/{slug} <span className="text-green-400">points to:</span> {url}</p>

              <div className="opacity-80 mt-4">
                <button type="button" onClick={() => build()} className="btn w-full">
                  {building ? "Building..." : "Build"}
                </button>
              </div>

              {builtUrl && builtUrl !== "" ? (
                <div className="opacity-80 flex justify-center mt-6 mb-24">
                  <p className="hover:opacity-75 text-center text-3xl mt-1 mr-4">Your url: {builtUrl}</p>
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