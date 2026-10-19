// employee form inside a modal
import Modal from "./Modal.jsx";
import EmployeeForm from "./EmployeeForm.jsx";

function EmployeeFormModal({ open, employee, onClose, onSave }) {
  const isEdit = Boolean(employee);

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Employee" : "Add Employee"}
      subtitle="Fields marked with * are required."
      onClose={onClose}
    >
      <EmployeeForm
        key={employee?.id || "new"}
        initialValues={employee}
        submitLabel={isEdit ? "Save Changes" : "Add Employee"}
        onSubmit={onSave}
        onCancel={onClose}
      />
    </Modal>
  );
}

export default EmployeeFormModal;
