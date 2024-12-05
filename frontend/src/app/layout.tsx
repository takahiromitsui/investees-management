import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import Providers from '@/components/providers';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
	title: 'Investee Management Dashboard',
	description:
		'A comprehensive platform for managing investees, their associated deals, and key data efficiently. The app provides a detailed overview of companies, tracks associated deals, and enables quick updates with a sleek, user-friendly interface. Designed to handle large datasets with features like pagination, search, and real-time editing capabilities, it’s a robust solution for streamlining investment management workflows.',
};
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={cn('relative h-full font-sans antialiased', inter.className)}
			>
				<main className='relative flex flex-col min-h-screen'>
					<Providers>
						<Navbar />
						<div className='flex-grow flex-1'>{children}</div>
					</Providers>
				</main>
				<Toaster position='top-center' richColors />
			</body>
		</html>
	);
}
