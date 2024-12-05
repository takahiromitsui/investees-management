'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Company } from '@/app/(companies)/columns';

const companySchema = z.object({
	name: z.string().min(1, 'Name is required'),
	country: z.string().min(1, 'Country is required'),
	foundingDate: z.string().min(1, 'Founding date is required'),
	description: z.string().min(1, 'Description is required'),
});

type CompanyInfoProps = {
	company: Company;
	onUpdate: (updatedCompany: Partial<Company>) => void;
};

export function CompanyInfo({ company, onUpdate }: CompanyInfoProps) {
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<z.infer<typeof companySchema>>({
		resolver: zodResolver(companySchema),
		defaultValues: {
			name: company.name || '',
			country: company.country || '',
			foundingDate: company.foundingDate
				? new Date(company.foundingDate).toISOString().split('T')[0]
				: '',
			description: company.description || '',
		},
	});

	const onSubmit = async (data: z.infer<typeof companySchema>) => {
		await onUpdate(data);
		setIsEditing(false);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex justify-between items-center'>
					Company Information
					<Button onClick={() => setIsEditing(!isEditing)}>
						{isEditing ? 'Cancel' : 'Edit'}
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='country'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='foundingDate'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Founding Date</FormLabel>
										<FormControl>
											<Input type='date' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit'>Save Changes</Button>
						</form>
					</Form>
				) : (
					<div className='space-y-2'>
						<p>
							<strong>Name:</strong> {company.name}
						</p>
						<p>
							<strong>Country:</strong> {company.country}
						</p>
						<p>
							<strong>Founding Date:</strong>{' '}
							{new Date(company.foundingDate || '').toLocaleDateString()}
						</p>
						<p>
							<strong>Description:</strong> {company.description}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
