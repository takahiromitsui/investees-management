'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Company = {
	id: number;
	name: string;
	country: string;
	foundingDate: Date;
	description: string;
	dealNumber: number;
};

export const columns: ColumnDef<Company>[] = [
	{
		accessorKey: 'dealNumber',
		header: 'How many deals?',
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
	},
];
