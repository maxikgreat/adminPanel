
import React, {useState, useEffect} from 'react'
import {Jumbotron, Container} from 'react-bootstrap'


const Login = ({login, passError}) => {

    const [pass, setPass] = useState({value: '', error: ''});

    useEffect(() => {
            setPass({
                ...pass,
                error: passError
            })
    }, [passError])

    const checkValidPass = () => {
        if(pass.value.length < 5){
            setPass({
                ...pass,
                error: "Password must contain minimum 6 characters!"
            })
        } else {
            login(pass.value)
        }
    }

    return(
        <div className = "login-container">
            <Jumbotron fluid>
                <Container>
                    <h1>Login</h1>
                    <div className={pass.error ? "form-group has-danger" : "form-group"}>
                        <input
                            type="password"
                            className={pass.error ? "form-control is-invalid" : "form-control"}
                            placeholder="Password"
                            value = {pass.value}
                            onChange={(e) => {setPass({
                                ...pass,
                                value: e.target.value
                            })}}
                        />
                        <div className="invalid-feedback">{pass.error}</div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick = {() => checkValidPass()}
                    >Enter
                    </button>
                </Container>
            </Jumbotron>
        </div>
    )
}

export default Login