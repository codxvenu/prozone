import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Handle click on the overlay
  const handleOverlayClick = () => {
    onClose();
  };

  // Handle click inside the modal content
  const handleModalContentClick = (event) => {
    event.stopPropagation(); // Prevents closing when clicking inside the modal content
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={handleModalContentClick}
        style={{
          background: "#081a29",
          height: 550,
          margin: "auto",
          padding: "0 2% 2%",
          border: "2px solid #000",
          borderRadius: "10px",
          boxShadow: "2px solid black",
          overflow : "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
