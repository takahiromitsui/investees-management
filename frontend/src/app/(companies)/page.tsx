'use client';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Input } from '@/components/ui/input';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TAKE = 10;
async function getCompanies(page = 1, search = '') {
	const response = await fetch(
		`${BASE_URL}/companies?order=ASC&page=${page}&take=${TAKE}&search=${search}`
	);
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to fetch companies');
	}
	return response.json();
}

export default function Home() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');

	const {
		data: res,
		isError,
		isPending,
	} = useQuery({
		queryKey: ['companies', page, search],
		queryFn: () => getCompanies(page, search),
		placeholderData: keepPreviousData,
	});

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		setPage(1);
	};

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error loading data</div>;
	}
	const data = res.data;

	const pageCount = res.meta ? res.meta.pageCount : 1;
	return (
		<MaxWidthWrapper className='py-10'>
			<div className='mb-4'>
				<Input
					type='text'
					value={search}
					onChange={handleSearchChange}
					placeholder='Search companies by name'
					className='border p-2'
				/>
			</div>
			<DataTable
				columns={columns}
				data={data}
				page={page}
				pageCount={pageCount}
				canPreviousPage={page > 1}
				canNextPage={page < pageCount}
				onPreviousPage={() => setPage(old => Math.max(old - 1, 1))}
				onNextPage={() => setPage(old => (old < pageCount ? old + 1 : old))}
			/>
		</MaxWidthWrapper>
	);
}
