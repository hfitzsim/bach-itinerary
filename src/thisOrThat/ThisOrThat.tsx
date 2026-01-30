import { useState } from 'react';
import {
	Stack,
	Card,
	Text,
	Button,
	Title,
	Group,
	Center,
	Box,
	Container,
	Modal,
	Divider,
} from '@mantine/core';
import { thisOrThatQuestions, type ThisOrThatQuestion } from './ThisOrThatData';

type VoteMap = Record<string, 'A' | 'B' | null>;
type ModalView = 'answers' | 'score';

export function ThisOrThatPage() {
	const cherry = '#cc252c';
	const babypink = '#FADADD';

	const [votes, setVotes] = useState<VoteMap>(
		Object.fromEntries(thisOrThatQuestions.map((q) => [q.id, null]))
	);

	function handleVote(questionId: string, choice: 'A' | 'B') {
		setVotes((prev) => ({ ...prev, [questionId]: choice }));
	}

	const [opened, setOpened] = useState(false);
	const [view, setView] = useState<ModalView>('answers');

	const totalCorrect = thisOrThatQuestions.filter((q) => votes[q.id] === q.correct).length;

	return (
		<Box h="100%" w="100%" bg={babypink} py={30}>
			<Container>
				<Stack gap="lg" p="md" align="stretch">
					<Title order={1} ta="center" c={cherry}>
						This or That 💕
					</Title>
					<Text style={{ textAlign: 'center' }} c={cherry}>
						How well do you know Lauren? <br />
						Select the choice you think she would pick
					</Text>

					{thisOrThatQuestions.map((q: ThisOrThatQuestion) => (
						<Card key={q.id} padding="md" bg={babypink}>
							<Stack gap="lg">
								<Text fw={700} lineClamp={1} c={cherry} style={{ textAlign: 'center' }}>
									{q.optionA}{' '}
									<Text span fw={600} style={{ fontFamily: 'Ms Madi, cursive' }}>
										or{' '}
									</Text>
									{q.optionB}?
								</Text>

								<Group grow>
									<Button
										variant={votes[q.id] === 'A' ? 'filled' : 'outline'}
										color={cherry}
										onClick={() => handleVote(q.id, 'A')}
									>
										{q.optionA}
									</Button>
									<Button
										variant={votes[q.id] === 'B' ? 'filled' : 'outline'}
										color={cherry}
										onClick={() => handleVote(q.id, 'B')}
									>
										{q.optionB}
									</Button>
								</Group>
							</Stack>
						</Card>
					))}

					<Center mt="lg">
						<Button
							mt="lg"
							color={cherry}
							onClick={() => {
								setView('answers');
								setOpened(true);
							}}
						>
							Show Votes
						</Button>
					</Center>
				</Stack>
			</Container>

			{/* Results Modal */}
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title={view === 'answers' ? 'Your Answers' : 'Final Score'}
				size="lg"
				centered
			>
				{view === 'answers' && (
					<Stack>
						{thisOrThatQuestions.map((q) => (
							<div key={q.id}>
								<Text fw={500} lineClamp={1}>
									{q.optionA} or {q.optionB}?
								</Text>
								<Text size="sm">
									Your answer:{' '}
									<strong>
										{votes[q.id] === 'A'
											? q.optionA
											: votes[q.id] === 'B'
												? q.optionB
												: 'No answer'}
									</strong>
								</Text>
								<Divider my="sm" />
							</div>
						))}

						<Button onClick={() => setView('score')} color={babypink} mb={30}>
							<Text size="sm" fw="bold" c={cherry}>
								Reveal Final Score 🎉
							</Text>
						</Button>
					</Stack>
				)}

				{view === 'score' && (
					<Stack align="center">
						<Title order={2}>
							{totalCorrect} / {thisOrThatQuestions.length}
						</Title>
						<Text>
							{totalCorrect < 5
								? 'Get to know the bride ❤️‍🩹'
								: totalCorrect < 10
									? 'You know the bride 💖'
									: 'Neal has competition ❤️‍🔥'}
						</Text>

						<Button variant="transparent" onClick={() => setOpened(false)} color={babypink}>
							<Text size="sm" fw="bold" c={cherry}>
								Close
							</Text>
						</Button>
					</Stack>
				)}
			</Modal>
		</Box>
	);
}
