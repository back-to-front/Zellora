import { useState, useEffect } from "react";
import { Link } from "react-router";
import { FaPlus, FaEye, FaComment } from "react-icons/fa";
import { questionService } from "../api/questionService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import Alert from "../components/ui/Alert";
import { formatDate } from "../utils/formatDate";
import "./Home.css";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await questionService.getQuestions();
        setQuestions(data);
      } catch (err) {
        setError("Failed to fetch questions. Please try again later.");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className='spinner-container'>
        <Spinner size='large' />
      </div>
    );
  }

  return (
    <div className='home-page'>
      <div className='home-header'>
        <h1>Welcome to Zellora</h1>
        <p>
          A community-driven Q&A platform for developers to ask questions and
          share knowledge
        </p>
        <Link to='/ask' className='ask-question-btn'>
          <Button variant='primary' size='large'>
            <FaPlus /> Ask a Question
          </Button>
        </Link>
      </div>

      {error && <Alert variant='danger'>{error}</Alert>}

      <div className='questions-header'>
        <h2>Recent Questions</h2>
        <Link to='/questions' className='view-all-link'>
          View All Questions
        </Link>
      </div>

      <div className='questions-container'>
        {questions.length === 0 ? (
          <div className='no-questions'>
            <p>No questions yet. Be the first to ask a question!</p>
          </div>
        ) : (
          questions.map((question) => (
            <Card key={question._id} className='question-card'>
              <div className='question-stats'>
                <div className='stat'>
                  <span className='stat-value'>{question.voteCount}</span>
                  <span className='stat-label'>votes</span>
                </div>
                <div className='stat'>
                  <span className='stat-value'>
                    {question.answers?.length || 0}
                  </span>
                  <span className='stat-label'>answers</span>
                </div>
              </div>

              <div className='question-content'>
                <h3 className='question-title'>
                  <Link to={`/questions/${question._id}`}>
                    {question.title}
                  </Link>
                </h3>
                <p className='question-excerpt'>
                  {question.body.length > 150
                    ? `${question.body.substring(0, 150)}...`
                    : question.body}
                </p>
                <div className='question-tags'>
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant='light' rounded>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className='question-meta'>
                  <span className='question-user'>
                    Asked by {question.user.username} on{" "}
                    {formatDate(question.createdAt)}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
