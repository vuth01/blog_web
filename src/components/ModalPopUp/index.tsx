import React from "react";
import { Modal, Button } from "react-bootstrap";
export const ModalPopUp = ({ isOpen, setIsOpen, handleDeleteArticle }: any) => {
  if (!isOpen) return null;
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>DELETE ARTICLE</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Do you want to delete this article?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => handleDeleteArticle()}>
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};
