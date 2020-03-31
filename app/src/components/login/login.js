
import React, {useState} from 'react'
import {Jumbotron, Container} from 'react-bootstrap'


const Login = ({login}) => {

    const [pass, setPass] = useState("");

    return(
        <div className = "login-container">
            <Jumbotron fluid>
                <Container>
                    <h1>Login</h1>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value = {pass}
                            onChange={(e) => {setPass(e.target.value)}}
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick = {() => login(pass)}
                    >Enter
                    </button>
                </Container>
            </Jumbotron>
        </div>
    )
}

export default Login