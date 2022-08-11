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
        const productCollection = client.db('outshade-digital-media').collection('products');

        //post-user
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

        //get-user
        app.get('/user', async (req, res) => {
            const user = req.query
            const userExists = await userCollection.findOne(user);
            if (userExists) {
                return res.send({ success: true, user: userExists })

            }
            else {
                return res.send({ success: false })
            }

        })

        //create-product
        app.post('/create-product', async (req, res) => {
            const product = req.body
            const productExists = await productCollection.findOne({ product: product.product })
            if (!productExists) {
                const result = await productCollection.insertOne(product);
                return res.send({ success: true, result: result })
            }

            else {
                return res.send({ success: false })

            }
        })

        //insert or update category
        app.put('/create-product', async (req, res) => {
            const category = req.body
            const filter = category
            const options = { upsert: true };
            const updateDoc = {
                $set: category
            }
            const result = await productCollection.updateOne(filter, category, options)
            res.send({ result })
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