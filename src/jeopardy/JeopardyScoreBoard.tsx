import { ActionIcon, Button, Card, Group, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';

type Team = {
	name: string;
	score: number;
};

export function ScoreBoard() {
	const [teams, setTeams] = useState<Team[]>([
		{ name: 'Team 1', score: 0 },
		{ name: 'Team 2', score: 0 },
		{ name: 'Team 3', score: 0 },
		{ name: 'Team 4', score: 0 },
	]);

	function updateScore(index: number, delta: number) {
		setTeams((prev) =>
			prev.map((team, i) => (i === index ? { ...team, score: team.score + delta } : team))
		);
	}

	function updateName(index: number, name: string) {
		setTeams((prev) => prev.map((team, i) => (i === index ? { ...team, name } : team)));
	}

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
						<TextInput
							value={team.name}
							onChange={(e) => updateName(index, e.currentTarget.value)}
							placeholder="Team name"
							styles={{
								input: {
									textAlign: 'center',
									fontWeight: 600,
									border: 'none',
									background: 'transparent',
								},
							}}
						/>

						<Text size="xl" ta="center">
							{team.score}
						</Text>

						<Group justify="center" p={10}>
							<Button
								radius="xl"
								p={0}
								h={60}
								w={60}
								size="xl"
								c="sage.7"
								variant="outline"
								styles={{ root: { border: '1px solid #d0e2bd' } }}
							>
								-
							</Button>
							<Button
								radius="xl"
								p={0}
								h={60}
								w={60}
								size="xl"
								c="sage.7"
								variant="outline"
								styles={{ root: { border: '1px solid #d0e2bd' } }}
							>
								+
							</Button>
						</Group>
					</Stack>
				</Card>
			))}
		</Group>
	);
}
