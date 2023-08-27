import app from "./app"

const port: number = 4000

app.listen(port, () => {
    console.log(`Worker coordinator listening on port ${port}`)
})
