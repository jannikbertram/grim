import React, {useState} from 'react';
import {Box, Text} from 'ink';
import TextInput from 'ink-text-input';

type Props = {
	readonly defaultPath: string;
	readonly onSubmit: (outputPath: string) => void;
};

/**
 * Interactive input for specifying the output file path.
 */
export function OutputPathInput({defaultPath, onSubmit}: Props) {
	const [value, setValue] = useState(defaultPath);

	const handleSubmit = (submittedValue: string) => {
		// Use default if empty, otherwise use the provided value
		onSubmit(submittedValue.trim() || defaultPath);
	};

	return (
		<Box flexDirection='column'>
			<Text bold>Output file path:</Text>
			<Text dimColor>
				Press Enter to use the default path, or type a custom path.
			</Text>
			<Box marginTop={1}>
				<Text>Path: </Text>
				<TextInput
					value={value}
					onChange={setValue}
					onSubmit={handleSubmit}
				/>
			</Box>
		</Box>
	);
}
