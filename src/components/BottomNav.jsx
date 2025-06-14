import React from 'react';

export default function BottomNav({ page, setPage, user }) {
  const navItems = [
    {
      label: 'Home',
      page: 'home',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2">
          <path d="M3 11.4L12 4l9 7.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 10v9a1 1 0 0 0 1 1h4m6 0h4a1 1 0 0 0 1-1v-9" strokeLinecap="round"/>
          <path d="M9 21V13h6v8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: 'Exchange',
      page: 'exchange',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2">
          <path d="M4 17l6-6 6 6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 7l-6 6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    // Only show Dashboard if user is logged in
    ...(user
      ? [
          {
            label: 'Dashboard',
            page: 'dashboard',
            icon: (
              <svg width="22" height="22" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2">
                <rect x="3" y="3" width="16" height="16" rx="2" />
                <path d="M3 8h16M8 19V8" />
              </svg>
            ),
          }
        ]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-darkcard border-t border-primary/10 shadow-2xl flex md:hidden justify-around z-30 py-1 px-1">
      {navItems.map(item => (
        <button
          key={item.page}
          onClick={() => setPage(item.page)}
          className={`flex items-center justify-center flex-1 mx-1 py-1 px-2 rounded-lg duration-150 transition
            ${page === item.page
              ? 'text-primary bg-primary/10 shadow font-bold'
              : 'text-white hover:text-primary hover:bg-primary/5'}
            `}
        >
          {item.icon}
          <span className={`ml-1 text-sm tracking-wide ${page === item.page ? 'font-semibold' : 'font-normal'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}