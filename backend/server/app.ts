import express, { Express, Request, Response } from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import router from './router'

const app: Express = express()

app.use(express.static(path.join(__dirname, "../../../frontend/build")))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api', router)

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../frontend/build/index.html"))
})
 
export default app
