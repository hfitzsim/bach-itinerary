import { Card, Group, Stack, Text } from '@mantine/core';
import { type Team } from '../types/types';

export function ScoreBoard({ teams }: { teams: Team[] }) {
	return (
		<Group mr={10}>
			{teams.map((team, index) => (
				<Card
					key={index}
					withBorder
					p="xs"
					styles={{
						root: {
							border: '1px solid #d0e2bd',
							borderTopRightRadius: 32,
							borderTopLeftRadius: 32,
						},
					}}
				>
					<Stack
						gap="xs"
						styles={{
							root: {
								border: '1px solid #d0e2bd',
								borderTopRightRadius: 30,
								borderTopLeftRadius: 30,
							},
						}}
					>
						<Text>{team.name}</Text>

						<Text size="xl" ta="center">
							{team.score}
						</Text>
					</Stack>
				</Card>
			))}
		</Group>
	);
}
