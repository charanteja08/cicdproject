import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const initialForm = {
	cropName: '',
	cropType: '',
	quantity: '',
	price: '',
	harvestDate: '',
	location: '',
	description: '',
	image: null
};

function AddCropForm({ farmerId }) {
	const [form, setForm] = useState(initialForm);
	const [status, setStatus] = useState({ type: '', msg: '' });
	const [submitting, setSubmitting] = useState(false);
	const [currentFarmerId, setCurrentFarmerId] = useState(farmerId || localStorage.getItem('farmerId'));

	// Try to get farmerId on mount and when farmerId prop changes
	useEffect(() => {
		async function ensureFarmerId() {
			const role = localStorage.getItem('role');
			if (role !== 'FARMER') {
				setStatus({ type: 'error', msg: 'Only farmers can add crops. Please login as a farmer.' });
				return;
			}

			let effectiveFarmerId = farmerId || localStorage.getItem('farmerId');
			
			if (!effectiveFarmerId) {
				// Try to fetch farmer by email
				const email = localStorage.getItem('email');
				if (email) {
					try {
						const byEmail = await fetch(`${API_BASE_URL}/farmers/by-email?email=${encodeURIComponent(email)}`);
						if (byEmail.ok) {
							const f = await byEmail.json();
							effectiveFarmerId = f.id;
							localStorage.setItem('farmerId', effectiveFarmerId);
							setCurrentFarmerId(effectiveFarmerId);
						} else {
							// Create farmer if not found
							const name = localStorage.getItem('name') || 'Farmer';
							const createRes = await fetch(`${API_BASE_URL}/farmers`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ name, email })
							});
							if (createRes.ok) {
								const f = await createRes.json();
								effectiveFarmerId = f.id;
								localStorage.setItem('farmerId', effectiveFarmerId);
								setCurrentFarmerId(effectiveFarmerId);
							} else {
								setStatus({ type: 'error', msg: 'Could not create farmer profile. Please contact support.' });
							}
						}
					} catch (err) {
						setStatus({ type: 'error', msg: 'Could not retrieve farmer information. Please try logging in again.' });
					}
				} else {
					setStatus({ type: 'error', msg: 'Missing farmer information. Please login again as a farmer.' });
				}
			} else {
				setCurrentFarmerId(effectiveFarmerId);
			}
		}
		ensureFarmerId();
	}, [farmerId]);

	function handleChange(e) {
		const { name, value, files } = e.target;
		if (name === 'image') {
			const file = files && files[0];
			if (file) {
				// Validate file type
				const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
				if (!validTypes.includes(file.type)) {
					setStatus({ type: 'error', msg: 'Please upload a valid image file (PNG, JPEG, JPG, GIF, or WEBP)' });
					return;
				}
				// Validate file size (max 10MB)
				if (file.size > 10 * 1024 * 1024) {
					setStatus({ type: 'error', msg: 'Image size should be less than 10MB' });
					return;
				}
				setForm(prev => ({ ...prev, image: file }));
				setStatus({ type: '', msg: '' });
			}
		} else {
			setForm(prev => ({ ...prev, [name]: value }));
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setStatus({ type: '', msg: '' });
		
		if (!currentFarmerId) {
			setStatus({ type: 'error', msg: 'Missing farmer ID. Please login again as a farmer.' });
			return;
		}
		
		// Ensure farmerId is a number
		const farmerIdNum = Number(currentFarmerId);
		if (isNaN(farmerIdNum) || farmerIdNum <= 0) {
			setStatus({ type: 'error', msg: 'Invalid farmer ID. Please login again as a farmer.' });
			return;
		}
		
		try {
			setSubmitting(true);
			const data = new FormData();
			data.append('cropName', form.cropName);
			data.append('cropType', form.cropType);
			data.append('quantity', form.quantity);
			data.append('price', form.price);
			data.append('harvestDate', form.harvestDate);
			data.append('location', form.location);
			data.append('description', form.description);
			if (form.image) data.append('image', form.image);

			const url = `${API_BASE_URL}/farmers/${farmerIdNum}/crops`;
			console.log('Submitting crop to:', url); // Debug log
			const response = await axios.post(url, data, { 
				headers: { 'Content-Type': 'multipart/form-data' } 
			});
			setStatus({ type: 'success', msg: 'Crop added successfully!' });
			setForm(initialForm);
		} catch (err) {
			console.error('Error adding crop:', err); // Debug log
			console.error('Response:', err?.response); // Debug log
			const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || `Failed to add crop. ${err?.response?.status ? `Status: ${err.response.status}` : ''}`;
			setStatus({ type: 'error', msg });
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div style={{ maxWidth: 760, margin: '8px auto' }}>
			<form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
				<div style={{ marginBottom: 10 }}>
					<label style={{ color: '#225c2b', fontWeight: 600 }}>Crop Name</label>
					<input name="cropName" value={form.cropName} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d9e2da' }} />
				</div>
				<div style={{ marginBottom: 10 }}>
					<label style={{ color: '#225c2b', fontWeight: 600 }}>Category</label>
					<select name="cropType" value={form.cropType} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d9e2da', backgroundColor: 'white', cursor: 'pointer' }}>
						<option value="">Select Category</option>
						<option value="Vegetables">Vegetables</option>
						<option value="Seeds & Saplings">Seeds & Saplings</option>
					</select>
				</div>
				<div style={{ display: 'flex', gap: 12 }}>
					<div style={{ flex: 1 }}>
						<label style={{ color: '#225c2b', fontWeight: 600 }}>Quantity</label>
						<input type="number" name="quantity" value={form.quantity} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d9e2da' }} />
					</div>
					<div style={{ flex: 1 }}>
						<label style={{ color: '#225c2b', fontWeight: 600 }}>Price</label>
						<input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d9e2da' }} />
					</div>
				</div>
				<div>
					<label style={{ color: '#225c2b', fontWeight: 600 }}>Harvest Date</label>
					<input type="date" name="harvestDate" value={form.harvestDate} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d9e2da' }} />
				</div>
				<div style={{ marginBottom: 10 }}>
					<label style={{ color: '#225c2b', fontWeight: 600 }}>Location</label>
					<input name="location" value={form.location} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d9e2da' }} />
				</div>
				<div style={{ marginBottom: 10 }}>
					<label style={{ color: '#225c2b', fontWeight: 600 }}>Description</label>
					<textarea name="description" value={form.description} onChange={handleChange} rows={4} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d9e2da' }} />
				</div>
				<div style={{ marginBottom: 10 }}>
					<label style={{ color: '#225c2b', fontWeight: 600 }}>Image (PNG, JPEG, JPG, GIF, or WEBP - Max 10MB)</label>
					<input type="file" name="image" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" onChange={handleChange} />
					{form.image && (
						<div style={{ marginTop: 8, fontSize: '0.9rem', color: '#666' }}>
							Selected: {form.image.name} ({(form.image.size / 1024).toFixed(2)} KB)
						</div>
					)}
				</div>
				<button type="submit" disabled={submitting} style={{ background: '#2e7d32', color: 'white', border: 0, padding: '12px 16px', borderRadius: 8, cursor: 'pointer' }}>{submitting ? 'Submitting...' : 'Add Crop'}</button>
			</form>
			{status.msg && (
				<p style={{ color: status.type === 'error' ? '#c62828' : '#2e7d32', fontWeight: 600 }}>{status.msg}</p>
			)}
		</div>
	);
}

export default AddCropForm;


