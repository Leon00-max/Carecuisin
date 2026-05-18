import { Inter } from 'next/font/google';
import './styles/globals.css';
// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CareCuisin | Clinical Dietary Management',
  description: 'Connecting dietitians, patients, and certified chefs for managed healthcare nutrition.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 
        The antialiased class makes the text sharper, 
        and text-surface-800 applies your dark slate color globally 
      */}
      <body className={`${inter.className} bg-surface-50 text-surface-800 antialiased min-h-screen flex flex-col`}>
        {/* We will add a global Navbar here later */}
        
        <main className="flex-grow">
          {children}
        </main>
        
        {/* We will add a global Footer here later */}
      </body>
    </html>
  );
}