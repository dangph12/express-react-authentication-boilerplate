import { ChevronDown, LogOut, Menu, Moon, Sun, User, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover';
import { useProfile } from '~/features/users/view-profile/api/view-profile';
import { logout } from '~/store/features/auth-slice';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/playground', label: 'Playground' }
];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { data: profile } = useProfile();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background'>
      <div className='container mx-auto flex h-14 items-center justify-between px-4'>
        <Link to='/' className='flex items-center gap-2'>
          <img src='/vite.svg' alt='Logo' className='h-8 w-8' />
          <span className='hidden font-semibold sm:inline-block'>Vite App</span>
        </Link>

        <nav className='hidden items-center gap-6 md:flex'>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleTheme}
            className='cursor-pointer'
          >
            <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
          </Button>

          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative h-10 w-10 rounded-full p-0 cursor-pointer'
                >
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={profile?.avatar} alt={profile?.name} />
                    <AvatarFallback>
                      <img
                        src='/default-avatar.jpg'
                        alt='Default avatar'
                        className='h-full w-full object-cover'
                      />
                    </AvatarFallback>
                  </Avatar>
                  <span className='absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-muted'>
                    <ChevronDown className='h-3 w-3' />
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-48 p-2' align='end'>
                <div className='flex flex-col gap-1'>
                  <Link
                    to='/profile'
                    className='flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent'
                  >
                    <User className='h-4 w-4' />
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-accent'
                  >
                    <LogOut className='h-4 w-4' />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className='flex items-center gap-2'>
              <Button variant='ghost' asChild>
                <Link to='/auth/login'>Login</Link>
              </Button>
              <Button asChild>
                <Link to='/auth/sign-up'>Sign Up</Link>
              </Button>
            </div>
          )}

          <Button
            variant='ghost'
            size='icon'
            className='md:hidden cursor-pointer'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
            <span className='sr-only'>Toggle menu</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className='border-t md:hidden'>
          <div className='container mx-auto flex flex-col px-4 py-2'>
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className='rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground'
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
