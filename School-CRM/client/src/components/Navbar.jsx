import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { FiMenu } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { logout, selectCurrentUserRole, isAuthenticated } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";
import { getDashboardPath } from '../config/roleUtils';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/#about', label: 'About Us' },
  { path: '/#features', label: 'Features' },
  { path: '/#service', label: 'Service' },
  { path: '/#contact', label: 'Contact Us' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled
          ? " bg-gradient-to-b from-bgDarkColor via-bgDarkColor to-[#111111cd]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1 cursor-pointer">
              <img
                src={Logo}
                alt="logo"
                className="w-12 h-12 object-contain scale-130 transition-transform duration-300 hover:rotate-12"
              />
              <span className=" text-white  text-xl uppercase font-bold ">
                Scout Team
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex space-x-4 ml-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.path}
                    onClick={(e) => {
                      if (link.path.startsWith("/#")) {
                        e.preventDefault();
                        const targetId = link.path.replace("/#", "");
                        const element = document.getElementById(targetId);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                    className={`relative px-3 py-2 text-sm font-medium text-white transition-colors duration-300`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <CheckUserExists />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-md text-gray-100 hover:text-primary focus:outline-none"
              title="Open menu"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-0 right-0 w-80 h-full bg-bgDarkColor shadow-xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />
                  <span className="text-xl font-bold text-white uppercase">Scout Team</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-gray-300 hover:text-primary focus:outline-none"
                >
                  <HiX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4">
                <ul className="space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.path}
                      onClick={(e) => {
                        if (link.path.startsWith("/#")) {
                          e.preventDefault();
                          const targetId = link.path.replace("/#", "");
                          const element = document.getElementById(targetId);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }
                        setIsOpen(false);
                      }}
                      className={`relative block px-3 py-2 text-sm font-medium text-gray-200 ${
                        location.hash === link.path.replace("/", "")
                          ? ""
                          : "text-gray-200 hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                </ul>

                <div className="mt-8 space-y-4">
                  <CheckUserExists />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

/* ------------------ USER LOGIN/LOGOUT COMPONENT ------------------ */
const CheckUserExists = () => {
  const userRole = useSelector(selectCurrentUserRole);
  const auth = useSelector(isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    navigate("/login");
  };

  if (!auth) {
    // Not logged in
    return (
      <>
        <Link
          to="/login"
          className="px-4 py-1 rounded-sm text-sm font-medium text-white  bg-primary  transition-colors"
        >
          Sign In
        </Link>
        
      </>
    );
  }

  // Logged in
  return (
    <>
      <Link
        to={getDashboardPath(userRole)}
        className="px-4 py-1  text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
      >
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-1  text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md hover:shadow-lg ml-2"
      >
        Logout
      </button>
    </>
  );
};
