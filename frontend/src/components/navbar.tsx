'use client';
import { deleteLogout } from '@/api/auth';
import MaxWidthWrapper from './max-width-wrapper';
import { useAuth } from './providers';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function Navbar() {
	const { user, setUser } = useAuth();
	const router = useRouter();

	const onLogout = async () => {
		await deleteLogout();
		toast.success('Logged out');
		setUser(null);
		router.push('/login');
	};
	return (
		<div className='bg-white sticky z-50 top-0 inset-x-0 h-16'>
			<header className='relative bg-white'>
				<MaxWidthWrapper>
					<div className='flex items-center justify-between h-16  border-b border-gray-200'>
						<h1 className='text-xl font-bold text-gray-800 py-8'>
							Investee Management Dashboard
						</h1>
						{user ? <Button onClick={onLogout}>Logout</Button> : null}
					</div>
				</MaxWidthWrapper>
			</header>
		</div>
	);
}
