import Image from "next/image";

const Nav = () => {
  return (
    <header className="p-4 bg-transparent">
      <div className="container flex justify-between h-16 mx-auto md:justify-center md:space-x-8">
        <a
          rel="noopener noreferrer"
          href="#"
          aria-label="Back to homepage"
          className="flex items-center p-2"
        >
          <Image
            className="rounded-3xl"
            src="/another.png"
            alt="Slugz"
            width={50}
            height={50}
          />
        </a>
        <button
          title="Button"
          type="button"
          className="p-4 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 dark:text-gray-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Nav;