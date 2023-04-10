import React from "react";
import { useNavigate } from "react-router-dom";

//set up function that allows user to sign up for the program
export default function SignUp({ flashMessage }) {
	const navigate = useNavigate();

	const handleSignUp = (event) => {
		event.preventDefault();

        //get data from the user
		let password = event.target.password.value;
		let confirmPass = event.target.confirmPass.value;
        //make sure passwords matchup
		if (password !== confirmPass) {
			flashMessage("Passwords must match", "warning");
		} else {
			console.log("Good to go");

            //define the headers
			let myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			let formData = JSON.stringify({
				username: event.target.username.value,
				email: event.target.email.value,
				password,
			});

            //make a fetch request
			fetch("http://localhost:5000/api/users", {
				method: "POST",
				headers: myHeaders,
				body: formData,
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.error) {
						flashMessage(data.error, "danger");
					} else {
						flashMessage(`${data.username} has been created`, "success");
						navigate("/");
					}
				});
		}
	};

    //set up inputs for the user to respond with the account details
	return (
		<>
			<h3 className="text-center">Get Signed Up</h3>
			<form action="" onSubmit={handleSignUp}>
                <div className="form-group">
                    <input type="text" name="username" className="form-control my-3" placeholder='What Will Your Username Be?' />
                    <input type="text" name="email" className="form-control my-3" placeholder='Your Email Goes Here' />
                    <input type="password" name="password" className="form-control my-3" placeholder='Create Password' />
                    <input type="password" name="confirmPass" className="form-control my-3" placeholder='Confirm Password' />
                    <input type="submit" value="Register Account" className='btn btn-success w-100' />
                </div>
            </form>
        </>
    )
}