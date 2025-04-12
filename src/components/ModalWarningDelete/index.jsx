
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
export default function ModalWarningDelete({ show, setShow, onCLickAgree }) {
    return (
        <>
            <Modal show={show} onHide={() => { setShow(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">Cảnh báo!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn xóa ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary"
                        size="lg" onClick={() => { setShow(false) }}>
                        Hủy
                    </Button>
                    <Button size="lg"
                        variant="success" onClick={onCLickAgree
                        }>
                        Đồng ý
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    );
}