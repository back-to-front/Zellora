import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FaPlus,
  FaSearch,
  FaSort,
  FaSortAmountUp,
  FaSortAmountDown,
} from "react-icons/fa";
import { questionService } from "../api/questionService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import Alert from "../components/ui/Alert";
import { timeAgo } from "../utils/formatDate";
import "./Questions.css";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredQuestions, setFilteredQuestions] = useState([]);

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

  useEffect(() => {
    // Filter and sort questions when questions, searchQuery or sortBy changes
    if (questions.length > 0) {
      let filtered = [...questions];

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (question) =>
            question.title.toLowerCase().includes(query) ||
            question.body.toLowerCase().includes(query) ||
            question.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      // Apply sorting
      switch (sortBy) {
        case "newest":
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "oldest":
          filtered.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;
        case "votes":
          filtered.sort((a, b) => b.voteCount - a.voteCount);
          break;
        case "answers":
          filtered.sort(
            (a, b) => (b.answers?.length || 0) - (a.answers?.length || 0)
          );
          break;
        default:
          break;
      }

      setFilteredQuestions(filtered);
    }
  }, [questions, searchQuery, sortBy]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  if (loading) {
    return (
      <div className='spinner-container'>
        <Spinner size='large' />
      </div>
    );
  }

  return (
    <div className='questions-page'>
      <div className='questions-header'>
        <h1>All Questions</h1>
        <Link to='/ask'>
          <Button variant='primary'>
            <FaPlus /> Ask Question
          </Button>
        </Link>
      </div>

      <div className='questions-filters'>
        <form className='search-form' onSubmit={handleSearchSubmit}>
          <div className='search-input-container'>
            <FaSearch className='search-icon' />
            <input
              type='text'
              placeholder='Search questions...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='search-input'
            />
          </div>
        </form>

        <div className='sort-controls'>
          <span className='sort-label'>
            <FaSort /> Sort by:
          </span>
          <div className='sort-options'>
            <button
              className={`sort-option ${sortBy === "newest" ? "active" : ""}`}
              onClick={() => handleSortChange("newest")}
            >
              <FaSortAmountDown /> Newest
            </button>
            <button
              className={`sort-option ${sortBy === "oldest" ? "active" : ""}`}
              onClick={() => handleSortChange("oldest")}
            >
              <FaSortAmountUp /> Oldest
            </button>
            <button
              className={`sort-option ${sortBy === "votes" ? "active" : ""}`}
              onClick={() => handleSortChange("votes")}
            >
              Votes
            </button>
            <button
              className={`sort-option ${sortBy === "answers" ? "active" : ""}`}
              onClick={() => handleSortChange("answers")}
            >
              Answers
            </button>
          </div>
        </div>
      </div>

      {error && <Alert variant='danger'>{error}</Alert>}

      <div className='questions-count'>
        {filteredQuestions.length}{" "}
        {filteredQuestions.length === 1 ? "question" : "questions"}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      <div className='questions-list'>
        {filteredQuestions.length === 0 ? (
          <div className='no-questions'>
            {searchQuery ? (
              <p>No questions found matching your search.</p>
            ) : (
              <p>No questions yet. Be the first to ask a question!</p>
            )}
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question._id} className='question-item'>
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
                <h2 className='question-title'>
                  <Link to={`/questions/${question._id}`}>
                    {question.title}
                  </Link>
                </h2>
                <p className='question-excerpt'>
                  {question.body.length > 200
                    ? `${question.body.substring(0, 200)}...`
                    : question.body}
                </p>
                <div className='question-footer'>
                  <div className='question-tags'>
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant='light' rounded>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className='question-meta'>
                    <span className='question-author'>
                      Asked by {question.user.username}
                    </span>
                    <span className='question-time'>
                      {timeAgo(question.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Questions;
