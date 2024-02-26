import React, { useEffect, useState } from "react";
import "./Statistics.css";
import logo from "../../assets/logo.png";
import { baseUrl, pages } from "../../config";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveStatistics } from "../../redux/formDataSlice";
import axios from "axios";

const Statistics = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.formData);
  const [userData, setUserData] = useState();
  const statistics = formData?.statistics;

  useEffect(() => {
    const fetchDataFromLocalStorage = async () => {
      const storedFormDataString = localStorage.getItem("formData");
      if (storedFormDataString) {
        const storedFormData = JSON.parse(storedFormDataString);
        setUserData(storedFormData);
        const response = await axios.get(
          `${baseUrl}/findByPin?pincode=${storedFormData?.pincode}&date=${storedFormData?.date}`
        );
        console.log("response", response);
        if (response?.data?.statistics) {
          dispatch(saveStatistics({ statistics: response.data.statistics }));
          localStorage.setItem("formData", JSON.stringify(storedFormData));
        }
      }
    };
    fetchDataFromLocalStorage();
  }, []);

  const updateData = async () => {
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

        }
      } else {
        console.log("No formData found in localStorage");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const goBack = () => {
    localStorage.removeItem("formData");
    navigate(pages.Landing);
  };

  return (
    <>
      <div className="statistics_container">
        <div className="navbar">
          <div className="stats_header">
            <div className="logo_container_stats">
              <img src={logo} alt="" className="logo_statistics_mobile" />
            </div>
            <div className="navbar_text_first_line">
              <h1 className="full_name">
                {userData?.firstName + " " + userData?.lastName}
              </h1>
              <p className="pincode_text">, {userData?.pincode}</p>
            </div>
            <p className="email_text">{userData?.email}</p>
          </div>
          <div>
            <img src={logo} alt="" className="logo_statistics" />
          </div>
        </div>
        <div className="table_container">
          <table className="table">
            <thead style={{ backgroundColor: "#007bff", color: "white" }}>
              <tr>
                <th scope="col">Pincode</th>
                <th scope="col">District Name</th>
                <th scope="col">Name</th>
                <th scope="col">Fee Type</th>
                <th scope="col">State Name</th>
                <th scope="col">Vaccine</th>
                <th scope="col">Age Limit</th>
                <th scope="col">Slots</th>
              </tr>
            </thead>
            <tbody>
              {statistics?.map((s, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "table-row-odd" : "table-row-even"}
                >
                  <td>{s?.pincode}</td>
                  <td>{s?.district}</td>
                  <td>{s?.centerName}</td>
                  <td>{s?.feeType}</td>
                  <td>{s?.stateName}</td>
                  <td>{s?.vaccine}</td>
                  <td>{s?.ageLimit}</td> <td>{s?.slot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="button_container_main">
          <div className="button_container">
            <button className="back_btn" onClick={() => goBack()}>
              Go Back
            </button>
            <button className="update_btn" onClick={() => updateData()}>
              Update Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;
