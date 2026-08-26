const ExerciseIllustration = ({ images }) => {
  const src = Array.isArray(images) ? images[0] : images;
  if (!src) return null;

  return <img src={src} alt="" className="exercise-illustration" />;
};

export default ExerciseIllustration;
