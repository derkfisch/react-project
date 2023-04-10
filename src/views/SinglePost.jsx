import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

//set up function that allows user to edit and delete posts
export default function SinglePost({ loggedIn }) {
	//get all info from existing post
	const params = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState({ title: "", content: "" });
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	//make sure the user is logged in
    useEffect(() => {
		if (!loggedIn)
			fetch(`http://localhost:5000/api/posts/${params.postId}`)
				.then((res) => res.json())
				.then((data) => {
					setPost(data);
					setTitle(data.title);
					setContent(data.content);
				});
	}, [params.postId]);

	//edit function
	async function handleSubmit(e) {
		e.preventDefault();

		//update the data
		let updatedTitle = title;
		let updatedContent = content;

		//get the token from the local storage
		let token = localStorage.getItem("token");

		//define the headers
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", `Bearer ${token}`);

		//set up a request body
		let requestBody = JSON.stringify({
			title: updatedTitle,
			content: updatedContent,
		});

		//set up a fetch request
		let response = await fetch(
			`http://localhost:5000/api/posts/${params.postId}`,
			{
				method: "PUT",
				headers: myHeaders,
				body: requestBody,
			}
		);

		//return the response
		let data = await response.json();

		if (data.error) {
			console.log(data.error, "danger");
			navigate("/login");
		} else {
			console.log(`${data.title} is updated`, "success");
			navigate("/");
		}
	}

	//delete function
     async function handleDelete(e) {
				e.preventDefault();

				//get token from local storage
				let token = localStorage.getItem("token");

				//define the headers
				let myHeaders = new Headers();
				myHeaders.append("Authorization", `Bearer ${token}`);

				//make a fetch request & delete
				let response = await fetch(
					`http://localhost:5000/api/posts/${params.postId}`,
					{
						method: "DELETE",
						headers: myHeaders,
					}
				);

				//return data
				let data = await response.json();

				if (data.error) {
					console.log(data.error, "danger");
				} else {
					console.log(`${data.success}`, "success");
					navigate("/");
				}
			}
    //set up a place for user to edit and delete
	return (
		<>
			<h3 className="text-center">Edit Post</h3>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input type="text" name="title" className="form-control my-3" placeholder="Title Goes Here..." value={title} onChange={(e) => setTitle(e.target.value)} />
					<textarea name="content" className="form-control my-3" placeholder="Post Content Goes Here..." value={content} onChange={(e) => setContent(e.target.value)} />
                    <div className="btn-group">
						<input type="submit" value="Update" className="btn btn-primary w-100" />
						<button className="btn btn-danger" onClick={handleDelete}>Delete</button>
					</div>
                </div>
			</form>
		</>
	);
}