import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import DashboardLayout from '@/components/DashboardLayout';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/lib/auth';
import { StoreProvider } from '@/lib/store';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'The Vault',
  description: 'Client & Document Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>
        <StoreProvider>
          <AuthProvider>
            <ToastProvider>
              <DashboardLayout>{children}</DashboardLayout>
            </ToastProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
