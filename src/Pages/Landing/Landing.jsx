import React, { useEffect, useState } from "react";
import "./Landing.css";
import mask from "../../assets/Covid.jpeg";
import maskMobile from "../../assets/Covid_Mobile.jpeg";
import logo from "../../assets/logo.png";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { baseUrl, pages } from "../../config";
import { saveFormData, saveStatistics } from "../../redux/formDataSlice";
import axios from "axios";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
    .required("Pincode is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  date: Yup.date().required("Date is required"),
});

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Use effect");
    setLoading(true);
    const retrieveData = async () => {
      try {
        const storedFormDataString = localStorage.getItem("formData");
        if (storedFormDataString) {
          const storedFormData = JSON.parse(storedFormDataString);
          console.log(storedFormData);
          const response = await axios.get(
            `${baseUrl}/findByPin?pincode=${storedFormData?.pincode}&date=${storedFormData?.date}`
          );
          console.log("response", response);
          if (response?.data?.statistics) {
            dispatch(saveStatistics({ statistics: response.data.statistics }));
            localStorage.setItem("formData", JSON.stringify(storedFormData));
            navigate(pages.Statistics);
          }
        }
      } catch (error) {
        console.log("Error", error);
      }
      setLoading(false);
    };
    retrieveData();
  }, []);

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    pincode: "",
    email: "",
    date: "",
  });

  const resetInitialValues = () => {
    setInitialValues({
      firstName: "",
      lastName: "",
      pincode: "",
      email: "",
      date: "",
    });
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    try {
      dispatch(saveFormData(values));
      const formData = values;
      const response = await axios.get(
        `${baseUrl}/findByPin?pincode=${formData?.pincode}&date=${formData?.date}`
      );
      console.log("response", response);
      if (response?.data?.statistics) {
        dispatch(saveStatistics({ statistics: response.data.statistics }));
        localStorage.setItem("formData", JSON.stringify(formData));
        navigate(pages.Statistics);
      }
    } catch (error) {
      console.log("Error", error);
    }
    setSubmitting(false);
  };

  return (
    <>
      {loading ? (
        <div className="loading_container">
          <h1>Loading ...</h1>
        </div>
      ) : (
        <div className="main_container">
          <div className="container_landing">
            <div className="logo_container_hero">
              <img src={logo} alt="" />
            </div>
            <div className="image_container">
              <img src={mask} alt="" className="mask_image" />
              <img src={maskMobile} alt="" className="mask_image_mobile" />
              <div className="overlay">
                <h1>Vaccine Tracker</h1>
                <p>
                  Find all the important information and <br /> all the things
                  related to Covid Virus
                  <br /> and Vaccine here
                </p>
              </div>
            </div>
          </div>
          <div className="form_container">
            <div className="container_landing_mobile">
              <div className="logo_container_hero">
                <img src={logo} alt="" />
              </div>
              <div className="image_container">
                <img src={mask} alt="" className="mask_image" />
                <img src={maskMobile} alt="" className="mask_image_mobile" />
                <div className="overlay">
                  <h1>Vaccine Tracker</h1>
                  <p>
                    Find all the important information and <br /> all the things
                    related to Covid Virus
                    <br /> and Vaccine here
                  </p>
                </div>
              </div>
            </div>
            <div className="logo_container">
              <img src={logo} alt="" />
            </div>
            <div className="details_form">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="label_container">
                      <p className="field_label">First Name</p>
                      <ErrorMessage
                        name="firstName"
                        className="error"
                        component="div"
                      />
                    </div>
                    <Field
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="input_field"
                    />
                    <div className="label_container">
                      <p className="field_label">Last Name</p>
                      <ErrorMessage
                        name="lastName"
                        className="error"
                        component="div"
                      />
                    </div>
                    <Field
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="input_field"
                    />
                    <div className="label_container">
                      <p className="field_label">Email</p>
                      <ErrorMessage
                        name="email"
                        className="error"
                        component="div"
                      />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="input_field"
                    />
                    <div className="label_container">
                      <p className="field_label">Pincode</p>
                      <ErrorMessage
                        name="pincode"
                        className="error"
                        component="div"
                      />
                    </div>
                    <Field
                      type="number"
                      name="pincode"
                      placeholder="Pincode"
                      className="input_field"
                    />
                    <div className="label_container">
                      <p className="field_label">Date</p>
                      <ErrorMessage
                        name="date"
                        className="error"
                        component="div"
                      />
                    </div>
                    <Field
                      name="date"
                      className="input_field"
                      type="text"
                      onFocus={(e) => (e.currentTarget.type = "date")}
                      onBlur={(e) => (
                        (e.currentTarget.type = "text"),
                        (e.currentTarget.placeholder = "Date")
                      )}
                      placeholder="Date"
                    />

                    <button
                      type="submit"
                      className="submit_btn"
                      disabled={isSubmitting}
                    >
                      Show Statistics
                    </button>
                    <button
                      type="reset"
                      className="reset_btn"
                      onClick={() => resetInitialValues()}
                    >
                      Reset Form
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Landing;
