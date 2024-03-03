import LearnMore from "../components/LearnMore";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
export default function Posts() {
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
    // <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
    //   <h1 className="text-3xl font-semibold mt-2">Posts</h1>
    //   <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
    //     <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
    //       {posts && posts.length > 0 && (
    //         <div className="flex flex-col gap-6">
    //           <div className="flex flex-wrap gap-4">
    //             {posts.map((post) => (
    //               <PostCard key={post._id} post={post} />
    //             ))}
    //           </div>
    //           <Link
    //             to={"/search"}
    //             className="text-lg text-teal-500 hover:underline text-center"
    //           >
    //             View all posts
    //           </Link>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    //   <p className="text-md text-gray-500">
    //     Build fun and engaging projects while learning HTML, CSS, and
    //     JavaScript!
    //   </p>
    //   <LearnMore />
    // </div>
    <>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold text-center mt-5">Blogs</h2>
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
    </>
  );
}
