import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme.ts';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<MantineProvider theme={theme}>
			<HashRouter>
				<App />
			</HashRouter>
		</MantineProvider>
	</StrictMode>
);
