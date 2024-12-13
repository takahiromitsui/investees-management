'use client';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query';
import { getMe } from '@/api/auth';

type User = {
	id: number;
	name: string;
	email: string;
};

const AuthContext = createContext({ user: null } as {
	user: User | null | undefined;
});

const AuthProvider = ({ children }: PropsWithChildren) => {
	const {
		data: user,
		isLoading,
		error,
	} = useQuery<User | null>({
		queryKey: ['authUser'],
		queryFn: async () => {
			const response = await getMe();
			if (response.ok) {
				const { body } = await response.json();
				return body;
			}
			return null;
		},
		// Set cache time to 55 minutes
		gcTime: 55 * 60 * 1000,
		// Set stale time to 5 minutes
		staleTime: 5 * 60 * 1000,
	});

	if (isLoading) return <div>Loading...</div>; // Handle loading state
	if (error) return <div>Error loading user</div>; // Handle error state

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};
export const useAuth = () => useContext(AuthContext);

export default function Providers({ children }: PropsWithChildren) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>{children}</AuthProvider>
		</QueryClientProvider>
	);
}
