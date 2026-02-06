import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import type {RevisionSuggestion} from '@rire/core';

type Props = {
	readonly suggestions: RevisionSuggestion[];
	readonly onComplete: (accepted: RevisionSuggestion[]) => void;
};

/**
 * Interactive component for reviewing revision suggestions one by one.
 * Users can accept/skip individual suggestions or bulk accept/skip all remaining.
 */
export function RevisionReview({suggestions, onComplete}: Props) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [accepted, setAccepted] = useState<RevisionSuggestion[]>([]);

	const current = suggestions[currentIndex];
	const remaining = suggestions.length - currentIndex;

	useInput((input, key) => {
		if (!current) {
			return;
		}

		if (input === 'a' || input === 'A') {
			// Accept current suggestion
			setAccepted(previous => [...previous, current]);
			if (currentIndex < suggestions.length - 1) {
				setCurrentIndex(previous => previous + 1);
			} else {
				onComplete([...accepted, current]);
			}
		} else if (input === 's' || input === 'S') {
			// Skip current suggestion
			if (currentIndex < suggestions.length - 1) {
				setCurrentIndex(previous => previous + 1);
			} else {
				onComplete(accepted);
			}
		} else if (key.return) {
			// Accept all remaining
			const remainingSuggestions = suggestions.slice(currentIndex);
			onComplete([...accepted, ...remainingSuggestions]);
		} else if (key.escape) {
			// Skip all remaining
			onComplete(accepted);
		}
	});

	if (!current) {
		return (
			<Box>
				<Text color='green'>✓ Review complete! Accepted {accepted.length} suggestions.</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection='column'>
			<Box marginBottom={1}>
				<Text bold color='cyan'>
					Review Suggestions ({currentIndex + 1}/{suggestions.length})
				</Text>
			</Box>

			<Box flexDirection='column' borderStyle='round' borderColor='gray' paddingX={1}>
				<Box>
					<Text bold>Key: </Text>
					<Text>{current.key}</Text>
				</Box>

				<Box marginTop={1} flexDirection='column'>
					<Text bold color='red'>Original:</Text>
					<Text>{current.original}</Text>
				</Box>

				<Box marginTop={1} flexDirection='column'>
					<Text bold color='green'>Suggested:</Text>
					<Text>{current.suggested}</Text>
				</Box>

				<Box marginTop={1}>
					<Text bold>Reason: </Text>
					<Text dimColor>{current.reason}</Text>
				</Box>

				<Box marginTop={1}>
					<Text bold>Type: </Text>
					<Text color='yellow'>{current.type}</Text>
				</Box>
			</Box>

			<Box marginTop={1} flexDirection='column'>
				<Text dimColor>
					[A] Accept  [S] Skip  [Enter] Accept all remaining ({remaining})  [Esc] Skip all remaining
				</Text>
			</Box>

			<Box marginTop={1}>
				<Text dimColor>
					Accepted so far: {accepted.length}
				</Text>
			</Box>
		</Box>
	);
}
