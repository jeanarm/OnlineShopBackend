const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");

const getProducts = async (req, res, next) => {
  try {
    let query = {};
    let queryCondition = false;
    let priceQueryCondition = {};
    if (req.query.price) {
      queryCondition = true;
      priceQueryCondition = { price: { $lte: Number(req.query.price) } };
    }

    let ratingQueryCondition = {};
    if (req.query.rating) {
      queryCondition = true;
      ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
    }

    let categoriesQueryCondition = {};

    const categoryName = req.params.categoryName || "";

    if (categoryName) {
      queryCondition = true;
      let a = categoryName.replace(",", "/");
      var regEx = new RegExp("^" + a);
      categoriesQueryCondition = { category: regEx };
    }

    if (req.query.category) {
      queryCondition = true;
      let a = req.query.category.split(",").map((item) => {
        if (item) return new RegExp("^" + item);
      });
      categoriesQueryCondition = { category: { $in: a } };
    }

    //let attrsQueryCondition = {};

    // if (req.query.attrs) {
    //   attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
    //     if (item) {
    //       let a = item.split(",")
    //       let values = [...a]
    //       values.shift() //remove first item
    //       let a1 = {
    //         attrs: { $elemMatch: { key: a[0], value: { $in: values } } }
    //       };
    //       acc.push(a1);

    //       console.dir(acc, { depth: null });

    //       return acc;
    //     } else return acc;
    //   }, []);
    //   queryCondition = true;
    // }
    let attrsQueryCondition = [];

    if (req.query.attrs) {
      attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
        if (item) {
          let a = item.split("-"); // Split by hyphen
          let key = a[0];
          let values = a.slice(1); // Extract values from index 1 onwards
          
          if (key && values.length > 0) {
            let a1 = {
              attrs: { $elemMatch: { key: key, value: { $in: values } } }
            };
            acc.push(a1);
            console.dir(acc, { depth: null });
          }
    
          return acc;
        } else {
          return acc;
        }
      }, []);
      queryCondition = true; // Assuming you're using queryCondition elsewhere in your code
    }
    

    if (queryCondition) {
      query = {
        $and: [
          priceQueryCondition,
          ratingQueryCondition,
          categoriesQueryCondition,
          ...attrsQueryCondition,
        ],
      };
    }

    const pageNum = Number(req.query.pageNum) || 1;
    const totalProducts = await Product.countDocuments(query);

    //sort by name,price, etc

    let sort = {};

    const sortOption = req.query.sort || "";

    if (sortOption) {
      let sortOpt = sortOption.split("_");
      sort = { [sortOpt[0]]: Number(sortOpt[1]) };
    }

    const products = await Product.find(query)
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(recordsPerPage);
    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getProducts;
