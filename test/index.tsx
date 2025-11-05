import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import App from '../src/app'

/**
 * Pass in a mock API for tests.
 */
const Api = {
    get: async function ():Promise<{ hello:string }> {
        return { hello: 'test' }
    }
}

test('Start', async t => {
    document.body.innerHTML += '<div id="root"></div>'

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App api={Api} />
        </StrictMode>,
    )

    const node = await waitFor('div.card')
    t.ok(node, 'should find the application')
})
