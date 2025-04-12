import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
export default function SelectDistrict({ value, provinceId, setDistrict }) {
    const [districts, setDistricts] = useState([]);
    console.log("proviceId", provinceId)
    useEffect(
        () => {
            fetch(`https://open.oapi.vn/location/districts/${provinceId}?page=0&size=100`, {
                method: "GET"
            }
            ).then(data => data.json()).then(
                data => {
                    console.log(data)
                    setDistricts(data.data)
                }
            )
        }, [provinceId]
    )
    return (
        <>
            <Form.Select className="mt-2" aria-label="Default select example"
                onChange={(e) => {
                    setDistrict(
                        {
                            id: e.target.value.substring(0, e.target.value.indexOf("-")),
                            name: e.target.value.substring(e.target.value.indexOf("-") + 1)
                        }
                    )
                }}

            >
                <option value={""}>-- Quận / Huyện --</option>
                {
                    districts?.map(
                        p => (
                            <option
                                value={p.id + "-" + p.name}>{p.name}</option>
                        )
                    )
                }
            </Form.Select>
        </>
    )
}