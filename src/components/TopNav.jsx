import React, { useState, useRef, useEffect, useContext } from 'react';
import logo from '../assets/logo.png';
import Modal from './Modal';
import { UserContext } from '../UserContext'; // Add this import

export default function TopNav({ page, setPage }) {
  const { user, setUser } = useContext(UserContext); // Get user/setUser from context
  const [supportOpen, setSupportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // Separate state/refs for desktop and mobile dropdowns!
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef();
  const mobileDropdownRef = useRef();

  useEffect(() => {
    if (user) {
      fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(r => r.json())
        .then(data => setReferralCode(data.referralCode || ""));
    }
  }, [user]);

  // Handle desktop dropdown outside click
  useEffect(() => {
    function handleClick(e) {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target)) {
        setDesktopDropdownOpen(false);
      }
    }
    if (desktopDropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [desktopDropdownOpen]);

  // Handle mobile dropdown outside click
  useEffect(() => {
    function handleClick(e) {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target)) {
        setMobileDropdownOpen(false);
      }
    }
    if (mobileDropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileDropdownOpen]);

  const navItems = [
    { label: 'Home', page: 'home' },
    ...(user ? [{ label: 'Dashboard', page: 'dashboard' }] : []),
    { label: 'Exchange', page: 'exchange' },
    { label: 'Support', modal: true }
  ];

  function handleInvite(setDropdownOpen) {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      setDropdownOpen(false);
    }
  }

  // Logout handler now handled via context!
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  }

  return (
    <>
      <nav className="flex items-center justify-between px-2 py-2 bg-darkcard shadow-md sticky top-0 z-30">
        {/* Logo left */}
        <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
          <img src={logo} alt="logo" className="h-8 mr-2 rounded" />
          <span className="font-bold text-lg text-primary tracking-widest">Tether2inr</span>
        </div>
        {/* Right nav - desktop */}
        <div className="hidden md:flex items-center space-x-2 ml-auto">
          {navItems.map((item, i) =>
            item.modal ? (
              <button
                key={i}
                onClick={() => setSupportOpen(true)}
                className="px-4 py-2 rounded font-semibold transition hover:bg-primary/10 text-primary"
              >
                {item.label}
              </button>
            ) : (
              <button
                key={i}
                onClick={() => setPage(item.page)}
                className={`px-4 py-2 rounded font-semibold transition hover:bg-primary/10 ${
                  page === item.page ? 'text-primary' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            )
          )}

          {/* Admin Panel button for admin users */}
          {user?.isAdmin && (
            <button
              onClick={() => setPage('admin')}
              className="px-4 py-2 rounded font-semibold transition hover:bg-accent/10 text-accent"
            >
              Admin Panel
            </button>
          )}

          {!user && (
            <button
              onClick={() => setPage('login')}
              className="px-4 py-2 rounded font-semibold transition hover:bg-primary/10 text-primary"
            >
              Login
            </button>
          )}
          {user && (
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={() => setDesktopDropdownOpen(o => !o)}
                className="ml-3 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition"
                aria-label="User menu"
              >
                <span className="text-primary font-bold text-xl uppercase select-none">
                  {user.email ? user.email.charAt(0) : <svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>}
                </span>
              </button>
              {/* Dropdown */}
              {desktopDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-darkcard border border-primary/10 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      setDesktopDropdownOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-primary/10 transition"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => handleInvite(setDesktopDropdownOpen)}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-primary/10 transition"
                  >
                    {copied ? "Copied!" : "Invite"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* TopNav Mobile: Support, Dashboard (if logged in), and user/login */}
        <div className="flex md:hidden items-center space-x-2 ml-auto">
          <button
            onClick={() => setSupportOpen(true)}
            className="px-3 py-1 rounded hover:bg-primary/10 font-semibold text-primary"
          >
            Support
          </button>
          {user && (
            <button
              onClick={() => setPage('dashboard')}
              className={`px-3 py-1 rounded font-semibold transition hover:bg-primary/10 ${
                page === 'dashboard' ? 'text-primary font-bold' : 'text-white'
              }`}
            >
              Dashboard
            </button>
          )}
          {/* Admin Panel button for admin users on mobile */}
          {user?.isAdmin && (
            <button
              onClick={() => setPage('admin')}
              className="px-3 py-1 rounded font-semibold transition hover:bg-accent/10 text-accent"
            >
              Admin Panel
            </button>
          )}
          {user ? (
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setMobileDropdownOpen(o => !o)}
                className="ml-1 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition"
                aria-label="User menu"
              >
                <span className="text-primary font-bold text-lg uppercase select-none">
                  {user.email ? user.email.charAt(0) : <svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="10" /></svg>}
                </span>
              </button>
              {mobileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-darkcard border border-primary/10 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      setMobileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-primary/10 transition"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => handleInvite(setMobileDropdownOpen)}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-primary/10 transition"
                  >
                    {copied ? "Copied!" : "Invite"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setPage('login')}
              className="px-3 py-1 rounded hover:bg-primary/10 font-semibold text-primary"
            >
              Login
            </button>
          )}
        </div>
      </nav>
      {/* Support Modal */}
      <Modal open={supportOpen} onClose={() => setSupportOpen(false)}>
        <h2 className="font-bold text-lg text-primary mb-4 text-center">Support</h2>
        <div className="flex flex-col items-center space-y-4">
          <a
            href="https://wa.me/917989919952"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center p-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold text-lg transition"
          >
            <svg viewBox="0 0 32 32" width="24" height="24" className="mr-2"><path fill="white" d="M16 2.938c-7.271 0-13.188 5.916-13.188 13.188 0 2.328 0.644 4.594 1.875 6.594l-2.062 7.531 7.75-2.031c1.922 1.125 4.094 1.781 6.375 1.781h0.031c7.271 0 13.188-5.916 13.188-13.188s-5.916-13.188-13.188-13.188zM16 29.063c-2.078 0-4.109-0.547-5.891-1.594l-0.422-0.25-4.594 1.203 1.219-4.469-0.266-0.438c-1.188-1.938-1.812-4.172-1.812-6.469 0-6.484 5.281-11.781 11.781-11.781s11.781 5.297 11.781 11.781c0 6.5-5.281 11.781-11.781 11.781z"/><path fill="white" d="M23.266 19.406c-0.328-0.172-1.922-0.938-2.219-1.047-0.297-0.109-0.516-0.172-0.734 0.172s-0.844 1.047-1.031 1.266c-0.188 0.219-0.375 0.25-0.703 0.078-0.328-0.172-1.391-0.516-2.648-1.641-0.98-0.875-1.641-1.953-1.844-2.281-0.188-0.328-0.016-0.5 0.141-0.672 0.141-0.156 0.313-0.406 0.469-0.609 0.156-0.188 0.219-0.328 0.328-0.547s0.047-0.406-0.016-0.578c-0.062-0.172-0.734-1.781-1-2.438-0.266-0.641-0.531-0.547-0.734-0.547-0.188 0-0.406-0.016-0.625-0.016s-0.578 0.078-0.875 0.391c-0.297 0.328-1.141 1.109-1.141 2.703s1.172 3.141 1.344 3.359c0.172 0.219 2.297 3.516 5.563 4.797 0.781 0.344 1.391 0.547 1.859 0.703 0.781 0.25 1.484 0.219 2.047 0.141 0.625-0.094 1.922-0.781 2.188-1.531 0.266-0.75 0.266-1.406 0.188-1.531-0.078-0.125-0.297-0.203-0.625-0.359z"/></svg>
            WhatsApp Support
          </a>
          <a
            href={`mailto:cryptxchangesupport@gmail.com?subject=Support Request from ${user?.email || ''}`}
            className="w-full flex items-center justify-center p-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" className="mr-2"><path fill="white" d="M12 13.5l8-6.5v11a1 1 0 0 1-1 1h-14a1 1 0 0 1-1-1v-11l8 6.5zm8-8h-16a1 1 0 0 0-1-1v.217l9 7.326 9-7.326v-.217a1 1 0 0 0-1-1z"/></svg>
            Email Support
          </a>
        </div>
      </Modal>
    </>
  );
}