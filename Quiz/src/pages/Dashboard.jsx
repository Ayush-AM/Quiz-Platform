import { Link } from "react-router-dom";

export default function Dashboard() {
  const quizzes = [
    { id: 1, title: "JavaScript Basics" },
    { id: 2, title: "React Fundamentals" }
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
