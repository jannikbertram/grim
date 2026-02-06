import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import {getAvailableModels, type Model} from '@grim/translator';

type Props = {
	readonly apiKey: string;
	readonly onSelect: (model: string) => void;
};

export function ModelSelector({apiKey, onSelect}: Props) {
	const [models, setModels] = useState<Array<{label: string; value: string}>>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | undefined>();

	useEffect(() => {
		let isMounted = true;

		const fetchModels = async () => {
			setIsLoading(true);
			setError(undefined);
			try {
				const availableModels = await getAvailableModels(apiKey);
				if (isMounted) {
					if (availableModels.length > 0) {
						setModels(availableModels);
					} else {
						setError('No models found for this API key.');
					}
				}
			} catch {
				if (isMounted) {
					setError('Failed to fetch models.');
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		void fetchModels();

		return () => {
			isMounted = false;
		};
	}, [apiKey]);

	const handleSelect = (item: {label: string; value: string}) => {
		onSelect(item.value);
	};

	if (isLoading) {
		return (
			<Box>
				<Text color="blue">
					<Spinner type="dots" /> Loading available models...
				</Text>
			</Box>
		);
	}

	if (error) {
		return (
			<Box flexDirection="column">
				<Text color="red">✖ {error}</Text>
				<Text dimColor>Please check your API key and connection.</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection='column'>
			<Text bold>Select Model:</Text>
			<Box marginTop={1}>
				<SelectInput items={models} onSelect={handleSelect} />
			</Box>
		</Box>
	);
}
