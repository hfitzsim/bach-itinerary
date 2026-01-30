import { Modal, Text, Stack, List } from '@mantine/core';

const linedPaperStyle = {
	backgroundImage: `
    linear-gradient(
      to bottom,
      transparent 95%,
	  #e5f6ff 95%
    )
  `,
	backgroundSize: '100% 32px',
};

export const PackingList = ({ opened, onClose }: { opened: boolean; onClose: () => void }) => {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="🧳 Packing List"
			centered
			size="lg"
			styles={{
				title: {
					fontFamily: 'Over the Rainbow, cursive',
					fontSize: 26,
				},
				body: {
					...linedPaperStyle,
					padding: '24px',
					fontFamily: 'Over the Rainbow, cursive',
				},
			}}
		>
			<Stack gap="md">
				<List
					listStyleType="none"
					spacing="sm"
					styles={{
						itemLabel: {
							fontSize: 20,
							lineHeight: '32px',
						},
					}}
				>
					<List.Item>❄️ Warm layers (snow pants, coat, scarf, etc.)</List.Item>
					<List.Item>🥾 Comfy, warm, water-resistant snow boots or walking shoes</List.Item>
					<List.Item>💤 Cozy pajama bottoms or shorts</List.Item>
					<List.Item>👙 Swimsuit, sandals, reusable water bottle & waterproof bag</List.Item>
					<List.Item>🧘 Workout clothes for pilates (light blue / greyish blue tones)</List.Item>
					<List.Item>💅🏻 One going-out outfit (pink and/or red — cherry, burgundy)</List.Item>
				</List>

				{/* <Text ta="right" c="dimmed" fs="italic">
					✨ Subject to last-minute bride decisions ✨
				</Text> */}
			</Stack>
		</Modal>
	);
};
