import React, {
    useCallback,
    type FunctionComponent,
} from 'react'
import { signal, useSignal } from '@preact/signals-react'
import Debug from '@substrate-system/debug'
import { type Api } from './api'
import { Button } from './components/button'
import './app.css'

export const EM_DASH = '\u2014'
export const NBSP = '\u00A0'
const debug = Debug(isDev())

// Whenever the `count` signal is updated,
// the component will re-render automatically
const count = signal(0)

/**
 * Expose state for dev and staging
 */
if (isDev()) {
    debug(`${import.meta.env?.MODE} mode`)

    // @ts-expect-error dev
    window.state = { count }

    // @ts-expect-error dev
    window.debug = debug
}

export const App:FunctionComponent<{ api:typeof Api }> = function App ({ api }) {
    const isSpinning = useSignal<boolean>(false)
    const response = useSignal<string|null>(null)

    const callApi = useCallback(async (ev:React.MouseEvent) => {
        ev.preventDefault()
        isSpinning.value = true

        try {
            const res = await api.get()
            debug('got a response...', res)
            response.value = res.hello
        } catch (_err) {
            const err = _err as Error
            debug('oh no', err)
        }

        isSpinning.value = false
    }, [])

    const setCount = useCallback(async (ev:React.MouseEvent) => {
        ev.preventDefault()

        count.value++
    }, [])

    return (
        <>
            <h1>Vite + React</h1>

            <p>
                This demonstrates front-end state with{NBSP}
                <code>@preact/signals</code>, and shows calling our API
                with <code>ky</code>. The button will show an animation
                while the request is resolving. See the console where we are
                using <code>@substrate-system/debug</code> to log
                the response.
            </p>

            <h2>
                CSS
            </h2>
            <p>
                This is using <code>@substrate-system/a11y</code> and{NBSP}
                <code>@substrate-system/css-normalize</code>.
            </p>

            <hr />

            <div className="card">
                <p>
                    <span>hello: </span>
                    <span>{'' + response.value}</span>
                </p>
                <div className='controls'>
                    <Button onClick={setCount}>
                        count is: {count}
                    </Button>
                    <Button onClick={callApi}>
                        Call the API
                    </Button>
                </div>

                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
        </>
    )
}

export default App

function isDev ():boolean {
    return (import.meta.env?.DEV || import.meta.env?.MODE !== 'production')
}
