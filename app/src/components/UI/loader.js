
import React from 'react'
import {Spinner} from 'react-bootstrap'

const Loader = () => {
    return(
        <div className = 'loader-container'>
            <Spinner
                as="span"
                animation="border"
                variant="primary"
                size="lg"
                role="status"
                aria-hidden="true"
            />
        </div>
    )
};

export default Loader