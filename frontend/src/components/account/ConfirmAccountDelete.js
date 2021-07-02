import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";

import { useUpdateAuth } from "../../contexts/AuthContext";
import { authOptions } from "../../utils/requestOptions";

export default function ConfirmAccountDelete() {
  const axios = require("axios");
  const history = useHistory();
  const { username } = useParams();
  if (username === null) history.goBack();

  // Context
  const setAuth = useUpdateAuth();

  // Delete request to API
  const handleClick = async () => {
    await axios
      .delete(`/api/${username}`, authOptions(localStorage.getItem("torch_at")))
      .then(() => {
        const localStorageData = ["torch_at", "torch_rt", "torch_user_data"];

        localStorageData.map((data) => localStorage.removeItem(data));
        setAuth(false);
        alert("Account deleted.");
        history.push("/");
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };

  return (
    <Alert variant="danger" className="m-5 text-center">
      Account will be deleted immediately and cannot be recovered!
      <p>Are you sure?</p>
      <p>
        <Button variant="danger" onClick={handleClick}>
          DELETE
        </Button>
      </p>
    </Alert>
  );
}
