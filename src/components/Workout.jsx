import { useState, useEffect } from "react";
import Timer from "./Timer";
import SetIndicator from "./SetIndicator";
import ExerciseIllustration from "./ExerciseIllustration";
import WorkoutSetup from "./WorkoutSetup";
import WorkoutControls from "./WorkoutControls";
import generateWorkoutPlan, {
  getSessionNames,
  getSession,
  getExercisesPerSet,
} from "./Plan";

const Workout = () => {
  const sessionNames = getSessionNames();
  const defaultSessionKey = sessionNames[0];
  const defaultSession = getSession(defaultSessionKey);

  const defaultRest = defaultSession?.restTime ?? 10;
  const defaultDuration = 30;
  const defaultSets = defaultSession?.sets ?? 1;

  // State variables
  const [sessionKey, setSessionKey] = useState(defaultSessionKey);
  const [restDuration, setRestDuration] = useState(defaultRest);
  const [exerciseDuration, setExerciseDuration] = useState(defaultDuration);
  const [sets, setSets] = useState(defaultSets);
  const [exercisesPerSet, setExercisesPerSet] = useState(
    getExercisesPerSet(defaultSession)
  );

  const [isRest, setIsRest] = useState(true); // Start with rest
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [workoutIndex, setWorkoutIndex] = useState(-1);
  const [setIndex, setSetIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [message, setMessage] = useState({ label: "", name: "" });
  const [currentExercise, setCurrentExercise] = useState(null);
  const [timerDuration, setTimerDuration] = useState(restDuration); // Start with a 5s rest
  const [timerBeeping, setTimerBeeping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [wakeLock, setWakeLock] = useState(null);

  const handleSessionChange = (newSessionKey) => {
    setSessionKey(newSessionKey);
    const session = getSession(newSessionKey);
    if (session) {
      setRestDuration(session.restTime);
      setSets(session.sets);
      setExercisesPerSet(getExercisesPerSet(session));
    }
  };

  const startWorkout = () => {
    console.log("Starting workout");
    const plan = generateWorkoutPlan(sessionKey, sets);
    setWorkoutPlan(plan);
    setWorkoutIndex(-1);
    setSetIndex(0);
    setMessage(
      plan[0]
        ? { label: "Get ready! Next up:", name: plan[0].name }
        : { label: "Get ready!", name: "" }
    );
    setCurrentExercise(plan[0] ?? null);
    setWorkoutStarted(true);
    setIsRest(true);
    setIsPaused(false);

    requestWakeLock();
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const skipToNext = () => {
    setIsPaused(false);
    handleTimerComplete();
  };

  // Ensure the wake lock is released when the Workout component unmounts
  useEffect(() => {
    return () => {
      wakeLock?.release().then(() => {
        console.log("Wake Lock was released");
      });
    };
  }, [wakeLock]);

  useEffect(() => {
    if (workoutStarted) {
      speak(`${message.label} ${message.name}`.trim());
    }
  }, [message, workoutStarted]); // This effect runs whenever 'message' changes

  const requestWakeLock = async () => {
    if ("wakeLock" in navigator) {
      try {
        const lock = await navigator.wakeLock.request("screen");
        setWakeLock(lock);
        console.log("Wake Lock is active");
      } catch (err) {
        console.error(`Wake Lock Error: ${err.name}, ${err.message}`);
      }
    } else {
      console.error("Wake Lock API not supported in this browser.");
    }
  };

  // Read query parameters from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const restParam = queryParams.get("rest");
    const durationParam = queryParams.get("duration");
    const setsParam = queryParams.get("sets");

    if (restParam) setRestDuration(parseInt(restParam, 10));
    if (durationParam) setExerciseDuration(parseInt(durationParam, 10));
    if (setsParam) setSets(parseInt(setsParam, 10));
  }, []);

  const handleTimerComplete = () => {
    const nextIndex = workoutIndex + 1;


    if (isRest) {
      // Moving to the next exercise
      const newExercise = workoutPlan[nextIndex];
      setTimerDuration(exerciseDuration);
      setTimerBeeping(true);

      // Update message to the new exercise, which will be spoken and displayed
      setMessage({ label: "", name: newExercise.name });
      setCurrentExercise(newExercise);
      setWorkoutIndex(nextIndex);
    } else {
      // Starting rest
      setTimerBeeping(false);
      if (nextIndex < workoutPlan.length) {
        // Update message to "Next up" only if there's another exercise
        setMessage({ label: "Next up:", name: workoutPlan[nextIndex].name });
        // Preview the upcoming exercise's illustration during rest
        setCurrentExercise(workoutPlan[nextIndex]);

        // update set index
        setSetIndex(Math.floor((workoutIndex + 1) / exercisesPerSet));
        setTimerDuration(restDuration);
      } else {
        // Handle end of workout
        setMessage({ label: "", name: "Workout complete!" });
        setCurrentExercise(null);
        setWorkoutStarted(false);
        setIsPaused(false);
      }
    }
    setIsRest(!isRest);
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    const englishVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.startsWith("en"));
    if (englishVoice) speech.voice = englishVoice;

    window.speechSynthesis.speak(speech);
  };

  return (
    <div>
      <div>
        <h2 className="message">
          {message.label && <span className="message-label">{message.label}</span>}
          {message.name && <span className="message-name">{message.name}</span>}
        </h2>
        {!workoutStarted ? (
          <WorkoutSetup
            sessionNames={sessionNames}
            sessionKey={sessionKey}
            onSessionChange={handleSessionChange}
            restDuration={restDuration}
            onRestDurationChange={setRestDuration}
            sets={sets}
            onSetsChange={setSets}
            onStart={startWorkout}
          />
        ) : (
          <div>
          {currentExercise && (
            <ExerciseIllustration images={currentExercise.images} />
          )}
          <Timer
            duration={timerDuration}
            onComplete={handleTimerComplete}
            isBeeping={timerBeeping}
            isPaused={isPaused}
          />
          <WorkoutControls
            isPaused={isPaused}
            onTogglePause={togglePause}
            onSkipToNext={skipToNext}
          />
          <SetIndicator
            currentSet={setIndex}
            totalSets={sets}
          />
          </div>
        )}
      </div>
    </div>
  );
};

export default Workout;
