import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Alert } from "@mui/material";
import { useState } from "react";
export default function AlertSuccess({ message, showAlert, onClose }) {
    return (
        <>
            {
                showAlert && (
                    <Alert variant="filled" onClose={onClose} severity="success">{message}</Alert>
                )
            }
        </>
    );
}