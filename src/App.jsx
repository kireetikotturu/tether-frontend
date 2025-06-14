import React from 'react';
import { UserProvider } from './UserContext'; // Make sure path is correct
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Exchange from './pages/Exchange';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import AdminPanel from './pages/Adminpanel';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [page, setPage] = React.useState('home');

  return (
    <UserProvider>
      <div className="min-h-screen bg-darkbg flex flex-col font-sans">
        <TopNav page={page} setPage={setPage} />
        <div className="flex-1 w-full max-w-2xl mx-auto py-3 px-2">
          {page === 'home' && <Home setPage={setPage} />}
          {page === 'exchange' && <Exchange />}
          {page === 'dashboard' && (
            <ProtectedRoute>
              <Dashboard setPage={setPage} />
            </ProtectedRoute>
          )}
          {page === 'login' && <Login setPage={setPage} />}
          {page === 'register' && <Register setPage={setPage} />}
          {page === 'deposit' && (
            <ProtectedRoute>
              <Deposit setPage={setPage} />
            </ProtectedRoute>
          )}
          {page === 'withdraw' && (
            <ProtectedRoute>
              <Withdraw setPage={setPage} />
            </ProtectedRoute>
          )}
          {page === 'admin' && (
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          )}
          {['home', 'exchange', 'dashboard', 'login', 'register', 'deposit', 'withdraw', 'admin'].indexOf(page) === -1 && <NotFound />}
        </div>
        <BottomNav page={page} setPage={setPage} />
      </div>
    </UserProvider>
  );
}