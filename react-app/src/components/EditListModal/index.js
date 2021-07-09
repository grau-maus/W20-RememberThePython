import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import { Modal } from "../../context/Modal";
import EditListForm from "./EditListForm";
import { Button } from "react-bootstrap";
import styles from "./EditList.module.css"
import editIcon from "../../images/icons/font-awesome/edit-regular.svg";

function EditListModal({ title, id }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button variant="Light" className={styles.editBtn} onClick={() => setShowModal(true)}>
        {/* <i className="far fa-edit"></i> */}
        <ReactSVG src={editIcon} wrapper="svg" className={styles.editIcon} />
      </Button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <EditListForm id={id} title={title} />
        </Modal>
      )}
    </>
  );
}

export default EditListModal;
