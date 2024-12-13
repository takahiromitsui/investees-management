'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Deal } from '@/app/(companies)/columns';
import { Plus, Trash2 } from 'lucide-react';

const dealSchema = z.object({
	date: z.string().min(1, 'Date is required'),
	fundingAmount: z.number().min(0, 'Funding amount must be positive'),
	fundingRound: z.string().min(1, 'Funding round is required'),
});

type DealsListProps = {
	deals: Deal[];
	onUpdate: (updatedDeal: Partial<Deal>) => void;
	onCreate: (newDeal: Omit<Deal, 'id'>) => void;
	onDelete: (id: number) => void;
};

export function DealsList({
	deals,
	onUpdate,
	onCreate,
	onDelete,
}: DealsListProps) {
	const [editingDealId, setEditingDealId] = useState<number | null>(null);
	const [isCreating, setIsCreating] = useState(false);

	const form = useForm<z.infer<typeof dealSchema>>({
		resolver: zodResolver(dealSchema),
	});

	const onSubmit = async (data: z.infer<typeof dealSchema>) => {
		if (editingDealId !== null) {
			onUpdate({ id: editingDealId, ...data });
			setEditingDealId(null);
		} else if (isCreating) {
			onCreate(data);
			setIsCreating(false);
		}
		form.reset();
	};

	const startEditing = (deal: Deal) => {
		setEditingDealId(deal.id);
		setIsCreating(false);
		form.reset({
			date: deal.date ? new Date(deal.date).toISOString().split('T')[0] : '',
			fundingAmount: deal.fundingAmount || 0,
			fundingRound: deal.fundingRound || '',
		});
	};

	const startCreating = () => {
		setEditingDealId(null);
		setIsCreating(true);
		form.reset({
			date: '',
			fundingAmount: 0,
			fundingRound: '',
		});
	};

	const cancelForm = () => {
		setEditingDealId(null);
		setIsCreating(false);
		form.reset();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex justify-between items-center'>
					Deals
					<Button onClick={startCreating}>
						<Plus className='h-4 w-4' />
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{(isCreating || editingDealId !== null) && (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4 mb-4'
						>
							<FormField
								control={form.control}
								name='date'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date</FormLabel>
										<FormControl>
											<Input type='date' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='fundingAmount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Funding Amount</FormLabel>
										<FormControl>
											<Input
												type='number'
												{...field}
												onChange={e =>
													field.onChange(parseFloat(e.target.value))
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='fundingRound'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Funding Round</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit'>{isCreating ? 'Create' : 'Save'}</Button>
							<Button type='button' variant='outline' onClick={cancelForm}>
								Cancel
							</Button>
						</form>
					</Form>
				)}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Funding Amount</TableHead>
							<TableHead>Funding Round</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{deals.map(deal => (
							<TableRow key={deal.id}>
								<TableCell>
									{new Date(deal.date || '').toLocaleDateString()}
								</TableCell>
								<TableCell>${deal.fundingAmount?.toLocaleString()}</TableCell>
								<TableCell>{deal.fundingRound}</TableCell>
								<TableCell>
									<div className='flex justify-between'>
										<Button onClick={() => startEditing(deal)}>Edit</Button>
										<Button
											variant='outline'
											size='icon'
											onClick={() => {
												onDelete(deal.id);
											}}
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
