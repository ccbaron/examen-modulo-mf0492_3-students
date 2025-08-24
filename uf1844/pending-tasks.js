// Objetivo: devolver SOLO las tareas pendientes usando el método de array adecuado.
// BONUS: no usar "==" ni "==="; usamos la negación (!) sobre el booleano.

function filterPendingTasks(tasks) {
  // Filtramos por completed === false usando la negación
  return tasks.filter(t => !t.completed);
}

const tasks = [
  { task: "Wash the dishes", completed: true },
  { task: "Exercise", completed: false },
  { task: "Study programming", completed: false },
  { task: "Clean the house", completed: true },
];

const result = filterPendingTasks(tasks);
console.log(result);
/**
 * // Pending tasks
  { task: "Exercise", completed: false },
  { task: "Study programming", completed: false }
 */
