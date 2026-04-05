import { Button, Card, Group, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';

type Team = {
	name: string;
	score: number;
};

export function ScoreBoard() {
	const [teams, setTeams] = useState<Team[]>([
		{ name: 'Team Bride 💍', score: 0 },
		{ name: 'Team Groom 🤵‍♂️', score: 0 },
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
				<Card key={index} withBorder>
					<Stack gap="xs">
						<TextInput
							value={team.name}
							onChange={(e) => updateName(index, e.currentTarget.value)}
							placeholder="Team name"
							styles={{ input: { textAlign: 'center', fontWeight: 600 } }}
						/>

						<Text size="xl" ta="center">
							{team.score}
						</Text>

						<Group grow>
							<Button color="sage" onClick={() => updateScore(index, 200)}>
								+200
							</Button>
							<Button variant="outline" color="red" onClick={() => updateScore(index, -200)}>
								-200
							</Button>
						</Group>
					</Stack>
				</Card>
			))}
		</Group>
	);
}
