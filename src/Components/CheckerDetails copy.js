import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faRotateLeft, faThumbsDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Spinner from "../Components/HtmlComponents/Spinner";
import { saveData } from "../Services/API-services";

const CheckerDetails = () => {
  const path = window.location.pathname;
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [remark, setRemark] = useState("");
  const navigate = useNavigate();
  const [reqDate, setReqDate] = useState('');
  const [reqTime, setReqTime] = useState('');

  const [requestData, setRequestData] = useState(location.state.requestData || {});
  const [updatedValue, setUpdatedValue] = useState(requestData.updatedValue || {});
  const [oldValue, setOldValue] = useState(requestData.existing_values || {});

  const getDateTime = (datestring) => {
    const dateTime = new Date(datestring);

    // Extract date components
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = dateTime.getDate();

    // Extract time components
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();
    const second = dateTime.getSeconds();
      
    setReqDate(`${year}-${month}-${day}`);
    setReqTime(`${hour}:${minute}:${second}`);   
} 
useEffect(() => {
  if (requestData && requestData.makerTimestamp) {
    getDateTime(requestData.makerTimestamp);
  }
}, [requestData]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "40%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function CheckerApproval(action) {
    setIsLoading(true);
    requestData.updatedValue.user_password = "Dell@123"
    requestData.updatedValue.is_aprove = 1
    requestData.updatedValue.is_login = 1
    requestData.updatedValue.login_attempt = 1
    requestData.updatedValue.is_locked = 0
    requestData.updatedValue.is_dormant = 1
    const data = {
      utilityType: "user",
      makerId: requestData.masterId,
      requestType: requestData.requestType,
      tableName: "txn_sb_users",
      updatedValue: requestData.updatedValue,
      description: "Creating a new user",
      status: action,
      createdBy: "makerName",
      checkerId: 1,
      lastModifiedBy: requestData.makerId,
      existing_values: requestData.existing_values,
      masterId: requestData.masterId
};
    const baseUrl = process.env.REACT_APP_API_URL;
    saveData(
      data,
      `${baseUrl}/checheraction`,
      (res) => {
        setIsLoading(false);
        toast.success(`Request ${action} successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/PendingApproval");
        }, 1000);
      },
      (error) => {
        setIsLoading(false);
        console.error("Error->", error);
        toast.error(error, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    );
  }

  return (
    <div className="container UDContainer">
      <Spinner isLoading={isLoading} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="content">
            <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 ">
            <h2 className="mb-3 mt-3 pageTitle">Request Details</h2>
          </div>
        </div>
        <div className="row mt-4 text-start">
  <div className="col-md-6 mx-auto">
    <table className="table">
      <tbody>
        <tr>
          <td className="col-md-6 UDCoulmns fieldColumn">
            <strong>Request Id:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">{requestData.masterId}</td>
        </tr>
        <tr>
          <td className="col-md-6 UDCoulmns fieldColumn">
            <strong>Maker ID:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">{requestData.makerId}</td>
        </tr>
        <tr>
          <td className="col-md-6 UDCoulmns fieldColumn">
            <strong>Request Type:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">{requestData.requestType}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div className="col-md-6">
    <table className="table">
      <tbody>
        {/* <tr>
          <td className="col-md-6 UDCoulmns">
            <strong>User Full Name:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">{requestData.utilityType}</td>
        </tr> 
        <tr>
          <td className="col-md-6 UDCoulmns">
            <strong>Mobile Number:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">{updatedValue.contactNo}</td>
        </tr>
        <tr>
          <td className="col-md-6 UDCoulmns">
            <strong>Email:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">{updatedValue.emailId}</td>
        </tr>
        <tr>
          <td className="col-md-6 UDCoulmns">
            <strong>Created Date:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">
            {new Date(requestData.createdDate).toLocaleDateString()}
          </td>
        </tr>
        <tr>
          <td className="col-md-6 UDCoulmns">
            <strong>User ID:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">{updatedValue.userName}</td>
        </tr>
         <tr>
          <td className="col-md-6 UDCoulmns">
            <strong>Employee Number:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">{updatedValue.employeeNumber}</td>
        </tr> */}
        
        <tr>
          <td className="col-md-6 UDCoulmns fieldColumn">
            <strong>Request Date:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">
            {/* {new Date(requestData.makerTimestamp).toLocaleDateString()} */}
            {reqDate}
          </td>
        </tr>
        <tr>
          <td className="col-md-6 UDCoulmns fieldColumn">
            <strong>Request Time:</strong>
          </td>
          <td className="col-md-6 UDCoulmns">
            {/* {new Date(requestData.makerTimestamp).toLocaleDateString()} */}
            {reqTime}
          </td>
        </tr>        
      </tbody>
    </table>
  </div>
</div>
<div className="row mt-4 makerFields">
  <div className="col-md-12 p-0">
    <table className="table">
      <thead>
        <tr className="">
          <th className="col-md-4 UDCoulmns">Field Name</th>
          <th className="col-md-4 UDCoulmns">Updated Value</th>
          <th className="col-md-4 UDCoulmns">Old Value</th>
        </tr>
      </thead>
      <tbody>
      <tr>
          <td className="col-md-4 UDCoulmns fieldColumn">
            <strong>First Name:</strong>
          </td>
          <td className="col-md-4 UDCoulmns">{updatedValue.first_name}</td>
          <td className="col-md-4 UDCoulmns">{oldValue.first_name}</td>
        </tr>
        <tr>
          <td className="col-md-4 UDCoulmns fieldColumn">
            <strong>Last Name:</strong>
          </td>
          <td className="col-md-4 UDCoulmns">{updatedValue.last_name}</td>
          <td className="col-md-4 UDCoulmns">{oldValue.last_name}</td>
        </tr>
        <tr>
          <td className="col-md-4 UDCoulmns fieldColumn">
            <strong>Mobile No:</strong>
          </td>
          <td className="col-md-4 UDCoulmns">{updatedValue.contact_no}</td>
          <td className="col-md-4 UDCoulmns">{oldValue.contact_no}</td>
        </tr>
        <tr>
          <td className="col-md-4 UDCoulmns fieldColumn">
            <strong>Email:</strong>
          </td>
          <td className="col-md-4 UDCoulmns">{updatedValue.email_id}</td>
          <td className="col-md-4 UDCoulmns">{oldValue.email_id}</td>
        </tr>
        <tr>
          <td className="col-md-4 UDCoulmns fieldColumn">
            <strong>User Id:</strong>
          </td>
          <td className="col-md-4 UDCoulmns">{updatedValue.user_name}</td>
          <td className="col-md-4 UDCoulmns">{oldValue.user_name}</td>
        </tr>
        {/* <tr>
          <td className="col-md-4 UDCoulmns">
            <strong>Employee Number:</strong>
          </td>
          <td className="col-md-4 UDCoulmns">{updatedValue.employeeNumber}</td>
          <td className="col-md-4 UDCoulmns">{oldValue.employeeNumber}</td>
        </tr> */}
        <tr>
          <td className="col-md-4 UDCoulmns fieldColumn">
            <strong>Role:</strong>
          </td>
          <td className="col-md-4 UDCoulmns">{updatedValue.role_id}</td>
          <td className="col-md-4 UDCoulmns">{oldValue.role_id}</td>
        </tr>
        <tr>
          <td className="col-md-4 UDCoulmns fieldColumn">
            <strong>IsActive:</strong>
          </td>
          <td className="col-md-4 UDCoulmns">{String(updatedValue.is_active)}</td>
          <td className="col-md-4 UDCoulmns">{String(oldValue.is_active)}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div className="row mb-5">
  <div className="col-md-12">
  <div className="modal-footer">
    <button
      className="btn BackBtn me-2"
      type="submit"
      onClick={() => navigate("/PendingApproval")}
    >
      <FontAwesomeIcon icon={faRotateLeft} className="whiteIcon" />
      Back to List
    </button>
    <button
      className="btn addUser declineBtn"
      type="button"
      onClick={openModal}
    >
      <FontAwesomeIcon icon={faThumbsDown} className="plusIcon" />
      Decline Request
    </button>
    <button
      className="btn addUser"
      type="button"
      onClick={() => {
        setIsLoading(true);
        CheckerApproval("Approved");
      }}
    >
      <FontAwesomeIcon icon={faCheck} className="plusIcon" />
      Approve Request
    </button>
  </div>
  </div>
</div>

        {/* ----------Decline Pop------------------- */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div>
            <div className="float-end mt-2">
              <FontAwesomeIcon
                icon={faTimes}
                className="closeIconPopup"
                onClick={closeModal}
              />
            </div>
            <h3 className="text-left">Please add Request decline reason</h3>
            <div className="">
              <textarea
                rows="4"
                name="remark"
                className="form-control"
                placeholder="Enter your remark here"
                onChange={(e) => {
                  setRemark(e.target.value);
                }}
              />
              <div className="p-2"></div>
              <div className="text-center">
                <button
                  className="btn addUser checkerAction mr-3 declineBtn"
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    CheckerApproval("Declined");
                  }}
                >
                  Decline
                </button>
                <button
                  className="btn addUser checkerAction"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default CheckerDetails;
