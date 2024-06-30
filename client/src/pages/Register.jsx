import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <>
      <section id="register">
        <div className="registerInner">
          <form onSubmit={handleSubmit}>
            <h1>Registration</h1>
            <div className="inputBox">
              <div className="inputField">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="inputField">
                <input
                  type="text"
                  placeholder="User Name"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
                <i className="bx bxs-user"></i>
              </div>
            </div>
            <div className="inputBox">
              <div className="inputField">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <i className="bx bxs-envelope"></i>
              </div>
              <div className="inputField">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <i className="bx bxs-phone"></i>
              </div>
            </div>
            <div className="inputBox">
              <div className="inputField">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type={passwordVisibility.password ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  {passwordVisibility.password ? (
                    <i className="fa-solid fa-eye"></i>
                  ) : (
                    <i className="fa-solid fa-eye-slash"></i>
                  )}
                </span>
              </div>
              <div className="inputField">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type={
                    passwordVisibility.confirmPassword ? "text" : "password"
                  }
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {passwordVisibility.confirmPassword ? (
                    <i className="fa-solid fa-eye"></i>
                  ) : (
                    <i className="fa-solid fa-eye-slash"></i>
                  )}
                </span>
              </div>
            </div>
            <label>
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              I hereby declare that the above information provided is true and
              correct
            </label>
            <button type="submit" className="btn">
              Register
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
