function WelcomeBanner() {
  return (
    <div className="bg-light p-4 mb-3 text-center rounded">
      {/* img-fluid for responsive images */}
      <h1 className="display-4 text-primary">Kate's Book Store!</h1>{' '}
      {/* Bootstrap heading and text color */}
      <p className="lead text-muted">
        Browse our amazing collection of books.
      </p>{' '}
      {/* Bootstrap lead text and muted color */}
    </div>
  );
}

export default WelcomeBanner;
