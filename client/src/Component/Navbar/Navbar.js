import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

const Navbar = ({ isLoggedin, setisLoggedin, role }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setisLoggedin(true);
    };

  }, [setisLoggedin]);

  const handleSignout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setisLoggedin(false);
    navigate("/signin");
    window.location.reload();
  };
  return (
    <>
      <nav className="bg-black p-4 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className=" font-bold text-4xl">
            <span className="text-[#EF4444]">S</span>
            <span className="text-[#EAB308]">H</span>
            <span className="text-[#22C55E]">O</span>
            <span className="text-[#EF4444]">P</span>
            <span className="text-[#EAB308]">P</span>
            <span className="text-[#22C55E]">I</span>
            <span className="text-[#EF4444]">E</span>
            <span className="text-[#EAB308]">E</span>
            <span className="text-[#22C55E]">E</span>
          </Link>
          <div className="flex items-center space-x-4">
            {
              isLoggedin ? (
                <>
                  <Link to="/home-page" className="text-white hover:text-[#ff4b30]">Home</Link>
                  {role === "admin" &&
                    <Link to="/dashboard" className="text-white hover:text-[#ff4b30]">Dashboard</Link>
                  }
                  <Link to="/about-project" className="text-white hover:text-[#ff4b30]">About-Project</Link>
                  <div className="border py-1 px-5 rounded-md bg-black">
                    <button className="text-white" onClick={handleSignout}>Signout</button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="signin" className="text-white hover:text-[#ff4b30]">Login</Link>
                  <Link to="/" className="text-white hover:text-[#ff4b30]">Register</Link>
                </>
              )
            }
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  )
}

export default Navbar