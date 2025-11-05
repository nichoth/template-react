import ky from 'ky'

export const Api = {
    get: async function ():Promise<{ hello:string }> {
        // call our lambda functions
        const json = await ky.get('/api/example').json<{ hello:string }>()
        return json
    }
}
