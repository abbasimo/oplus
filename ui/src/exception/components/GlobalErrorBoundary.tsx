import { Component, ErrorInfo, ReactNode } from 'react';

interface GlobalErrorBoundaryProps {
	children: ReactNode;
}

interface GlobalErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
	constructor(props: GlobalErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error, errorInfo: null };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// You can also log the error to an error reporting service
		this.setState({ error, errorInfo });
		// eslint-disable-next-line
		console.error('Uncaught error:', error, errorInfo);
	}

	render() {
		const { children } = this.props;
		const { error, errorInfo, hasError } = this.state;

		if (hasError) {
			return (
				<div className="bg-white p-24">
					<h1 className="text-20 font-semibold">Something went wrong.</h1>
					<p className="text-14 whitespace-pre-wrap">
						{error?.toString()}
						<br />
						{errorInfo?.componentStack}
					</p>
				</div>
			);
		}

		return children;
	}
}

export default GlobalErrorBoundary;
