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
	name?: string;
	email?: string;
};
interface AuthContextProps {
	user: User | undefined | null;
	setUser: React.Dispatch<React.SetStateAction<User | undefined | null>>;
}

const AuthContext = createContext<AuthContextProps | undefined | null>(
	undefined
);

const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<User | undefined | null>(undefined);
	const { error } = useQuery<User | null>({
		queryKey: ['authUser'],
		queryFn: async () => {
			const response = await getMe();
			if (response.ok) {
				const { body } = await response.json();
				setUser(body);
				return body;
			}
			return null;
		},
		// Set cache time to 55 minutes
		gcTime: 55 * 60 * 1000,
		// Set stale time to 5 minutes
		staleTime: 5 * 60 * 1000,
	});

	if (error) return <div>Error loading user</div>; // Handle error state

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export default function Providers({ children }: PropsWithChildren) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>{children}</AuthProvider>
		</QueryClientProvider>
	);
}
