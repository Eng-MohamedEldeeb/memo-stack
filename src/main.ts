import express, { Express } from 'express'
import { bootstrap } from './app.controller'

const app: Express = express()
const port: number = Number(process.env.PORT) ?? 3001

bootstrap(app)

app.listen(port, () => console.log('app is running on port =>', port))
