import { useState } from 'react';
import {
	Button,
	Modal,
	SimpleGrid,
	Title,
	Stack,
	Text,
	Group,
	Container,
	Image,
} from '@mantine/core';
import { type JeopardyQuestion, jeopardyQuestions } from './JeopardyData-shower.ts';
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
	}

	return (
		<Container fluid mih="100vh" bg="sage.0" pt={30}>
			{/* Game board */}
			<Container fluid h="100%" w="100%" p={10}>
				{/* Category headers */}
				<SimpleGrid cols={categories.length} spacing={0}>
					{categories.map((cat) => (
						<Title order={4} key={cat} ta="center" c="sage.9" fw="bold">
							{cat.toUpperCase()}
						</Title>
					))}
				</SimpleGrid>
				{values.map((value) => (
					<SimpleGrid key={value} cols={categories.length} p={10}>
						{categories.map((category) => {
							const question = questions.find(
								(q) => q.category === category && q.value === value && !q.used && !q.final
							);

							if (!question) return <div key={`${category}-${value}`} />;

							return (
								<Button
									key={question.id}
									bg={question.used ? 'sage.0' : 'white'}
									variant={question.used ? 'filled' : 'light'}
									color="sage.8"
									h={80}
									radius={0}
									disabled={question.used}
									onClick={() => openQuestion(question)}
									styles={{
										root: {
											padding: 2,
											border: question.used ? 'none' : `1px solid #d0e2bd`,
											borderTopRightRadius: 32,
											borderTopLeftRadius: 32,
										},
										inner: {
											border: question.used ? 'none' : '1px solid #d0e2bd',
											borderTopRightRadius: 30,
											borderTopLeftRadius: 30,
										},
									}}
								>
									${value}
								</Button>
							);
						})}
					</SimpleGrid>
				))}
				<Group align="flex-start" justify="center">
					<ScoreBoard />
				</Group>
			</Container>

			{/* Question modal */}
			<Modal
				opened={!!active}
				onClose={() => setActive(null)}
				size="xl"
				bg="sage"
				centered
				title={`${active?.category} - $${active?.value}`}
				styles={{
					content: { backgroundColor: 'sage' },
					title: { width: '100%', textAlign: 'center' },
				}}
			>
				{active && (
					<Stack style={{ textAlign: 'center' }}>
						{active.image && <Image src={active.image} alt={active.question} maw={400} mx="auto" />}
						<Text size="xl" fw={900} ta="center">
							{active.question}
						</Text>

						<Button mt="md" onClick={() => markUsed(active.id)} variant="white" c="sage">
							Reveal Answer
						</Button>
					</Stack>
				)}
			</Modal>
		</Container>
	);
}
