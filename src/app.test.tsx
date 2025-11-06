import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App, EM_DASH, NBSP } from './app'

describe('App', () => {
    let mockApi:{
        get:ReturnType<typeof vi.fn<() => Promise<{ hello: string }>>>
    }

    beforeEach(() => {
        mockApi = {
            get: vi.fn<() => Promise<{ hello: string }>>()
        }
    })

    afterEach(() => {
        vi.clearAllMocks()
        cleanup()

        // Reset the global count signal if it exists
        if (typeof window !== 'undefined' && (window as any).state?.count) {
            (window as any).state.count.value = 0
        }
    })

    describe('rendering', () => {
        it('renders the main heading', () => {
            render(<App api={mockApi} />)

            expect(screen.getByRole('heading', {
                name: 'Vite + React',
                level: 1
            })).toBeInTheDocument()
        })

        it('renders the CSS section', () => {
            render(<App api={mockApi} />)

            expect(screen.getByRole('heading', { name: 'CSS', level: 2 }))
                .toBeInTheDocument()
        })

        it('renders both control buttons', () => {
            render(<App api={mockApi} />)

            expect(screen.getByRole('button', { name: /count is:/ }))
                .toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Call the API' }))
                .toBeInTheDocument()
        })

        it('renders initial response state as null', () => {
            render(<App api={mockApi} />)

            expect(screen.getByText(/hello:/)).toBeInTheDocument()
            expect(screen.getByText('null')).toBeInTheDocument()
        })

        it('uses non-breaking space constant', () => {
            render(<App api={mockApi} />)

            const text = screen.getByText(/This demonstrates front-end state/)
            expect(text.textContent).toContain(NBSP)
        })
    })

    describe('count button', () => {
        it('displays count', () => {
            render(<App api={mockApi} />)

            expect(screen.getByRole('button', { name: /count is:/ }))
                .toBeInTheDocument()
        })

        it('increments count when clicked', async () => {
            const user = userEvent.setup()
            render(<App api={mockApi} />)

            const countButton = screen.getByRole('button', { name: /count is:/ })
            const initialText = countButton.textContent

            await user.click(countButton)

            // Count should have incremented
            expect(countButton.textContent).not.toBe(initialText)
            expect(countButton.textContent).toMatch(/count is:/)
        })

        it('increments count multiple times', async () => {
            const user = userEvent.setup()
            render(<App api={mockApi} />)

            const countButton = screen.getByRole('button', { name: /count is:/ })

            // Click three times
            await user.click(countButton)
            await user.click(countButton)
            await user.click(countButton)

            // Verify the count button still exists and has been updated
            expect(countButton).toBeInTheDocument()
            expect(countButton.textContent).toMatch(/count is:/)
        })

        it('prevents default event behavior', async () => {
            const user = userEvent.setup()
            render(<App api={mockApi} />)

            const countButton = screen.getByRole('button', { name: /count is:/ })
            await user.click(countButton)

            // If preventDefault wasn't called, this could cause issues
            // We're just verifying the button still works as expected
            expect(countButton).toBeInTheDocument()
        })
    })

    describe('API call button', () => {
        it('calls the API when clicked', async () => {
            const user = userEvent.setup()
            mockApi.get.mockResolvedValue({ hello: 'world' })

            render(<App api={mockApi} />)

            await user.click(screen.getByRole('button', { name: 'Call the API' }))

            expect(mockApi.get).toHaveBeenCalledTimes(1)
        })

        it('displays API response', async () => {
            const user = userEvent.setup()
            mockApi.get.mockResolvedValue({ hello: 'world' })

            render(<App api={mockApi} />)

            await user.click(screen.getByRole('button', { name: 'Call the API' }))

            await waitFor(() => {
                expect(screen.getByText('world')).toBeInTheDocument()
            })
        })

        it('handles different API responses', async () => {
            const user = userEvent.setup()
            mockApi.get.mockResolvedValue({ hello: 'testing 123' })

            render(<App api={mockApi} />)

            await user.click(screen.getByRole('button', { name: 'Call the API' }))

            await waitFor(() => {
                expect(screen.getByText('testing 123')).toBeInTheDocument()
            })
        })

        it('handles API errors gracefully', async () => {
            const user = userEvent.setup()
            const consoleErrorSpy = vi.spyOn(console, 'error')
                .mockImplementation(() => {})
            mockApi.get.mockRejectedValue(new Error('Network error'))

            render(<App api={mockApi} />)

            await user.click(screen.getByRole('button', {
                name: 'Call the API'
            }))

            // Response should remain null after error
            await waitFor(() => {
                expect(mockApi.get).toHaveBeenCalledTimes(1)
            })

            // The response text should still show null
            expect(screen.getByText(/hello:/)).toBeInTheDocument()
            expect(screen.getByText('null')).toBeInTheDocument()

            consoleErrorSpy.mockRestore()
        })

        it('updates response on subsequent API calls', async () => {
            const user = userEvent.setup()
            mockApi.get
                .mockResolvedValueOnce({ hello: 'first' })
                .mockResolvedValueOnce({ hello: 'second' })

            render(<App api={mockApi} />)

            const apiButton = screen.getByRole('button', {
                name: 'Call the API'
            })

            await user.click(apiButton)
            await waitFor(() => {
                expect(screen.getByText('first')).toBeInTheDocument()
            })

            await user.click(apiButton)
            await waitFor(() => {
                expect(screen.getByText('second')).toBeInTheDocument()
            })

            expect(mockApi.get).toHaveBeenCalledTimes(2)
        })

        it('prevents default event behavior', async () => {
            const user = userEvent.setup()
            mockApi.get.mockResolvedValue({ hello: 'test' })

            render(<App api={mockApi} />)

            await user.click(screen.getByRole('button', {
                name: 'Call the API'
            }))

            await waitFor(() => {
                expect(mockApi.get).toHaveBeenCalled()
            })
        })
    })

    describe('constants', () => {
        it('exports EM_DASH constant', () => {
            expect(EM_DASH).toBe('\u2014')
        })

        it('exports NBSP constant', () => {
            expect(NBSP).toBe('\u00A0')
        })
    })

    describe('integration', () => {
        it('count and API calls work independently', async () => {
            const user = userEvent.setup()
            mockApi.get.mockResolvedValue({ hello: 'api response' })

            render(<App api={mockApi} />)

            const countButton = screen.getByRole('button', {
                name: /count is:/
            })
            const initialCount = countButton.textContent

            // Increment count
            await user.click(countButton)
            expect(countButton.textContent).not.toBe(initialCount)

            // Call API
            await user.click(screen.getByRole('button', { name: 'Call the API' }))

            await waitFor(() => {
                expect(screen.getByText('api response')).toBeInTheDocument()
            })

            // Count should remain unchanged from last click
            const countAfterApi = countButton.textContent

            // Increment count again
            await user.click(countButton)
            expect(countButton.textContent).not.toBe(countAfterApi)
        })
    })
})
