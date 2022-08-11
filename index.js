const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwauo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const userCollection = client.db('outshade-digital-media').collection('users');

        app.post('/user', async (req, res) => {
            const user = req.body;
            const userExists = await userCollection.findOne({ email: user.email });

            if (!userExists) {
                const result = await userCollection.insertOne(user)
                return res.send({ success: true, result })
            }
            else {
                return res.send({ success: false, email: user.email })


            }

        })



    }
    finally {

    }

}
run().catch(console.dir)







app.get('/', (req, res) => {
    res.send('outshade digital media server')
})
app.listen(port, () => {
    console.log('server running at', port)
})