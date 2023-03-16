import express, { Express, Request, Response } from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import userRouter from './routes/user'

const app: Express = express()
const port: number = 4000

app.use(express.static(path.join(__dirname, "../../frontend/build")))
app.use(bodyParser.json())
app.use('/api', userRouter)

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/build/index.html"))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
 
export default app