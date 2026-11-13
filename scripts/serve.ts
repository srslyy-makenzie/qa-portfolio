import { startServer } from './static-server.ts'

const port = Number(process.env.PORT ?? 4173)
const { url } = await startServer('out', port)
console.log(`Serving out/ at ${url}`)
