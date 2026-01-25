import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, FileText } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-primary">
            <FileText className="h-6 w-6" />
            <span>ResuFolio</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="User" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="font-medium">{user.full_name || user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/')} size="sm">Sign In</Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-auto px-4">
          <p className="text-center text-sm leading-loose text-slate-500 md:text-left">
            Built by ResuFolio Inc. &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};