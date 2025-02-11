import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faRotateLeft, faThumbsDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Spinner from "./HtmlComponents/Spinner";
import { saveData } from "../Services/API-services";
import { getSessionStorage } from "./CommonComponents/cookieData";

const CustomerChecker = () => {
  const path = window.location.pathname;
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [remark, setRemark] = useState("");
  const navigate = useNavigate();
  const [reqDate, setReqDate] = useState('');
  const [reqTime, setReqTime] = useState('');
  const USER = getSessionStorage("USER");

const [requestData, setRequestData] = useState(location.state.requestData || {});
  //const [requestTableData, setRequestTableData] = useState(requestData1)
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
    if(action === 'Declined' && !remark){
      toast.error("Please add Reason", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }
    setIsLoading(true);
    //requestData.updatedValue.state  = "Maharashtra"
    requestData.lastModifiedBy = USER.userId
    const data = {
      status: action,
      checkerId: USER.userId,
      checker_remark: remark
    };
    const newdata = { ...requestData, ...data };
    const baseUrl = process.env.REACT_APP_API_URL;
    saveData(
      newdata,
      `${baseUrl}/checheraction`,
      (res) => {
        setIsLoading(false);
        toast.success(`Request ${action} successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/CustomerRequest");
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

  // const formatFieldLabel = (field) => {
  //   return field.replace(/_/g, ' ')
  //               .replace(/\b\w/g, (char) => char.toUpperCase());
  // };

  return (
    <div>
      <div className="content-wrapper ">
        <div className="content-header">
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 ">
                <div className="card">
                  <div className="card-header">
                  <div className="row alignCenter">
                        <div className="col-sm-10">
                          <h1 className="m-0 pageTitle">
                            Request Details
                          </h1>
                        </div>
                        <div className="col-sm-2"></div>
                      </div>                    
              </div>
              <div className="card-body">
                <div className="row UserDetails mt-3">
                  <div className="col-md-12 mx-auto">
              <div className="row text-start">
              <div className="col-md-6 mx-auto">
                <table className="table checkerDetails">    
                  <tbody>
                    <tr>
                      <td className="col-md-6 UDCoulmns fieldColumn">
                        <strong>Request Id:</strong>
                      </td>
                      <td className="col-md-6 UDCoulmns">{requestData.requestId}</td>
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
                    {requestData.requestType === 'add' && (
                      <tr className="">
                      <th className="col-md-4 UDCoulmns">Field Name</th>
                      <th className="col-md-4 UDCoulmns">Values</th>
                      <th className="col-md-4 UDCoulmns"></th>           
                      </tr>
                      )}
                      {requestData.requestType !== 'add' && (
                      <tr className="">
                      <th className="col-md-4 UDCoulmns">Field Name</th>
                      <th className="col-md-4 UDCoulmns">Updated Value</th>
                      <th className="col-md-4 UDCoulmns">Old Value</th>
                      </tr>
                      )}
                  </thead>
                  {/* <tbody>
                        {requestTableData.map(({ field, existingValue, newValue }) => (
                          <tr key={field}>
                            <td className="col-md-4 UDCoulmns fieldColumn">
                              <strong>{formatFieldLabel(field)}:</strong>
                            </td>
                            <td className="col-md-4 UDCoulmns">{newValue}</td>
                            <td className="col-md-4 UDCoulmns">{existingValue}</td>
                          </tr>
                        ))}
                      </tbody> */}
                  <tbody>
                  <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>Customer Name:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.customer_name}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.customer_name}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>Customer Account No:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.customer_account_no}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.customer_account_no}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>State:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.state}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.state}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>IFSC Code:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.ifsc_code}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.ifsc_code}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>E-collection Merchant ID:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.merchant_name}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.merchant_name}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>Client ID:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.client_id}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.client_id}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>Secret Key:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.client_secret}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.client_secret}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>Email ID:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.email_id}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.email_id}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>Mobile No:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.mobile_no}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.mobile_no}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>Remark:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.description}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.description}</td>
                    </tr>
                    <tr>
                      <td className="col-md-4 UDCoulmns fieldColumn">
                        <strong>IsActive:</strong>
                      </td>
                      <td className="col-md-4 UDCoulmns">{updatedValue.is_active}</td>
                      <td className="col-md-4 UDCoulmns">{oldValue.is_active}</td>
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
                  onClick={() => navigate("/CustomerRequest")}
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
            </div>
              </div>
            </div>
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

export default CustomerChecker;
