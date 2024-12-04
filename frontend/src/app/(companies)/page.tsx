import { columns } from './columns';
import { DataTable } from './data-table';

async function getData() {
	return [
		{
			id: 1,
			name: 'Mayer and Sons',
			country: 'Sweden',
			foundingDate: '2021-06-11T02:09:34.000Z',
			description: 'Secured scalable standardization',
			deals: [],
		},
		{
			id: 2,
			name: 'Bartoletti and Sons',
			country: null,
			foundingDate: '1970-01-01T00:00:00.000Z',
			description: 'Sharable contextually-based instruction set',
			deals: [
				{
					id: 133,
					date: '2024-12-04T09:42:51.122Z',
					fundingAmount: 1066091,
					fundingRound: 'Series B',
				},
				{
					id: 79,
					date: '1970-01-19T16:58:25.801Z',
					fundingAmount: 2211958,
					fundingRound: 'Seed',
				},
			],
		},
		{
			id: 3,
			name: 'West, Abernathy and Monahan',
			country: 'Azerbaijan',
			foundingDate: '2021-01-27T00:08:32.000Z',
			description: null,
			deals: [],
		},
		{
			id: 4,
			name: 'Pagac-Bechtelar',
			country: 'Indonesia',
			foundingDate: '1970-01-01T00:00:00.000Z',
			description: null,
			deals: [
				{
					id: 838,
					date: '1970-01-19T01:54:51.614Z',
					fundingAmount: 1150751,
					fundingRound: 'Series A',
				},
				{
					id: 854,
					date: '1970-01-19T12:19:44.099Z',
					fundingAmount: 4956694,
					fundingRound: 'Series A',
				},
			],
		},
	];
}

export default async function Home() {
	const companies = await getData();
	const data = companies.map(company => {
		return {
			...company,
			foundingDate: new Date(company.foundingDate).toLocaleDateString(),
			deals: company.deals.length,
		};
	});

	return (
		<div className='container mx-auto py-10'>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
