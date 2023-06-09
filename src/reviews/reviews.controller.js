const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//middleware validation, check if review exists
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found" });
}

//update review by Id
async function update(req, res) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await service.update(updatedReview);
  res.json({ data });
}

//delete review by Id
async function destroy(req, res) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

//exports
module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};