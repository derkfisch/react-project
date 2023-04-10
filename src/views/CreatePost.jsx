import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost({ loggedIn, flashMessage }) {
	const navigate = useNavigate();
    //make sure the user is logged in to create posts
	useEffect(() => {
		if (!loggedIn) {
			flashMessage("Log In To Create Post", "danger");
			navigate("/login");
		}
	});

    //create a function that will submit the data provided
	async function handleSubmit(e) {
		e.preventDefault();

        //get the data from the form
		let title = e.target.title.value;
		let content = e.target.content.value;

        //take the token from local storage
		let token = localStorage.getItem("token");

        //define the headers
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", `Bearer ${token}`);

        //set up request body
		let requestBody = JSON.stringify({ title, content });

        //make a fetch request to the api
		let response = await fetch("http://localhost:5000/api/posts", {
			method: "POST",
			headers: myHeaders,
			body: requestBody,
		});

        //return the resonse to the form
		let data = await response.json();

		if (data.error) {
			flashMessage(data.error, "danger");
		} else {
			flashMessage(`Your post ${data.title} has been created`, "success");
			navigate("/");
		}
	}

    //set up the inputs for the user
	return (
		<>
			<h3 className="text-center">Create A Post!</h3>
			<form action="" onSubmit={handleSubmit}>
				<div className="form-group">
					<input type="text" name="title" className="form-control my-3" placeholder="Title Goes Here..." />
					<textarea name="content" className="form-control my-3" placeholder="Post Content Goes Here..."/>
					<input type="submit" value="Submit Post" className="btn btn-primary w-100" />
				</div>
			</form>
		</>
	);
}