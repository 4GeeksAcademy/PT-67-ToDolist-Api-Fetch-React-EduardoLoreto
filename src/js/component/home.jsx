import React, { useEffect, useState } from "react";

const Home = () => {
	const [tasks, setTasks] = useState([]);
	const [name, setName] = useState("EduardoLoreto");
	const [label, setLabel] = useState("");
	const [isDone, setIsDone] = useState(false);
	const [newUserName, setNewUserName] = useState("");

	// Método GET para obtener array con todas las tareas existentes para mi usuario
	const getAllData = async () => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/${name}`);
			if (response.ok) {
				const dataJson = await response.json();
				setTasks(Array.isArray(dataJson.todos) ? dataJson.todos : []);
				console.log("Datos obtenidos:", dataJson.todos);
			} else {
				console.error("Error al recuperar datos:", response.statusText);
			}
		} catch (error) {
			console.error("Error al recuperar datos:", error);
		}
	};

	// Método POST para añadir nuevas tareas al array de mi usuario
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

	// Método DELETE para eliminar una tarea específica con un botón
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

	// Método DELETE para eliminar TODAS las tareas del array de mi usuario
	const deleteAllElements = async () => {
		try {
			// 1.-Envío DELETE para cada tarea con mapeo y el "id" dinámico
			const deletePromises = tasks.map((item) =>
				fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, { method: 'DELETE' })
			);

			// 2.- Esperar a que todas las peticiones DELETE se completen
			await Promise.all(deletePromises);

			// 3.- Actualizar el array de "tasks"
			setTasks([]);
			console.log("Todas las tasks han sido eliminadas");
		} catch (error) {
			console.error("Error al eliminar todas las tasks:", error);
		}
	};

	// Método POST para crear un nuevo usuario
	const createUser = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/${newUserName}`, {
				method: 'POST',
				headers: { "Content-Type": "application/json" }
			});

			if (response.ok) {
				setName(newUserName);
				setNewUserName("");
				setTasks([]);
				console.log("Usuario creado:", newUserName);
				getAllData(); // Obtener las tareas del nuevo usuario
			} else {
				console.error("Error al crear usuario:", response.statusText);
			}
		} catch (error) {
			console.error("Error al crear usuario:", error);
		}
	};

	useEffect(() => {
		getAllData();
	}, [name]);

	useEffect(() => {
		setLabel("");
	}, [tasks]);

	return (
		<div className="row m-auto py-2">
			<form onSubmit={createUser} className="mb-4">
				<div className="mb-3">
					<label className="form-label"><strong>Crear Usuario</strong></label>
					<input
						placeholder="Nombre de usuario"
						value={newUserName}
						className="form-control"
						onChange={(event) => setNewUserName(event.target.value)}
					/>
				</div>
				<button type="submit" className="btn btn-info mb-3">Crear Usuario</button>
			</form>
			<form onSubmit={createNewElement}>
				<div className="mb-3">
					<label className="form-label"><strong>Listado de Tasks</strong></label>
					<input
						placeholder="Añade tu nueva Task"
						value={label}
						className="form-control"
						aria-describedby="emailHelp"
						onChange={(event) => setLabel(event.target.value)}
					/>
				</div>
				<button type="submit" className="btn btn-info mb-3">X</button>
			</form>
			<div className="w-100 m-auto">
				<ol>
					{tasks.map((item, index) => (
						<li key={index}>
							{item.label}
							<button
								className="btn btn-success btn-sm ms-2"
								onClick={() => deleteElement(item.id)}
							>
								¡Hecho!
							</button>
						</li>
					))}
				</ol>
				<button
					className="btn btn-warning text-danger my-3"
					onClick={deleteAllElements}
				><strong>Ok Tareas!</strong>
				</button>
			</div>
		</div>
	);
};

export default Home;
