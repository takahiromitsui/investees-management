'use client';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';
import { useAuth } from '@/components/providers';

const AuthGuard = ({ children }: PropsWithChildren) => {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			// Redirect if not authenticated
			router.push('/login');
		}
	}, [user, router]);

	if (!user) {
		return <div></div>
	}

	return <>{children}</>;
};

export default AuthGuard;
