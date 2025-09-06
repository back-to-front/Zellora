import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { answerService } from "../api/answerService";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import toast from "react-hot-toast";
import "./AskQuestion.css"; // Reuse the same styles

const EditAnswer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState({ body: "", questionId: "" });

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        setLoading(true);

        // Get the answer details
        const answerData = await answerService.getAnswerById(id);

        // Check if user is the author of the answer
        if (answerData.user._id !== user?._id && !user?.isAdmin) {
          setError("You don't have permission to edit this answer");
          return;
        }

        setAnswer({
          body: answerData.body || "",
          questionId: answerData.question || "",
        });
      } catch (err) {
        setError("Failed to fetch answer data. Please try again later.");
        console.error("Error fetching answer:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnswer();
    }
  }, [id, user]);

  const handleChange = (e) => {
    setAnswer({
      ...answer,
      body: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      await answerService.updateAnswer(id, { body: answer.body });

      toast.success("Answer updated successfully");
      navigate(`/questions/${answer.questionId}`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update answer";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='spinner-container'>
        <Spinner size='large' />
      </div>
    );
  }

  if (error && error.includes("permission")) {
    return <Alert variant='danger'>{error}</Alert>;
  }

  return (
    <div className='ask-question-page'>
      <h1 className='page-title'>Edit Answer</h1>

      <Card className='question-form-card'>
        <form className='question-form' onSubmit={handleSubmit}>
          {error && <Alert variant='danger'>{error}</Alert>}

          <div className='form-group'>
            <label htmlFor='body'>Your Answer</label>
            <textarea
              name='body'
              id='body'
              value={answer.body}
              onChange={handleChange}
              rows='10'
              className='form-textarea'
              placeholder='Write your answer here'
              required
            ></textarea>
          </div>

          <div className='form-actions'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => navigate(`/questions/${answer.questionId}`)}
            >
              Cancel
            </Button>
            <Button type='submit' variant='primary' disabled={submitting}>
              {submitting ? "Updating..." : "Update Answer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditAnswer;
