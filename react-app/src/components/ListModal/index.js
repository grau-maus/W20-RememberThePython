import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import { Modal } from "../../context/Modal";
import NewListForm from "./NewListForm";
import styles from "./ListForm.module.css";
import plusIcon from "../../images/icons/font-awesome/plus-solid.svg";

function ListModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button variant="light" className={styles.addBtn} onClick={() => setShowModal(true)}>
        <ReactSVG src={plusIcon} wrapper="svg" className={styles.plusIcon} />
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <NewListForm />
        </Modal>
      )}
    </>
  );
}

export default ListModal;
