import React, { useState, useEffect } from "react";
import "../styles.css";

const availableCourses = [
  { name: "React JS", duration: "4 weeks", fees: "$200" },
  { name: "Node JS", duration: "6 weeks", fees: "$250" },
  { name: "Python", duration: "8 weeks", fees: "$300" },
];

const CourseEnrollment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    gender: "",
    courses: [{ courseName: "", duration: "", fees: "" }],
  });

  const [errors, setErrors] = useState({});
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Simulate async email check
  useEffect(() => {
    if (formData.email) {
      setEmailLoading(true);
      const timer = setTimeout(() => {
        if (formData.email.toLowerCase() === "test@example.com") {
          setEmailTaken(true);
        } else {
          setEmailTaken(false);
        }
        setEmailLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index][field] = value;

    // auto-fill duration & fees if courseName selected
    if (field === "courseName") {
      const selected = availableCourses.find((c) => c.name === value);
      if (selected) {
        updatedCourses[index].duration = selected.duration;
        updatedCourses[index].fees = selected.fees;
      }
    }

    setFormData({ ...formData, courses: updatedCourses });
  };

  const addCourse = () => {
    setFormData({
      ...formData,
      courses: [...formData.courses, { courseName: "", duration: "", fees: "" }],
    });
  };

  const removeCourse = (index) => {
    const updatedCourses = [...formData.courses];
    updatedCourses.splice(index, 1);
    setFormData({ ...formData, courses: updatedCourses });
  };

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.country) newErrors.country = "Country required";
    if (!formData.gender) newErrors.gender = "Select gender";
    if (emailTaken) newErrors.email = "Email already registered";
    return newErrors;
  };

  const validateStep2 = () => {
    let courseErrors = [];
    formData.courses.forEach((course, idx) => {
      const errs = {};
      if (!course.courseName) errs.courseName = "Select course";
      if (!course.duration) errs.duration = "Missing duration";
      if (!course.fees) errs.fees = "Missing fees";
      courseErrors[idx] = errs;
    });
    return courseErrors;
  };

  const nextStep = () => {
    if (step === 1) {
      const stepErrors = validateStep1();
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length === 0) setStep(2);
    } else if (step === 2) {
      const stepErrors = validateStep2();
      setErrors({ courses: stepErrors });
      const hasErrors = stepErrors.some((c) => Object.keys(c).length > 0);
      if (!hasErrors) setStep(3);
    }
  };

  const previousStep = () => setStep(step - 1);

  const confirmEnrollment = () => {
    setConfirmed(true);
    // Reset form after confirmation
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        country: "",
        gender: "",
        courses: [{ courseName: "", duration: "", fees: "" }],
      });
      setErrors({});
      setStep(1);
      setConfirmed(false);
    }, 4000);
  };

  return (
    <div className="form-container">
      <h2>Step {step} of 3</h2>

      {step === 1 && (
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {emailLoading && <p className="loading">Checking email...</p>}
          {errors.email && <p className="error-text">{errors.email}</p>}

          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={errors.country ? "error" : ""}
          >
            <option value="">-- Select Country --</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
          {errors.country && <p className="error-text">{errors.country}</p>}

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />{" "}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />{" "}
              Female
            </label>
          </div>
          {errors.gender && <p className="error-text">{errors.gender}</p>}
        </div>
      )}

      {step === 2 && (
        <div>
          {formData.courses.map((course, idx) => (
            <div key={idx} className="course-row">
              <select
                value={course.courseName}
                onChange={(e) =>
                  handleCourseChange(idx, "courseName", e.target.value)
                }
                className={errors.courses?.[idx]?.courseName ? "error" : ""}
              >
                <option value="">-- Select Course --</option>
                {availableCourses.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={course.duration}
                readOnly
                placeholder="Duration"
              />
              <input type="text" value={course.fees} readOnly placeholder="Fees" />
              <button type="button" onClick={() => removeCourse(idx)}>
                Remove
              </button>
              {errors.courses?.[idx]?.courseName && (
                <p className="error-text">{errors.courses[idx].courseName}</p>
              )}
            </div>
          ))}
          <button type="button" onClick={addCourse}>
            Add Course
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>Review Your Data</h3>
          <p>
            <b>Name:</b> {formData.name}
          </p>
          <p>
            <b>Email:</b> {formData.email}
          </p>
          <p>
            <b>Country:</b> {formData.country}
          </p>
          <p>
            <b>Gender:</b> {formData.gender}
          </p>
          <h4>Courses:</h4>
          <ul>
            {formData.courses.map((c, i) => (
              <li key={i}>
                {c.courseName} — {c.duration} — {c.fees}
              </li>
            ))}
          </ul>
          {!confirmed ? (
            <button onClick={confirmEnrollment}>Confirm Enrollment</button>
          ) : (
            <p className="success-msg">✅ Enrollment Confirmed!</p>
          )}
        </div>
      )}

      <div className="navigation-buttons">
        {step > 1 && step < 3 && (
          <button onClick={previousStep}>Previous</button>
        )}
        {step < 3 && (
          <button onClick={nextStep}>Next</button>
        )}
      </div>
    </div>
  );
};

export default CourseEnrollment;
