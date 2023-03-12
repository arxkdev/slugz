import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import { ErrorMessage } from '@hookform/error-message';
import 'react-toastify/dist/ReactToastify.css';

import { api } from "~/utils/api";
import type { ToastProps } from "react-toastify/dist/types";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { nanoid } from "nanoid";

const originUrl = "slugz.ca";

function generateRandomSlug() {
  return nanoid(7);
}

const urlPattern =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

type GenerateForm = {
  url: string;
  slug: string;
};

const Home: NextPage = () => {
  const { 
    register, 
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<GenerateForm>();

  const [data, setData] = useState<GenerateForm>();
  const [building, setBuilding] = useState<boolean>(false);
  const [builtUrl, setBuiltUrl] = useState<string>("");
  const [copiedSlug, setCopiedSlug] = useState<boolean>(false);

  watch((data) => {
    setData(data as GenerateForm);
  });

  const { mutate: createSlug } = api.slug.build.useMutation({
    onSuccess: (data) => {
      setBuiltUrl(data);
      notify("Slug created and copied!", "success");
      setBuilding(false);
      copyToClipboard(data);
      setValue("url", "");
      setValue("slug", "");
    },
    onError: (error) => {
      notify(error.message, "error");
      setBuilding(false);
      setValue("url", "");
      setValue("slug", "");
    }
  });

  const copyToClipboard = (text: string) => {
    setCopiedSlug(true);

    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy: ", err);
    });

    setTimeout(() => {
      setCopiedSlug(false);
    }, 1000);
  };
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
  };
  const build: SubmitHandler<GenerateForm> = (data) => {
    let url = data.url;
    const slug = data.slug;
    setBuilding(true);

    if (!/^https?:\/\//i.test(url)) {
      url = `http://${url}`;
    }
    
    // Create slug
    createSlug({
      url,
      slug
    });
  };

  console.log(errors);

  return (
    <>
      <ToastContainer />

      <Head>
        <title>Slugz</title>
        <meta 
          name="description"
          content="Slugz is a URL shortener app that allows you to swiftly build slugs that point towards links."
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      {/* <Nav /> */}
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-700 via-blue-800 to-gray-900">
        <div className="container flex flex-col max-w-md pr-10 pl-10 items-center justify-center">
          <h1 className="hover:opacity-75 three-d mb-11 mt-2 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Slugz
          </h1>

          <p className="hover:opacity-75 text-center mb-5">Build a slug given a URL. When you build a slug, it is shown to you below and automatically copied to your clipboard.</p>

          <form
            onSubmit={handleSubmit(build)}
            className="form-control w-full mb-16"
          >
            <ErrorMessage
              errors={errors}
              name="url"
              render={
                ({ message }) => <p className="text-center text-xl text-red-600 mb-2 mt-2 underline underline-offset-4">{message}</p>
              }
            />
            <div className="opacity-80">
              <label className="label">
                <span className="label-text">Your URL</span>
              </label>
              <label className="input-group input-group-vertical">
                <span className="pb-1">URL</span>
                <input
                  {...register("url", { required: true, pattern: {value: urlPattern, message: "This is not a valid format."} })}

                  type="text"
                  required
                  placeholder="google.ca"
                  className="input input-bordered"
                />
              </label>
            </div>

            <div className="opacity-80 mt-4">
              <label className="label">
                <span className="label-text">Your Slug</span>
              </label>
              <div className="flex w-full gap-3">
                <label className="input-group input-group-vertical">
                  <span className="pb-1">Slug</span>
                  <input
                    {...register("slug", { required: true })}
                    type="text"
                    required
                    placeholder="Your slug"
                    className="input input-bordered"
                  />
                  <button
                    type="button"
                    title="Generate a random password"
                    className="btn btn-outline w-full mb-2"
                    onClick={() => setValue("slug", generateRandomSlug())}
                  >Random</button>
                </label>
                
              </div>
            </div>

            <p className="hover:opacity-75 mt-6 text-center break-words">{originUrl}/{data?.slug} <span className="text-blue-400">points to:</span> {data?.url ? data.url : "nothing"}</p>

            <div className="opacity-80 mt-5 self-center">
              <div
                className='button w-72 h-16 bg-blue-500 rounded-lg cursor-pointer select-none
                  active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                  active:border-b-[0px]
                  transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
                  border-b-[1px] border-blue-400
                '
              >
                <button
                  type="submit"
                  className='flex flex-col w-full justify-center items-center h-full text-white font-bold text-lg '
                >
                  {building ? "Building..." : "Build"}
                </button>
              </div>
            </div>

            {builtUrl && builtUrl !== "" ? (
              <div className="opacity-80 flex justify-center mt-10 mb-24">
                <p className="hover:opacity-75 text-center text-md mt-3 mr-4">Your url: {builtUrl}</p>
                <button
                  type="button"
                  onClick={() => copyToClipboard(builtUrl)}
                  className="btn"
                >{copiedSlug ? "Copied..." : "Copy"}</button>
              </div>
            ) : null}
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;