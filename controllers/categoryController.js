const Category = require("../models/CategoryModel");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: "asc" }).orFail();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const newCategory = async (req, res, next) => {
  try {
    //res.send(!!req.body)

    const { category } = req.body;

    if (!category) {
      res.status(400).send("Category input is required");
    }

    const categoryExists = await Category.findOne({ name: category });

    if (categoryExists) {
      res.status(400).send("Category already exists");
    } else {
      const createdCategory = await Category.create({
        name: category,
      });
      res.status(201).send({ createdCategory: createdCategory });
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    if (req.body.category !== "Choose category") {
      const categoryExists = await Category.findOne({
        name: decodeURIComponent(req.body.category),
      }).orFail();

      await categoryExists.remove();

      res.json({ categoryDeleted: true });
    }
  } catch (error) {
    next(error);
  }
}

const saveAttr = async (req, res, next) => {

  const { key, val, categoryChoosen } = req.body;

  if (!key || !val || !categoryChoosen) {
    res.status(400).send("All Categories are required");
  }
  try {
    const category = categoryChoosen.split("/")[0];

    const categoryExists = await Category.findOne({ name: category }).orFail();

    if (categoryExists.attrs.length > 0) {
      var keyDoesnotExist = true;
      categoryExists.attrs.map((item, idx) => {
        if (item.key === key) {
          keyDoesnotExist = false;

          var copyAttributesValues = [...categoryExists.attrs[idx].value];
          copyAttributesValues.push(val);
          var newAttributesValues = [...new Set(copyAttributesValues)]; // set ensure unique values
          categoryExists.attrs[idx].value = newAttributesValues;
        }
      });

      if (keyDoesnotExist) {
        categoryExists.attrs.push({ name: key, value: val });
      }
    } else {
      categoryExists.attrs.push({ name: key, value: val });
    }

    await categoryExists.save();
    let cat = await Category.find({}).sort({ name: "asc" });
    return res.status(201).json({ categoryUpdated: cat });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, newCategory, deleteCategory, saveAttr };
