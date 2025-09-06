import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { questionService } from '../api/questionService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import toast from 'react-hot-toast';
import './AskQuestion.css';

const AskQuestion = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tags: [],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    
    if (!tag) return;
    if (formData.tags.includes(tag)) {
      toast.error('Tag already exists');
      return;
    }
    if (formData.tags.length >= 5) {
      toast.error('Maximum 5 tags allowed');
      return;
    }
    
    setFormData({
      ...formData,
      tags: [...formData.tags, tag],
    });
    setTagInput('');
  };
  
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    } else if (formData.title.length > 150) {
      newErrors.title = 'Title must be at most 150 characters long';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Question details are required';
    } else if (formData.body.length < 30) {
      newErrors.body = 'Question details must be at least 30 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      setError('');
      
      const newQuestion = await questionService.createQuestion(formData);
      toast.success('Question posted successfully');
      navigate(`/questions/${newQuestion._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post question. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="ask-question-page">
      <h1 className="page-title">Ask a Question</h1>
      <p className="page-description">
        Get help from the community by asking a clear, concise question
      </p>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="question-form-card">
        <form className="question-form" onSubmit={handleSubmit}>
          <Input
            label="Question Title"
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What's your question? Be specific."
            error={errors.title}
            required
          />
          
          <div className="form-group">
            <label htmlFor="body" className="form-label">
              Question Details <span className="required-indicator">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              className={`form-control ${errors.body ? 'is-invalid' : ''}`}
              rows="10"
              value={formData.body}
              onChange={handleChange}
              placeholder="Provide details about your question. Include code, error messages, or any context that might help others understand your problem."
              required
            ></textarea>
            {errors.body && <div className="invalid-feedback">{errors.body}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags (up to 5)
            </label>
            <div className="tags-input-container">
              <div className="tags-list">
                {formData.tags.map((tag) => (
                  <div key={tag} className="tag-item">
                    <span className="tag-text">{tag}</span>
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(tag)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  id="tags"
                  className="tag-input"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder={
                    formData.tags.length === 0
                      ? "Add tags (press Enter or ',' after each tag)"
                      : ''
                  }
                  disabled={formData.tags.length >= 5}
                />
              </div>
            </div>
            <small className="form-text">
              Add up to 5 tags to categorize your question (e.g., javascript, react, node.js)
            </small>
          </div>
          
          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? 'Posting Question...' : (
                <>
                  <FaPlus /> Post Your Question
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/questions')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AskQuestion;
