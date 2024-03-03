import { Link } from "react-router-dom";
import LearnMore from "../components/LearnMore";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <h2 className="text-xl text-gray-500 ml-1 font-semibold lg:text-base">
          My name&apos;s Dinomanh and I want to be a backend developer in the
          future
        </h2>
        <p className="text-gray-500 ml-1 text-base">
          Here you&apos;ll find a variety of articles and tutorials on topics
          such as web development, software engineering, and programming
          languages.
        </p>
        <Link
          to="/search"
          className="lg:text-lg sm:text-sm text-teal-500 ml-2 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-3 flex flex-col gap-8 pb-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>

      <div className="p-3 max-w-[968px]  mx-auto w-full mt-5 mb-10 bg-amber-100 dark:bg-slate-700 ">
        <LearnMore />
      </div>
    </div>
  );
}
