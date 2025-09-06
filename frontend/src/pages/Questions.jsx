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
        const response = await questionService.getQuestions();

        // Ensure we have an array of questions to work with
        let questionsArray = [];

        // Check if response is an array
        if (Array.isArray(response)) {
          questionsArray = response;
        }
        // Check if response has a questions property that is an array
        else if (response && Array.isArray(response.questions)) {
          questionsArray = response.questions;
        }
        // If we still don't have an array, log error and use empty array
        else {
          console.error("Unexpected API response format:", response);
          questionsArray = [];
        }

        setQuestions(questionsArray);
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
    // Always set filtered questions even if the array is empty
    let filtered = Array.isArray(questions) ? [...questions] : [];

    // Apply search filter if we have questions and a search query
    if (filtered.length > 0 && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((question) => {
        try {
          return (
            (question.title && question.title.toLowerCase().includes(query)) ||
            (question.body && question.body.toLowerCase().includes(query)) ||
            (Array.isArray(question.tags) &&
              question.tags.some((tag) => tag.toLowerCase().includes(query)))
          );
        } catch (err) {
          console.error("Error filtering question:", err, question);
          return false;
        }
      });
    }

    // Apply sorting if we have questions to sort
    if (filtered.length > 0) {
      try {
        switch (sortBy) {
          case "newest":
            filtered.sort(
              (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
            break;
          case "oldest":
            filtered.sort(
              (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
            );
            break;
          case "votes":
            filtered.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
            break;
          case "answers":
            filtered.sort(
              (a, b) => (b.answers?.length || 0) - (a.answers?.length || 0)
            );
            break;
          default:
            break;
        }
      } catch (err) {
        console.error("Error sorting questions:", err);
      }
    }

    setFilteredQuestions(filtered);
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
