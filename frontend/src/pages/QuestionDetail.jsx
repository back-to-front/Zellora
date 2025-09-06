import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { FaArrowUp, FaArrowDown, FaCheck, FaEdit, FaTrash, FaReply } from 'react-icons/fa';
import { questionService } from '../api/questionService';
import { answerService } from '../api/answerService';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { formatDate, timeAgo } from '../utils/formatDate';
import toast from 'react-hot-toast';
import './QuestionDetail.css';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        const questionData = await questionService.getQuestionById(id);
        setQuestion(questionData);
        
        const answersData = await questionService.getAnswersForQuestion(id);
        setAnswers(answersData);
      } catch (err) {
        setError('Failed to fetch question data. Please try again later.');
        console.error('Error fetching question data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestionAndAnswers();
  }, [id]);
  
  const handleVoteQuestion = async (voteType) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }
    
    try {
      const updatedQuestion = await questionService.voteQuestion(id, voteType);
      setQuestion(updatedQuestion);
      toast.success(`Question ${voteType === 'upvote' ? 'upvoted' : 'downvoted'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to vote on question');
    }
  };
  
  const handleVoteAnswer = async (answerId, voteType) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }
    
    try {
      const updatedAnswer = await answerService.voteAnswer(answerId, voteType);
      setAnswers(
        answers.map((answer) => (answer._id === answerId ? updatedAnswer : answer))
      );
      toast.success(`Answer ${voteType === 'upvote' ? 'upvoted' : 'downvoted'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to vote on answer');
    }
  };
  
  const handleAcceptAnswer = async (answerId) => {
    try {
      const updatedAnswer = await answerService.acceptAnswer(answerId);
      setAnswers(
        answers.map((answer) => {
          if (answer._id === answerId) {
            return { ...answer, isAccepted: true };
          }
          return { ...answer, isAccepted: false };
        })
      );
      toast.success('Answer marked as accepted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept answer');
    }
  };
  
  const handleDeleteQuestion = async () => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    try {
      await questionService.deleteQuestion(id);
      toast.success('Question deleted successfully');
      navigate('/questions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete question');
    }
  };
  
  const handleDeleteAnswer = async (answerId) => {
    if (!confirm('Are you sure you want to delete this answer?')) {
      return;
    }
    
    try {
      await answerService.deleteAnswer(answerId);
      setAnswers(answers.filter((answer) => answer._id !== answerId));
      toast.success('Answer deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete answer');
    }
  };
  
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit an answer');
      return;
    }
    
    if (!answerContent.trim()) {
      toast.error('Answer cannot be empty');
      return;
    }
    
    try {
      setAnswering(true);
      const newAnswer = await questionService.createAnswer(id, { body: answerContent });
      setAnswers([...answers, newAnswer]);
      setAnswerContent('');
      toast.success('Answer submitted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setAnswering(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (error || !question) {
    return <Alert variant="danger">{error || 'Question not found'}</Alert>;
  }
  
  const isQuestionAuthor = user && question.user._id === user._id;
  const isAdmin = user && user.isAdmin;
  const canDeleteQuestion = isQuestionAuthor || isAdmin;
  
  return (
    <div className="question-detail-page">
      <div className="question-detail-header">
        <div className="question-title-container">
          <h1 className="question-title">{question.title}</h1>
          <div className="question-meta">
            <span>Asked {timeAgo(question.createdAt)}</span>
            <span>by {question.user.username}</span>
          </div>
        </div>
        {isAuthenticated && (
          <Link to="/ask">
            <Button variant="primary">Ask Question</Button>
          </Link>
        )}
      </div>
      
      <Card className="question-detail-card">
        <div className="question-actions">
          <button
            className={`vote-button ${
              user && question.votes?.upvotes.includes(user._id) ? 'voted' : ''
            }`}
            onClick={() => handleVoteQuestion('upvote')}
            aria-label="Upvote question"
          >
            <FaArrowUp />
          </button>
          <span className="vote-count">{question.voteCount}</span>
          <button
            className={`vote-button ${
              user && question.votes?.downvotes.includes(user._id) ? 'voted' : ''
            }`}
            onClick={() => handleVoteQuestion('downvote')}
            aria-label="Downvote question"
          >
            <FaArrowDown />
          </button>
        </div>
        
        <div className="question-content">
          <div className="question-body">{question.body}</div>
          
          <div className="question-tags">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="light" rounded>
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="question-footer">
            <div className="question-metadata">
              <div className="metadata-item">
                Asked: {formatDate(question.createdAt)}
              </div>
            </div>
            
            {canDeleteQuestion && (
              <div className="question-controls">
                {isQuestionAuthor && (
                  <Link to={`/questions/${id}/edit`}>
                    <Button variant="secondary" size="small">
                      <FaEdit /> Edit
                    </Button>
                  </Link>
                )}
                <Button
                  variant="danger"
                  size="small"
                  onClick={handleDeleteQuestion}
                >
                  <FaTrash /> Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <div className="answers-section">
        <h2 className="answers-heading">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>
        
        {answers.length === 0 ? (
          <div className="no-answers">
            <p>No answers yet. Be the first to provide an answer!</p>
          </div>
        ) : (
          answers
            .sort((a, b) => {
              // Show accepted answer first, then by votes
              if (a.isAccepted && !b.isAccepted) return -1;
              if (!a.isAccepted && b.isAccepted) return 1;
              return b.voteCount - a.voteCount;
            })
            .map((answer) => {
              const isAnswerAuthor = user && answer.user._id === user._id;
              const isQuestionOwner = user && question.user._id === user._id;
              const canDeleteAnswer = isAnswerAuthor || isAdmin;
              const canAccept = isQuestionOwner && !answer.isAccepted;
              
              return (
                <Card
                  key={answer._id}
                  className={`answer-card ${answer.isAccepted ? 'accepted' : ''}`}
                >
                  {answer.isAccepted && (
                    <div className="accepted-badge">
                      <FaCheck /> Accepted Answer
                    </div>
                  )}
                  
                  <div className="answer-actions">
                    <button
                      className={`vote-button ${
                        user && answer.votes?.upvotes.includes(user._id) ? 'voted' : ''
                      }`}
                      onClick={() => handleVoteAnswer(answer._id, 'upvote')}
                      aria-label="Upvote answer"
                    >
                      <FaArrowUp />
                    </button>
                    <span className="vote-count">{answer.voteCount}</span>
                    <button
                      className={`vote-button ${
                        user && answer.votes?.downvotes.includes(user._id) ? 'voted' : ''
                      }`}
                      onClick={() => handleVoteAnswer(answer._id, 'downvote')}
                      aria-label="Downvote answer"
                    >
                      <FaArrowDown />
                    </button>
                    
                    {canAccept && (
                      <button
                        className="accept-button"
                        onClick={() => handleAcceptAnswer(answer._id)}
                        aria-label="Accept answer"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                  
                  <div className="answer-content">
                    <div className="answer-body">{answer.body}</div>
                    
                    <div className="answer-footer">
                      <div className="answer-metadata">
                        <div className="metadata-item">
                          Answered by {answer.user.username} on{' '}
                          {formatDate(answer.createdAt)}
                        </div>
                      </div>
                      
                      {canDeleteAnswer && (
                        <div className="answer-controls">
                          {isAnswerAuthor && (
                            <Link to={`/answers/${answer._id}/edit`}>
                              <Button variant="secondary" size="small">
                                <FaEdit /> Edit
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleDeleteAnswer(answer._id)}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
        )}
      </div>
      
      <div className="post-answer-section">
        <h2 className="post-answer-heading">Your Answer</h2>
        
        {!isAuthenticated ? (
          <div className="login-prompt">
            <p>
              You must <Link to="/login">login</Link> to post an answer.
            </p>
          </div>
        ) : (
          <form className="answer-form" onSubmit={handleSubmitAnswer}>
            <div className="form-group">
              <label htmlFor="answerContent" className="form-label">
                Answer
              </label>
              <textarea
                id="answerContent"
                className="form-control"
                rows="8"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Write your answer here..."
                required
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              disabled={answering || !answerContent.trim()}
            >
              {answering ? 'Submitting...' : (
                <>
                  <FaReply /> Post Your Answer
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
