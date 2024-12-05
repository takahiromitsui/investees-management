'use client';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import MaxWidthWrapper from '@/components/max-width-wrapper';

const BASE_URL = 'http://localhost:8000';
const TAKE = 10;
async function getCompanies(page = 1) {
	const response = await fetch(
		`${BASE_URL}/companies?order=ASC&page=${page}&take=${TAKE}`
	);
	return response.json();
}

export default function Home() {
	const [page, setPage] = useState(1);

	const {
		data: res,
		isError,
		isPending,
	} = useQuery({
		queryKey: ['companies', page],
		queryFn: () => getCompanies(page),
		placeholderData: keepPreviousData,
	});
	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error loading data</div>;
	}
	const data = res.data;

	const pageCount = res.meta.pageCount;

	return (
		<MaxWidthWrapper className='py-10'>
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
