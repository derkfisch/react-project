import React from 'react';
import { useNavigate } from 'react-router-dom';

//create a function to allow the user to login
export default function Login({ flashMessage, logUserIn }) {

    const navigate = useNavigate();

    async function handleLogin(event){
        event.preventDefault();

        //get the data from the user 
        let username = event.target.username.value;
        let password = event.target.password.value;
        let stringToEncode = `${username}:${password}`

        //set up the headers
        let myHeaders = new Headers();
        myHeaders.append('Authorization', `Basic ${btoa(stringToEncode)}`);

        //make a fetch request
        let response = await fetch("http://127.0.0.1:5000/api/token", {
					method: "POST",
					
					headers: myHeaders,
				});

        //return the response
        let data = await response.json();

        if (data.error){
            flashMessage(data.error, 'danger');
        } else {
            //use the token from the response 
            console.log(data);
            let token = data.token;
            let expiration = data.token_exp;

            //store the response as a token
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExp', expiration);

            //log user in
            logUserIn(true);

            <flashMessage duration={3000}>('Good To Go!', 'success');</flashMessage>
            navigate('/');
        };

    };

    //set up place for user to log in
    return (
        <>
            <h3 className="text-center">Log In</h3>
            <form action="" onSubmit={handleLogin}>
                <div className="form-group">
                    <input type="text" name="username" className="form-control my-3" placeholder='Your Username Goes Here' />
                    <input type="password" name="password" className="form-control my-3" placeholder='Your Password Goes Here' />
                    <input type="submit" value="Get Logged In!" className='btn btn-primary w-100' />
                </div>
            </form>
        </>
    )
}