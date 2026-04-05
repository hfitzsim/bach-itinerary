import { useRef, useState, useCallback } from 'react';
import { Card, ActionIcon, Group, Box } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';

// Jeopardy theme — note frequencies (Hz) and durations (seconds)
// Format: [frequency, duration]
const JEOPARDY_NOTES: [number, number][] = [
	[392, 0.3],
	[294, 0.15],
	[330, 0.15],
	[392, 0.3],
	[294, 0.15],
	[330, 0.15],
	[392, 0.15],
	[330, 0.15],
	[294, 0.15],
	[262, 0.3],
	[220, 0.3],
	[262, 0.3],
	[294, 0.6],
	[392, 0.3],
	[294, 0.15],
	[330, 0.15],
	[392, 0.3],
	[294, 0.15],
	[330, 0.15],
	[392, 0.15],
	[440, 0.15],
	[494, 0.15],
	[523, 0.3],
	[494, 0.15],
	[440, 0.15],
	[392, 0.6],
];

function playJeopardyTheme(audioCtx: AudioContext, onEnd: () => void): () => void {
	let time = audioCtx.currentTime;
	const oscillators: OscillatorNode[] = [];

	for (const [freq, dur] of JEOPARDY_NOTES) {
		const osc = audioCtx.createOscillator();
		const gain = audioCtx.createGain();

		osc.type = 'square';
		osc.frequency.setValueAtTime(freq, time);

		gain.gain.setValueAtTime(0.18, time);
		gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.9);

		osc.connect(gain);
		gain.connect(audioCtx.destination);

		osc.start(time);
		osc.stop(time + dur);
		oscillators.push(osc);

		time += dur;
	}

	const timeoutId = window.setTimeout(onEnd, (time - audioCtx.currentTime) * 1000);

	// Return a cancel function
	return () => {
		clearTimeout(timeoutId);
		oscillators.forEach((osc) => {
			try {
				osc.stop();
			} catch (_) {
				/* already stopped */
			}
		});
	};
}

const JeopardyPlayRound = () => {
	const [playing, setPlaying] = useState(false);
	const audioCtxRef = useRef<AudioContext | null>(null);
	const cancelRef = useRef<(() => void) | null>(null);

	const handlePlay = useCallback(() => {
		if (playing) {
			// Stop
			cancelRef.current?.();
			cancelRef.current = null;
			setPlaying(false);
			return;
		}

		// Start
		if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
			audioCtxRef.current = new AudioContext();
		}

		setPlaying(true);
		cancelRef.current = playJeopardyTheme(audioCtxRef.current, () => {
			setPlaying(false);
		});
	}, [playing]);

	return (
		<Card
			shadow="xl"
			radius={0}
			ml={10}
			style={{
				width: 200,
				background: 'white',
				transition: 'all 0.4s ease',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Subtle animated glow when playing */}
			{playing && (
				<Box
					style={{
						position: 'absolute',
						inset: 0,
						background:
							'radial-gradient(ellipse at 50% 0%, rgba(79,142,247,0.12) 0%, transparent 70%)',
						pointerEvents: 'none',
						animation: 'pulse 1.5s ease-in-out infinite',
					}}
				/>
			)}

			<style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes spin-ring {
          to { transform: rotate(360deg); }
        }
      `}</style>

			<Group gap="sm" align="center">
				<ActionIcon
					size={64}
					radius="xl"
					onClick={handlePlay}
					style={{
						background: playing
							? 'linear-gradient(135deg, #dc2626, #991b1b)'
							: 'linear-gradient(135deg, #9CAF88, #71825e)',
						border: 'none',
						transition: 'all 0.3s ease',
						transform: playing ? 'scale(0.95)' : 'scale(1)',
					}}
					aria-label={playing ? 'Stop' : 'Play Jeopardy theme'}
				>
					{playing ? (
						<IconPlayerStop size={28} color="white" />
					) : (
						<IconPlayerPlay size={28} color="white" />
					)}
				</ActionIcon>
			</Group>
		</Card>
	);
};

export { JeopardyPlayRound };
