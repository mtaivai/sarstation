import React from 'react';

import {Form} from "react-bootstrap";

import {orElse} from "../../util";


export default function TextField(props) {

    const {initialValue, name, label, placeholder, onChange} = props;

    const [value, setValue] = React.useState(initialValue);

    const renderLabel = () => {
        if (label !== null && typeof label !== "undefined") {
            return (<Form.Label>{label}</Form.Label>);
        } else {
            return null;
        }
    }

    const handleChange = (ev) => {
        setValue(ev.target.value);
        if (onChange !== null && typeof onChange !== "undefined") {
            onChange(ev, ev.target.value);
        }
    }
    return (
        <Form.Group controlId="formBasicEmail">
            {renderLabel()}
            <Form.Control as="textarea" type={"input"} placeholder={orElse(placeholder, "")} value={orElse(value, "")} onChange={handleChange}/>
            <Form.Text className={"text-muted"}>
                We'll never share your email with anyone else.
            </Form.Text>
        </Form.Group>
    );


}
