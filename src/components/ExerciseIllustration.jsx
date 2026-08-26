import PropTypes from "prop-types";

const ExerciseIllustration = ({ images }) => {
  const src = Array.isArray(images) ? images[0] : images;
  if (!src) return null;

  return <img src={src} alt="" className="exercise-illustration" />;
};

ExerciseIllustration.propTypes = {
  images: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default ExerciseIllustration;
