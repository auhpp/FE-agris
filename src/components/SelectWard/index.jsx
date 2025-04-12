import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
export default function SelectWard({ value, setWard, districtId }) {
    const [wards, setWards] = useState([]);
    useEffect(
        () => {
            fetch(`https://open.oapi.vn/location/wards/${districtId}?page=0&size=30`, {
                method: "GET"
            }
            ).then(data => data.json()).then(
                data => {
                    console.log(data)
                    setWards(data.data)
                }
            )
        }, [districtId]
    )
    return (
        <>
            <Form.Select className="mt-2"
                onChange={(e) => {
                    console.log(e.target)
                    setWard({
                        id: e.target.value.substring(0, e.target.value.indexOf("-")),
                        name: e.target.value.substring(e.target.value.indexOf("-") + 1)
                    })
                }}

                aria-label="Default select example">
                <option value={""}>-- Xã / Phường --</option>
                {
                    wards?.map(
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