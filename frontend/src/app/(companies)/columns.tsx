'use client';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export type Deal = {
	id: number;
	date: string | null;
	fundingAmount: number | null;
	fundingRound: string | null;
};

export type Company = {
	id: number;
	name: string | null;
	country: string | null;
	foundingDate: string | null;
	description: string | null;
	deals: Deal[] | [];
};

export default function DealsDropdownMenuItem({ id }: { id: number }) {
	const router = useRouter();
	const handleClick = () => {
		router.push(`/companies/${id}/deals`);
	};

	return <DropdownMenuItem onClick={handleClick}>View deals</DropdownMenuItem>;
}

export const columns: ColumnDef<Company>[] = [
	{
		accessorKey: 'deals',
		header: 'How many deals?',
		cell: ({ row }) => {
			const deals = row.getValue('deals') as Deal[];
			return deals.length;
		},
	},
	{
		accessorKey: 'name',
		header: 'Company Name',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'country',
		header: 'Country',
	},
	{
		accessorKey: 'foundingDate',
		header: 'Founding Date',
		cell: ({ row }) => {
			const foundingDate = row.getValue('foundingDate') as string;
			return format(new Date(foundingDate), 'dd/MM/yyyy');
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const { id } = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{/* <DropdownMenuItem onClick={() => console.log('View deals')}>
							View deals
						</DropdownMenuItem> */}
						<DealsDropdownMenuItem id={id} />
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
