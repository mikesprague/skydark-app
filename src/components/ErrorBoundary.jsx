import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Component } from 'react';

/**
 * Error Boundary component to catch and display React errors gracefully
 * Prevents entire app from crashing when a component throws an error
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      errorInfo,
    });

    // You could also log to an error reporting service here
    // e.g., Bugsnag.notify(error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen w-full p-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-lg w-full text-center bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <FontAwesomeIcon
              icon={['fad', 'triangle-exclamation']}
              size="4x"
              className="text-red-500 mb-4"
            />
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Something went wrong
            </h1>
            <p className="text-base mb-6 text-gray-600 dark:text-gray-400">
              {this.props.fallbackMessage ||
                'An unexpected error occurred. Please try refreshing the page.'}
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mb-6 bg-gray-100 dark:bg-gray-900 rounded-md p-4">
                <summary className="cursor-pointer font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs overflow-auto max-h-64 text-red-600 dark:text-red-400 font-mono">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              type="button"
              onClick={this.handleReload}
              className="px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto bg-blue-500 text-white hover:bg-blue-600"
              aria-label="Reload page"
            >
              <FontAwesomeIcon icon={['fad', 'arrows-rotate']} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackMessage: PropTypes.string,
};

export default ErrorBoundary;
