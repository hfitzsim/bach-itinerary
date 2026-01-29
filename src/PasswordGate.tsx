import { useState, useEffect } from 'react';
import { Box, Button, Center, PasswordInput, Paper, Stack, Text } from '@mantine/core';

const PASSWORD = 'Switzerland';

export function PasswordGate({ children }: { children: React.ReactNode }) {
	const [entered, setEntered] = useState('');
	const [unlocked, setUnlocked] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const isUnlocked = sessionStorage.getItem('itinerary-unlocked');
		if (isUnlocked === 'true') {
			setUnlocked(true);
		}
	}, []);

	const handleSubmit = () => {
		if (entered === PASSWORD) {
			sessionStorage.setItem('itinerary-unlocked', 'true');
			setUnlocked(true);
		} else {
			setError(true);
		}
	};

	if (unlocked) {
		return <>{children}</>;
	}

	return (
		<Box style={{ position: 'relative' }}>
			{/* Blurred background */}
			<Box
				style={{
					filter: 'blur(6px)',
					pointerEvents: 'none',
					userSelect: 'none',
				}}
			>
				{children}
			</Box>

			{/* Overlay */}
			<Center
				style={{
					position: 'fixed',
					inset: 0,
					backgroundColor: 'rgba(255,255,255,0.85)',
					zIndex: 10,
				}}
			>
				<Paper radius="md" p="xl" shadow="lg" w={320}>
					<Stack>
						<Text fw={600} ta="center">
							What country did Lauren and Neal visit for their first international trip? ✨
						</Text>

						<PasswordInput
							placeholder="Password"
							value={entered}
							error={error && 'Incorrect password'}
							onChange={(e) => {
								setEntered(e.currentTarget.value);
								setError(false);
							}}
							onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
						/>

						<Button onClick={handleSubmit} fullWidth>
							Unlock itinerary
						</Button>
					</Stack>
				</Paper>
			</Center>
		</Box>
	);
}
