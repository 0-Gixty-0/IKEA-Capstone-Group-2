import React, { useState } from "react";
import { useFetchRoles } from "@/hooks/useFetchRoles";
import { useAddToReadingList } from "@/hooks/useAddToReadingList";
import { mapRolesToOptions } from "@/utils/mapRolesToOptions";
import CheckboxDropdown from "@/app/components/CheckboxDropdown/CheckboxDropdown";
import styles from "./AddToReadingListModal.module.css";
import { AddToReadingListModalProps } from "@/types";

const AddToReadingListModal: React.FC<AddToReadingListModalProps> = ({
  postId,
  onClose,
}) => {
  const { roles, error: rolesError } = useFetchRoles();
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const { loading, error, handleAddToReadingList } = useAddToReadingList(postId, onClose);

  const roleOptions = mapRolesToOptions(roles);

  const handleSubmit = () => {
    handleAddToReadingList(selectedRoles);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h1 className={styles.heading}>Add Post to Reading List</h1>
        {rolesError ? (
          <p>{rolesError}</p>
        ) : (
          <CheckboxDropdown
            options={roleOptions}
            selectedOptions={selectedRoles}
            onChange={setSelectedRoles}
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
        <button onClick={handleSubmit} disabled={loading} className={styles.addButton}>
          {loading ? "Adding..." : "Add to Reading List"}
        </button>
      </div>
    </div>
  );
};

export default AddToReadingListModal;