const isString = (data) => typeof data === 'string';
const isInteger = (data) => typeof data === 'number';

/**
 * @param {string} entity
 */
exports.validate = (entity, { requiredFields = true } = {}) => {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  const middleware = (req, res, next) => {
    switch (entity) {
      case 'order': {
        const order = req.body;

        if (Object.keys(order).length === 0) {
          res.status(400).json({
            message: 'A body in the shape of an order is required',
          });
        } else if (
          requiredFields &&
          (!order.quantity ||
            !order.contactName ||
            !order.contactPhone ||
            !order.contactEmail ||
            !order.address ||
            !order.country)
        ) {
          res.status(400).json({
            message:
              'The following fields are required: contactName, contactPhone, contactEmail, address, country, buyerId, quantity',
          });
        } else if (
          requiredFields &&
          (!isString(order.contactName) ||
            !isString(order.contactEmail) ||
            !isString(order.contactPhone) ||
            !isString(order.address) ||
            !isString(order.country))
        ) {
          res.status(400).json({
            message:
              'The following fields must be a string: contactName, contactPhone, contactEmail, address, country, buyerId',
          });
        } else if (requiredFields && !isInteger(order.quantity)) {
          res.status(400).json({
            message: 'The following fields must be a integer: quantity',
          });
        } else {
          next();
        }
        break;
      }
      default: {
        next();
      }
    }
  };

  return middleware;
};
