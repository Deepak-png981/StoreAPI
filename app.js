require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');
const productRoute = require('./routes/products');
//middleware
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hi')
})

app.use('/api/v1/products', productRoute)


//products routes

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(PORT, () => { console.log(`Server is running fine on port : ${PORT}`); });
    } catch (error) {
        console.log(error);
    }
}

start();