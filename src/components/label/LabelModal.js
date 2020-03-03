import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const LabelModal = ({ showModal, handleClose, handleLogout, remainingTime, label,updateFieldData }) => {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',

        }
    };
    
    return (

        <Modal show={showModal} style={customStyles} onHide={handleClose} style={{ opacity: 1 }}>
            <Modal.Header >
                {/* closeButton */}
                <Modal.Title>Update Labels</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <input type="hidden" value={label.labelId} name="labelId" />
                <br /><br />
                <label className="col-md-5 control-label"> English Label :</label>
                <input type="text" value={label.label_en} name="label_en" onChange={updateFieldData}/>
                <br /><br />
                <label className="col-md-5 control-label">French  Label :</label>
                <input type="text" value={label.label_fr} name="label_fr" />
                <br /><br />
                <label className="col-md-5 control-label">Spanish  Label :</label>
                <input type="text" value={label.label_sp} name="label_sp" />
                <br /><br />
                <label className="col-md-5 control-label">Portuguese  Label :</label>
                <input type="text" value={label.label_pr} name="label_pr" />
                <br /><br />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleLogout}>
                    SUBMIT
            </Button>
                <Button variant="danger" onClick={handleClose}>
                    CANCEL
            </Button>
            </Modal.Footer>
        </Modal>
    )
}