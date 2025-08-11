import React from 'react';
import { toast } from 'sonner';

import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

const SonnerDemo = () => {
  return (
    <>
      <Button
        variant='outline'
        onClick={() => {
          toast('Event has been created!', {
            description: 'Your event has been successfully created.',
            action: {
              label: 'Undo',
              onClick: () => {
                console.log('Undo');
              }
            }
          });
        }}
      >
        Show Toast
      </Button>
    </>
  );
};

const App = () => {
  const [theme, setTheme] = React.useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : ''
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <main>
        <Button
          variant='outline'
          onClick={() => {
            setTheme(theme => (theme === 'dark' ? 'light' : 'dark'));
          }}
        >
          Toggle theme
        </Button>
        <SonnerDemo setTheme={setTheme} />
      </main>
      <Toaster position='top-center' theme={theme} />
    </>
  );
};

export default App;
