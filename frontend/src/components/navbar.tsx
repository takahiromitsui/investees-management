import MaxWidthWrapper from './max-width-wrapper';

export async function Navbar() {
	return (
		<div className='bg-white sticky z-50 top-0 inset-x-0 h-16'>
			<header className='relative bg-white'>
				<MaxWidthWrapper>
					<h1 className='text-xl font-bold text-gray-800 border-b border-gray-200 py-8'>
						Investee Management Dashboard
					</h1>
				</MaxWidthWrapper>
			</header>
		</div>
	);
}
