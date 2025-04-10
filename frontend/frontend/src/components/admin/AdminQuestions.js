import React, { useState } from 'react';

function LibraryFeedbackForm() {
  const [answers, setAnswers] = useState({ q1: '', q2: '' });
  const [otherInputs, setOtherInputs] = useState({ q1: '', q2: '' });

  const handleOptionChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const handleOtherInputChange = (question, value) => {
    setOtherInputs((prev) => ({ ...prev, [question]: value }));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>GRD Library Floor 3 Feedback</h2>

      {/* Question 1 */}
      <div style={styles.questionBlock}>
        <p style={styles.question}>1) Which facility do you think should be improved the most?</p>
        {[
          'A. Book availability',
          'B. Digital resources',
          'C. Study spaces',
          'D. Noise control',
        ].map((opt, idx) => (
          <label key={idx} style={styles.optionLabel}>
            <input
              type="radio"
              name="q1"
              value={opt}
              checked={answers.q1 === opt}
              onChange={() => handleOptionChange('q1', opt)}
            />
            {opt}
          </label>
        ))}

        <label style={styles.optionLabel}>
          <input
            type="radio"
            name="q1"
            value="E. Other"
            checked={answers.q1 === 'E. Other'}
            onChange={() => handleOptionChange('q1', 'E. Other')}
          />
          E. Other
          {answers.q1 === 'E. Other' && (
            <input
              type="text"
              placeholder="Write your response"
              value={otherInputs.q1}
              onChange={(e) => handleOtherInputChange('q1', e.target.value)}
              style={styles.blankLineInput}
            />
          )}
        </label>
      </div>

      {/* Question 2 */}
      <div style={styles.questionBlock}>
        <p style={styles.question}>
          2) Have you ever needed assistance from the library staff but couldn’t find them or felt they were unavailable?
        </p>
        {[
          'A. Yes, frequently',
          'B. Yes, sometimes',
          'C. Rarely',
          'D. I’ve never needed assistance',
        ].map((opt, idx) => (
          <label key={idx} style={styles.optionLabel}>
            <input
              type="radio"
              name="q2"
              value={opt}
              checked={answers.q2 === opt}
              onChange={() => handleOptionChange('q2', opt)}
            />
            {opt}
          </label>
        ))}

        <label style={styles.optionLabel}>
          <input
            type="radio"
            name="q2"
            value="E. Other"
            checked={answers.q2 === 'E. Other'}
            onChange={() => handleOptionChange('q2', 'E. Other')}
          />
          E. Other
          {answers.q2 === 'E. Other' && (
            <input
              type="text"
              placeholder="Write your response"
              value={otherInputs.q2}
              onChange={(e) => handleOtherInputChange('q2', e.target.value)}
              style={styles.blankLineInput}
            />
          )}
        </label>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    color: '#2c3e50',
  },
  questionBlock: {
    marginBottom: '30px',
  },
  question: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#34495e',
  },
  optionLabel: {
    display: 'block',
    marginBottom: '14px',
    fontSize: '16px',
    color: '#555',
  },
  blankLineInput: {
    display: 'block',
    marginTop: '10px',
    width: '80%',
    maxWidth: '400px',
    border: 'none',
    borderBottom: '2px solid #aaa',
    fontSize: '16px',
    padding: '6px 0',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#333',
  },
};

export default LibraryFeedbackForm;
