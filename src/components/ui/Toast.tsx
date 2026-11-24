import { Toaster } from 'react-hot-toast';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#FFFFFF',
          color: '#0B1220',
          border: '1px solid #E5E5E5',
          borderRadius: '2px',
          fontSize: '13px',
          boxShadow: 'none',
        },
        success: {
          iconTheme: { primary: '#0E6F4E', secondary: '#FFFFFF' },
        },
        error: {
          iconTheme: { primary: '#B42318', secondary: '#FFFFFF' },
        },
      }}
    />
  );
}
