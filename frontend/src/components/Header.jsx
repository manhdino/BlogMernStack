import { useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const path = useLocation().pathname;
  const theme = "dark";
  const currentUser = false;
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Navbar className="border-b-2">
      {/* Icon web */}
      <Link
        to="/"
        className="self-center  whitespace-nowrap text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Dinomanh&apos;s
        </span>
        Blog
      </Link>

      {/* Search Form hidden show inline only lg*/}
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {/* Icon search hidden on website */}
      <Button className="w-12 h-10 lg:hidden" color="gray">
        <AiOutlineSearch />
      </Button>

      {/* Dark mode and Sign In on Header */}
      <div className="flex gap-4 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        {/* Click to active Navbar.Collapse */}
        <Navbar.Toggle />
      </div>

      {/* Menu on phone devices */}
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          {/* <a/> duplicate -> div */}
          <Link to="/" className="lg:text-lg">
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about" className="lg:text-lg">
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects" className="lg:text-lg">
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
