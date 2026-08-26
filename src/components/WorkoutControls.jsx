import PropTypes from "prop-types";

const WorkoutControls = ({ isPaused, onTogglePause, onSkipToNext }) => {
  return (
    <div className="controls">
      <button className="btn btn-pause" onClick={onTogglePause}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button className="btn btn-next" onClick={onSkipToNext}>
        Next
      </button>
    </div>
  );
};

WorkoutControls.propTypes = {
  isPaused: PropTypes.bool.isRequired,
  onTogglePause: PropTypes.func.isRequired,
  onSkipToNext: PropTypes.func.isRequired,
};

export default WorkoutControls;
