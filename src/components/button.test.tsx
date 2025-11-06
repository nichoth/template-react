import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>)

        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('handles click events', async () => {
        const user = userEvent.setup()
        const handleClick = vi.fn()

        render(<Button onClick={handleClick}>Click me</Button>)

        await user.click(screen.getByRole('button', { name: 'Click me' }))

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('disables button while onClick is processing', async () => {
        const user = userEvent.setup()
        const handleClick = vi.fn().mockImplementation(() => {
            return new Promise(resolve => setTimeout(resolve, 100))
        })

        render(<Button onClick={handleClick}>Click me</Button>)

        const button = screen.getByRole('button', { name: 'Click me' })

        expect(button).not.toBeDisabled()

        const clickPromise = user.click(button)

        // Button should be disabled while processing
        await vi.waitFor(() => {
            expect(button).toBeDisabled()
        })

        await clickPromise
    })

    it('applies custom className', () => {
        render(<Button className="custom-class">Click me</Button>)

        const button = screen.getByRole('button', { name: 'Click me' })
        expect(button).toHaveClass('custom-class')
        expect(button).toHaveClass('btn')
    })

    it('can be disabled', () => {
        render(<Button disabled>Click me</Button>)

        expect(screen.getByRole('button', { name: 'Click me' })).toBeDisabled()
    })
})
