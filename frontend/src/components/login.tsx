'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from './ui/button';
import { postLogin } from '@/api/auth';
import { useAuth } from './providers';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.max(40, 'Password must be at most 40 characters'),
});

export type LoginData = z.infer<typeof loginSchema>;

export function Login() {
	const { setUser } = useAuth();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: LoginData) => {
		const response = await postLogin(data);
		const { body, message } = await response.json();
		if (!response.ok) {
			toast.error(message);
			return;
		}
		toast.success('Sign up successful');
		// Redirect to the login page
		setUser(body);
		redirect('/');
	};

	return (
		<Card className='w-[60%] bg-white shadow-lg'>
			<CardHeader>
				<CardTitle>Login</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='janedoe@mail.com'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type='password' placeholder='Password' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-between items-center'>
							<Button type='submit'>Login</Button>
							<Link
								href='/sign-up'
								className={buttonVariants({
									variant: 'link',
								})}
							>
								Don&apos;t have an account? Sign up
								<ArrowRight className='h-4 w-4 ml-2' />
							</Link>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
