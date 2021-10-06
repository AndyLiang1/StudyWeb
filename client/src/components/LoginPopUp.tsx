import * as React from 'react';
import { useState } from 'react';
import GoogleLogin from 'react-google-login';
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import "./Css/LoginPopUp.css"

import { ILoginForm } from "../helpers/Interfaces"
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useHistory } from "react-router-dom"
import { AuthContext } from '../helpers/Contexts';
import image_for_side from '../img/login_icon.png'



interface Props {
    loginPopUpOpen: boolean;
    setLoginPopUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function LoginPopUp({ loginPopUpOpen, setLoginPopUpOpen }: Props) {
    const [badLogin, setBadLogin] = useState<boolean>(false)
    const [loginMsg, setLoginMsg] = useState<string>("")
    let history = useHistory()
    const initialValues = {
        email: "",
        password: "",
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required(),
        password: Yup.string().max(50).required(),
    })

    const signIn = (submittedData: ILoginForm) => {
        const { email, password } = submittedData
        fetch("https://studyweb-backend.herokuapp.com/api/v1/users/signin", {
            mode: 'cors',
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setBadLogin(true)
                    setLoginMsg(data.error)
                } else {
                    // console.log(`Success! Data is: `, data)
                    localStorage.setItem("accessToken", data.token)
                    localStorage.setItem("name", data.name)
                    localStorage.setItem("id", data.id)
                    localStorage.setItem("loggedIn", "true")
                    history.push("./user")
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }

    const googleSuccess = async (res: any) => {
        const result = res?.profileObj; // if DNE, no error, result just  
        // just gonna be DNE 
        const { givenName, email, googleId } = result
        const emailLowerCase = email.toLowerCase()
        const name = givenName
        fetch("https://studyweb-backend.herokuapp.com/api/v1/users/google_auth", {
            mode: 'cors',
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: emailLowerCase,
                password: googleId
            })
        }).then(response => response.json())
            .then(data => {
                if (data.error) {
                    setBadLogin(true)
                    setLoginMsg(data.error)
                } else {
                    localStorage.setItem("accessToken", data.token)
                    localStorage.setItem("name", data.name)
                    localStorage.setItem("id", data.id)
                    localStorage.setItem("loggedIn", "true")
                    history.push("../user")

                }
            })
            .catch((error) => {
                console.log(error)
            })

    }
    const googleFailure = (error: any) => {
        console.log(error)
        console.log('Google success failed.')
    }

    const closeLoginPopUp = (): void => {
        setLoginPopUpOpen(false)
    }

    return (
        <div className="sign_in_page">
            <div className="image_side">
                <div className="image_container">
                    <img className="image_for_side" src={image_for_side}></img>
                </div>
            </div>
            <div className="sign_in_side">
                <AiOutlineCloseCircle className="sign_in_close_btn" onClick={closeLoginPopUp}></AiOutlineCloseCircle>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={signIn}
                >
                    {({ errors, touched }) => (
                        <Form className="sign_in_form">
                            <h1 className="sign_in_title">Log in</h1>
                            <div className="sign_in_details">
                                <label className="sign_in_label required" htmlFor="">Email </label>
                                <Field className="sign_in_field" name="email" type="email" />
                                {errors.email && touched.email ? <div className="sign_in_field_errors">{errors.email}</div> : null}
                            </div>

                            <div className="sign_in_details">
                                <label className="sign_in_label required" htmlFor="">Password </label>
                                <Field className="sign_in_field" name="password" type="password" />
                                {errors.password && touched.password ? (
                                    <div className="sign_in_field_errors">{errors.password}</div>
                                ) : null}
                            </div>

                            {badLogin ? (
                                <div className="sign_in_message_red">{loginMsg}</div>
                            ) : null}

                            <button className="sign_in_button" type="submit">Log in</button>

                            <GoogleLogin
                                clientId="817144640879-lu721n4hbhffop5e60iqdk31f3f1e4d4.apps.googleusercontent.com"
                                render={renderProps => (
                                    <button onClick={renderProps.onClick} className='g-sign-in-button'>
                                        <div className='content-wrapper'>
                                            <div className='logo-wrapper'>
                                                <img src='https://developers.google.com/identity/images/g-logo.png'></img>
                                            </div>
                                            <span className='text-container'>
                                                <span>Sign in with Google</span>
                                            </span>
                                        </div>
                                    </button>)}
                                onSuccess={googleSuccess}
                                onFailure={googleFailure}
                                cookiePolicy="single_host_origin"
                                className="sign_up_Google"
                            ></GoogleLogin>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
