const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    // const staticProducts = await ProductModel.find({}).sort('name');
    const staticProducts = await Product.find({});
    res.status(200).json({ staticProducts, nbHits: staticProducts.length });
}
// const getAllProducts = async (req, res) => {
//     const { featured, company, name, sort, fields, numericFilters } = req.query;
//     const queryObject = {};
//     if (featured) {
//         queryObject.featured = featured === 'true' ? true : false;
//     }
//     if (company) {
//         queryObject.company = company;
//     }
//     if (name) {
//         queryObject.name = { $regex: name, $options: 'i' };
//     }
//     if (numericFilters) {
//         const operatorMap = {
//             '>': '$gt',
//             '>=': '$gte',
//             '=': '$eq',
//             '<': '$lt',
//             '<=': '$lte',
//         };
//         const regEx = /\b(<|>|>=|=|<|<=)\b/g;
//         let filters = numericFilters.replace(
//             regEx,
//             (match) => `-${operatorMap[match]}-`
//         );
//         const options = ['price', 'rating'];
//         filters.split(',').forEach((item) => {
//             const [field, operator, value] = item.split('-');
//             if (options.includes(field)) {
//                 queryObject[field] = { [operator]: +value };
//             }
//         });
//     }
//     console.log(queryObject);
//     let result = ProductModel.find(queryObject);

//     if (sort) {
//         const sortList = sort.split(',').join(' ');
//         result = result.sort(sortList);
//     } else { //sorting by default on the basis of creation time
//         result = result.sort('createdAt');
//     }

//     if (fields) {
//         const fieldsList = fields.split(',').join(' ');
//         result = result.select(fieldsList);
//     }

//     //for the pagination
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     result = result.skip(skip).limit(limit);

//     const product = await result;

//     res.status(200).json({ nbHits: product.length, product })
// }
const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === 'true';
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }

    // Process numeric filters
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        const options = ['price', 'rating'];

        filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                if (!queryObject[field]) queryObject[field] = {};
                // Convert to number if the field is 'price'
                queryObject[field][operator] = field === 'price' ? Number(value) : value;
            }
        });
    }

    let result = Product.find(queryObject);

    // Sorting
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }

    // Field selection
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
    getAllProductsStatic,
    getAllProducts
}