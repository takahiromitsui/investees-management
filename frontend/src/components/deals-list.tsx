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


const dealSchema = z.object({
	date: z.string().min(1, 'Date is required'),
	fundingAmount: z.number().min(0, 'Funding amount must be positive'),
	fundingRound: z.string().min(1, 'Funding round is required'),
});

type DealsListProps = {
	deals: Deal[];
	// onUpdate: (updatedDeal: Partial<Deal>) => Promise<void>;
};

export function DealsList({ deals, 
  // onUpdate
 }: DealsListProps) {
	const [editingDealId, setEditingDealId] = useState<number | null>(null);

	const form = useForm<z.infer<typeof dealSchema>>({
		resolver: zodResolver(dealSchema),
	});

	const onSubmit = async (data: z.infer<typeof dealSchema>) => {
		if (editingDealId !== null) {
			// await onUpdate({ id: editingDealId, ...data });
			setEditingDealId(null);
		}
	};

	const startEditing = (deal: Deal) => {
		setEditingDealId(deal.id);
		form.reset({
			date: deal.date ? new Date(deal.date).toISOString().split('T')[0] : '',
			fundingAmount: deal.fundingAmount || 0,
			fundingRound: deal.fundingRound || '',
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Deals</CardTitle>
			</CardHeader>
			<CardContent>
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
								{editingDealId === deal.id ? (
									<TableCell colSpan={4}>
										<Form {...form}>
											<form
												onSubmit={form.handleSubmit(onSubmit)}
												className='space-y-4'
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
												<Button type='submit'>Save</Button>
												<Button
													type='button'
													variant='outline'
													onClick={() => setEditingDealId(null)}
												>
													Cancel
												</Button>
											</form>
										</Form>
									</TableCell>
								) : (
									<>
										<TableCell>
											{new Date(deal.date || '').toLocaleDateString()}
										</TableCell>
										<TableCell>
											${deal.fundingAmount?.toLocaleString()}
										</TableCell>
										<TableCell>{deal.fundingRound}</TableCell>
										<TableCell>
											<Button onClick={() => startEditing(deal)}>Edit</Button>
										</TableCell>
									</>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
