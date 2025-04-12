import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
export default function SelectProvince({ value, setProvince }) {
    const [provinces, setProvinces] = useState([]);
    useEffect(
        () => {
            fetch("https://open.oapi.vn/location/provinces?page=0&size=63", {
                method: "GET"
            }
            ).then(data => data.json()).then(
                data => {
                    console.log(data)
                    setProvinces(data.data)
                }
            )
        }, []
    )
    return (
        <>
            <Form.Select
                onChange={(e) => {
                    setProvince({
                        id: e.target.value.substring(0, e.target.value.indexOf("-")),
                        name: e.target.value.substring(e.target.value.indexOf("-") + 1)
                    })
                }}
                aria-label="Default select example">
                <option value={""}>-- Tỉnh --</option>
                {
                    provinces?.map(
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