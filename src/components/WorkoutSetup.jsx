import PropTypes from "prop-types";

const WorkoutSetup = ({
  sessionNames,
  sessionKey,
  onSessionChange,
  restDuration,
  onRestDurationChange,
  sets,
  onSetsChange,
  onStart,
}) => {
  return (
    <div className="setup">
      <label htmlFor="session-select" className="setup-label">
        Workout
      </label>
      <select
        id="session-select"
        value={sessionKey}
        onChange={(e) => onSessionChange(e.target.value)}
        className="session-select"
      >
        {sessionNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <label htmlFor="rest-input" className="setup-label">
        Rest time (seconds)
      </label>
      <input
        id="rest-input"
        type="number"
        min="1"
        value={restDuration}
        onChange={(e) =>
          onRestDurationChange(Math.max(1, parseInt(e.target.value, 10) || 1))
        }
        className="sets-input"
      />

      <label htmlFor="sets-input" className="setup-label">
        Number of sets
      </label>
      <input
        id="sets-input"
        type="number"
        min="1"
        value={sets}
        onChange={(e) => onSetsChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
        className="sets-input"
      />
      <button className="btn btn-start" onClick={onStart}>
        Start Workout
      </button>
    </div>
  );
};

WorkoutSetup.propTypes = {
  sessionNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  sessionKey: PropTypes.string.isRequired,
  onSessionChange: PropTypes.func.isRequired,
  restDuration: PropTypes.number.isRequired,
  onRestDurationChange: PropTypes.func.isRequired,
  sets: PropTypes.number.isRequired,
  onSetsChange: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
};

export default WorkoutSetup;
