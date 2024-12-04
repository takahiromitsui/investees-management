'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
const BASE_URL = 'http://localhost:8000';

async function getCompanyDeals(companyId: string) {
	const response = await fetch(`${BASE_URL}/companies/${companyId}`);
	return response.json();
}

export default function CompanyDealsPage() {
	const param = useParams<{ id: string }>();

	const { data, isPending, isError } = useQuery({
		queryKey: ['company'],
		queryFn: () => getCompanyDeals(param.id),
	});
	if (isPending) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error loading data</div>;
	}
	const { body } = data;
  console.log(body);
	return (
		<div className='container mx-auto py-10'>
			<h1 className='text-3xl font-semibold text-gray-800'>CompanyDealsPage</h1>
		</div>
	);
}
