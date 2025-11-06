import React, { type ReactNode } from 'react'

// 1. Create the Error Boundary (class component)
interface ErrorBoundaryProps {
    children:ReactNode;
}

interface ErrorBoundaryState {
    hasError:boolean;
    error:Error|null;
    errorInfo:React.ErrorInfo|null;
}

export class ErrorBoundary extends
    React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor (props:ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        }
    }

    static getDerivedStateFromError (_error:Error):Partial<ErrorBoundaryState> {
        // Update state so next render shows fallback UI
        return { hasError: true }
    }

    componentDidCatch (error:Error, errorInfo:React.ErrorInfo) {
        // Log the error to an error reporting service
        console.error('Error caught by boundary:', error, errorInfo)
        this.setState({
            error,
            errorInfo
        })
    }

    render () {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div style={{ padding: '20px', border: '2px solid red' }}>
                    <h2>Oops! Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        <summary>Click for error details</summary>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            )
        }

        return this.props.children
    }
}
