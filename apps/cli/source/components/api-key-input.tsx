import React, {useState} from 'react';
import {Box, Text} from 'ink';
import TextInput from 'ink-text-input';
import {verifyApiKey} from '@grim/translator';
import Spinner from 'ink-spinner';

type Props = {
	readonly provider: string;
	readonly onSubmit: (apiKey: string) => void;
};

export function ApiKeyInput({provider, onSubmit}: Props) {
	const [value, setValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | undefined>();

	const handleSubmit = async (submittedValue: string) => {
		const trimmedValue = submittedValue.trim();
		if (!trimmedValue) {
			return;
		}

		setIsLoading(true);
		setError(undefined);

		try {
			const isValid = await verifyApiKey(trimmedValue);
			if (isValid) {
				onSubmit(trimmedValue);
			} else {
				setError('Invalid API Key. Please check and try again.');
			}
		} catch {
			setError('Failed to verify API key. Please check your connection.');
		} finally {
			setIsLoading(false);
		}
	};

	const providerName
		= {
			gemini: 'Google AI Studio',
			openai: 'OpenAI',
			anthropic: 'Anthropic',
		}[provider] ?? provider;

	return (
		<Box flexDirection='column'>
			<Text bold>Enter your {providerName} API Key:</Text>
			<Text dimColor>(Get one at https://aistudio.google.com/apikey)</Text>
			<Box marginTop={1}>
				<Text>API Key: </Text>
				<TextInput
					mask='*'
					value={value}
					onChange={(newValue) => {
						setValue(newValue);
						setError(undefined);
					}}
					onSubmit={handleSubmit}
				/>
			</Box>
			{isLoading && (
				<Box marginTop={1}>
					<Text color="blue">
						<Spinner type="dots" /> Verifying API key...
					</Text>
				</Box>
			)}
			{error && (
				<Box marginTop={1}>
					<Text color="red">✖ {error}</Text>
				</Box>
			)}
		</Box>
	);
}
