import { useState } from 'react';
import {
	Button,
	Modal,
	SimpleGrid,
	Stack,
	Grid,
	Text,
	Title,
	Divider,
	Spoiler,
	Container,
} from '@mantine/core';
import { type JeopardyQuestion, jeopardyQuestions } from './JeopardyData.ts';
import { ScoreBoard } from './JeopardyScoreBoard.tsx';

export function Jeopardy() {
	const [questions, setQuestions] = useState<JeopardyQuestion[]>(jeopardyQuestions);
	const [active, setActive] = useState<JeopardyQuestion | null>(null);

	const categories = Array.from(new Set(questions.map((q) => q.category)));
	const values = Array.from(new Set(questions.map((q) => q.value))).sort((a, b) => a - b);

	function openQuestion(question: JeopardyQuestion) {
		setActive(question);
	}

	function markUsed(id: string) {
		setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, used: true } : q)));
		setActive(null);
	}

	return (
		<>
			<Stack>
				<Title order={1} ta="center">
					Jeopardy 💍
				</Title>

				{/* Game board */}
				<Container bg="icy-blue" fluid h="100%" w="100%" p={10}>
					<Grid>
						<Grid.Col span={{ base: 12, md: 9 }}>
							{/* Category headers */}
							<SimpleGrid cols={categories.length}>
								{categories.map((cat) => (
									<Text key={cat} ta="center" c="white" fw="bold">
										{cat}
									</Text>
								))}
							</SimpleGrid>
							{values.map((value) => (
								<SimpleGrid key={value} cols={categories.length} p={10}>
									{categories.map((category) => {
										const question = questions.find(
											(q) => q.category === category && q.value === value
										);

										if (!question) return <div key={`${category}-${value}`} />;

										return (
											<Button
												key={question.id}
												variant={question.used ? 'filled' : 'outline'}
												color="white"
												h={80}
												disabled={question.used}
												onClick={() => openQuestion(question)}
											>
												${value}
											</Button>
										);
									})}
								</SimpleGrid>
							))}{' '}
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 3 }}>
							<ScoreBoard />
						</Grid.Col>{' '}
					</Grid>
				</Container>
			</Stack>

			{/* Question modal */}
			<Modal
				opened={!!active}
				onClose={() => setActive(null)}
				centered
				size="lg"
				title={active?.category}
			>
				{active && (
					<Stack style={{ textAlign: 'center' }}>
						<Text size="xl">{active.question}</Text>

						<Divider />

						<Spoiler maxHeight={0} showLabel="Show answer" hideLabel="Hide answer">
							<Text fw={600}>{active.answer}</Text>
						</Spoiler>

						<Button mt="md" onClick={() => markUsed(active.id)}>
							Mark as used
						</Button>
					</Stack>
				)}
			</Modal>
		</>
	);
}
