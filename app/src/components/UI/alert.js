import {Alert} from 'react-bootstrap'
import React, {useContext} from 'react'
import {AlertContext} from "../../context/alert/alertContext";
//
const AlertCustom = () => {

    const {alert} = useContext(AlertContext)

    return(
        <Alert show={alert.isVisible} variant={alert.type}>
            <Alert.Heading>{alert.headText}</Alert.Heading>
            <p>{alert.bodyText}</p>
        </Alert>
    )
}

export default AlertCustom