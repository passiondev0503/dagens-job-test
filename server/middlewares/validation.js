function validateProduct(req, res, next) {
  const { name, category, price } = req.body;

  if (!name || !category || !price)
    return res.status(400).send({
      status: 400,
      message:
        'Name, Category, and Price are required to create a new product.',
    });

  if (
    typeof name !== 'string' ||
    typeof category !== 'string' ||
    typeof price !== 'number'
  )
    return res.status(400).send({
      status: 400,
      message:
        'Invalid data types. Name and category must be strings, price must be a number.',
    });

  next();
}

module.exports = { validateProduct };
