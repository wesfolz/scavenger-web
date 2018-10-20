import React from 'react';

export default function ConfirmationModal({ confirmModal }) {
    return (
        <div className="modal d-block">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Let's do this!</h5>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to complete the finale?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={() => confirmModal(true)}>Confirm</button>
                        <button type="button" className="btn btn-danger" onClick={() => confirmModal(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
