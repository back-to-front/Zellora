import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { questionService } from "../api/questionService";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import toast from "react-hot-toast";
import "./AskQuestion.css"; // Reuse the same styles as AskQuestion

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: "",
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const question = await questionService.getQuestionById(id);

        // Check if user is the author of the question
        if (question.user._id !== user?._id && !user?.isAdmin) {
          setError("You don't have permission to edit this question");
          return;
        }

        setFormData({
          title: question.title || "",
          body: question.body || "",
          tags: Array.isArray(question.tags) ? question.tags.join(", ") : "",
        });
      } catch (err) {
        setError("Failed to fetch question data. Please try again later.");
        console.error("Error fetching question:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Process tags - split by comma and trim whitespace
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const updatedQuestion = await questionService.updateQuestion(id, {
        title: formData.title,
        body: formData.body,
        tags: tagsArray,
      });

      toast.success("Question updated successfully");
      navigate(`/questions/${id}`);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update question";
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
      <h1 className='page-title'>Edit Question</h1>

      <Card className='question-form-card'>
        <form className='question-form' onSubmit={handleSubmit}>
          {error && <Alert variant='danger'>{error}</Alert>}

          <Input
            label='Title'
            type='text'
            name='title'
            id='title'
            value={formData.title}
            onChange={handleChange}
            placeholder="Be specific and imagine you're asking a question to another person"
            required
          />

          <div className='form-group'>
            <label htmlFor='body'>Body</label>
            <textarea
              name='body'
              id='body'
              value={formData.body}
              onChange={handleChange}
              rows='10'
              className='form-textarea'
              placeholder='Include all the information someone would need to answer your question'
              required
            ></textarea>
          </div>

          <Input
            label='Tags'
            type='text'
            name='tags'
            id='tags'
            value={formData.tags}
            onChange={handleChange}
            placeholder='Add up to 5 tags separated by commas (e.g. javascript, react, node.js)'
          />

          <div className='form-actions'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => navigate(`/questions/${id}`)}
            >
              Cancel
            </Button>
            <Button type='submit' variant='primary' disabled={submitting}>
              {submitting ? "Updating..." : "Update Question"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditQuestion;
