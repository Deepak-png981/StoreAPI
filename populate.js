require('dotenv').config();

const connectDB = require('./db/connect');
const productModel = require('./models/product');
const productJSON = require('./products.json');


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        await productModel.deleteMany();
        await productModel.create(productJSON);
        console.log('success');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
start();