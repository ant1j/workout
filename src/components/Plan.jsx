import exercises from "../data/exercises.json";
import sessions from "../data/sessions.json";

const categoryNames = Object.keys(exercises);
const allExercises = Object.values(exercises).flat();

const findExercise = (name) =>
  allExercises.find((exercise) => exercise.name === name);

const pickRandom = (array, count) => {
  // Randomly pick 'count' elements from 'array', no repeats
  const pool = [...array];
  let result = [];
  while (result.length < count && pool.length) {
    let index = Math.floor(Math.random() * pool.length);
    result.push(pool[index]);
    pool.splice(index, 1);
  }
  return result;
};

const buildRandomSet = (exercisesPerCategory) => {
  const picks = categoryNames.map((category) =>
    pickRandom(
      exercises[category].filter((exercise) => exercise.difficulty === "hard"),
      exercisesPerCategory
    )
  );

  let set = [];
  for (let i = 0; i < exercisesPerCategory; i++) {
    for (let j = 0; j < categoryNames.length; j++) {
      set.push(picks[j][i]);
    }
  }
  return set;
};

export const getSessionNames = () => Object.keys(sessions);

export const getSession = (sessionName) => sessions[sessionName] ?? null;

export const getExercisesPerSet = (session) => {
  if (!session) return 0;
  if (session.random) {
    return categoryNames.length * (session.exercisesPerCategory ?? 3);
  }
  return session.exercises.length;
};

const generateWorkoutPlan = (sessionName, nSets) => {
  const session = sessions[sessionName];
  if (!session) return [];

  const set = session.random
    ? buildRandomSet(session.exercisesPerCategory ?? 3)
    : session.exercises.map(findExercise).filter(Boolean);

  let plan = [];
  for (let i = 0; i < nSets; i++) {
    plan = plan.concat(set);
  }
  return plan;
};

export default generateWorkoutPlan;
