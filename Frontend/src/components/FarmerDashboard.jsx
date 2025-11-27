import React from 'react';
import AddCropForm from './AddCropForm';
import FarmerCropsList from './FarmerCropsList';
import FarmerNavBar from './FarmerNavBar';

function FarmerDashboard({ farmerId }) {
	const effectiveFarmerId = farmerId || localStorage.getItem('farmerId');
	const heroStyle = {
		background: 'linear-gradient(rgba(34,92,43,0.85), rgba(34,92,43,0.85)), url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop) center/cover no-repeat',
		color: 'white',
		padding: '64px 16px',
		textAlign: 'center',
	};

	const container = {
		maxWidth: 1200,
		margin: '0 auto',
		padding: '24px 16px',
	};

	const section = {
		background: 'white',
		borderRadius: 12,
		boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
		padding: 24,
		marginBottom: 24,
	};

	const heading = {
		color: '#225c2b',
		margin: '0 0 12px 0',
	};

	return (
		<div style={{ background: '#f5f9f5', minHeight: '100vh' }}>
			<FarmerNavBar />
			<header style={heroStyle}>
				<h1 style={{ fontSize: 36, margin: 0 }}>Farmer Portal</h1>
				<p style={{ opacity: 0.95, marginTop: 8 }}>Manage your crop listings and showcase fresh produce to buyers.</p>
			</header>
			<main style={container}>
				<section style={section}>
					<h2 style={heading}>Add New Crop</h2>
					<p style={{ color: '#4b5a4f', marginTop: 0 }}>Fill the details below to publish a new listing. High-quality images help your crops stand out.</p>
					<AddCropForm farmerId={effectiveFarmerId} />
				</section>
				<section style={section}>
					<h2 style={heading}>Your Listings</h2>
					<FarmerCropsList farmerId={effectiveFarmerId} />
				</section>
			</main>
		</div>
	);
}

export default FarmerDashboard;


