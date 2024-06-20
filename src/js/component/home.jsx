import React, { useEffect, useState } from "react";

const Home = () => {
	const [tasks, setTasks] = useState([]);
	const [name, setName] = useState("");
	const [label, setLabel] = useState("");
	const [isDone, setIsDone] = useState(false);
	const [newUserName, setNewUserName] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const getAllData = async () => {
		const response = await fetch(`https://playground.4geeks.com/todo/users/${name}`);
		if (response.ok) {
			const dataJson = await response.json();
			if (Array.isArray(dataJson.todos)) {
				setTasks(dataJson.todos);
				if (dataJson.todos.length === 0) {
					alert("El usuario introducido ya existe, añade las tareas.");
				} else {
					alert("El usuario introducido ya existe, añade o borra tareas.");
				}
			}
		} else {
			console.error("Error al obtener tareas:", response.statusText);
		}
	};

	const createNewElement = async (event) => {
		event.preventDefault();
		const newTask = { label, done: isDone };
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${name}`, {
				method: 'POST',
				body: JSON.stringify(newTask),
				headers: { "Content-Type": "application/json" }
			});

			if (response.ok) {
				const dataJson = await response.json();
				setTasks([...tasks, dataJson]);
				console.log("Task creada:", dataJson);
			} else {
				console.error("Error al crear Task:", response.statusText);
			}
		} catch (error) {
			console.error("Error al crear Task:", error);
		}
	};

	const deleteElement = async (taskId) => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				setTasks(tasks.filter((item) => item.id !== taskId));
				console.log("Task eliminada:", taskId);
			} else {
				console.error("Error al eliminar Task:", response.statusText);
			}
		} catch (error) {
			console.error("Error al eliminar Task:", error);
		}
	};

	const deleteAllElements = async () => {
		try {
			const deletePromises = tasks.map((item) =>
				fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, { method: 'DELETE' })
			);

			await Promise.all(deletePromises);
			setTasks([]);
			console.log("Todas las tasks han sido eliminadas");
		} catch (error) {
			console.error("Error al eliminar todas las tasks:", error);
		}
	};

	const createUser = async (event) => {
		event.preventDefault();
		const user = { username: newUserName }; // Asegúrate de que este es el formato que el servidor espera
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users`, {
				method: 'POST',
				body: JSON.stringify(user),
				headers: { "Content-Type": "application/json" }
			});

			if (response.ok) {
				setName(newUserName);
				setNewUserName("");
				setTasks([]);
				setIsAuthenticated(true);
				console.log("Usuario creado:", newUserName);
				getAllData();
			} else {
				const errorData = await response.json();
				console.error("Error al crear usuario:", errorData);
			}
		} catch (error) {
			console.error("Error al crear usuario:", error);
		}
	};

	useEffect(() => {
		if (name) {
			getAllData();
		}
	}, [name]);

	useEffect(() => {
		setLabel("");
	}, [tasks]);

	return (
		<div className="container-fluid row-flex justify-content-center w-75 mb-5 mt-5">
			{!isAuthenticated && (
				<form onSubmit={createUser} className="mb-4">
					<div className="mb-3">
						<label className="form-label"><strong>New User</strong></label>
						<input
							placeholder="Name User"
							value={newUserName}
							className="form-control"
							onChange={(event) => setNewUserName(event.target.value)}
						/>
					</div>
					<button type="submit" className="btn btn-warning mb-3"><strong>New User</strong></button>
				</form>
			)}
			<form onSubmit={createNewElement}>
				<div className="mb-3">
					<label className="form-label"><strong>Task List</strong></label>
					<input
						placeholder="Add New Task"
						value={label}
						className="form-control"
						onChange={(event) => setLabel(event.target.value)}
					/>
				</div>
				<button type="submit" className="btn btn-warning mb-3"><strong>Add Task</strong></button>
			</form>
			<div className="w-100 m-auto">
				<ol>
					{tasks.map((item, index) => (
						<li key={index}>
							{item.label}
							<button
								className="btn btn-warning btn-sm ms-3"
								onClick={() => deleteElement(item.id)}
							>
								<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black">
									<path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
								</svg>
							</button>
						</li>
					))}
				</ol>
				<button
					className="btn btn-warning d-flex text-center my-3"
					onClick={deleteAllElements}
				><strong>¡Delete Task!</strong>
				</button>
			</div>
		</div>
	);
};

export default Home;
