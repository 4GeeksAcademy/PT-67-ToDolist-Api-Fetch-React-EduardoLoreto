import React, { useEffect, useState } from "react";
const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState("EduardoLoreto");
    const [label, setLabel] = useState("");
	
    // Método GET para obtener array con todas las tareas existentes para mi usuario
    const getAllData = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${name}`);
            if (response.ok) {
                const dataJson = await response.json();
                setTasks(dataJson.todos);
                console.log(dataJson.todos);
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
        const newTask = { label };
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
        const response = await fetch(`https://playground.4geeks.com/todo/users/${name}`)
        if (response.ok) {
            getAllData()
            setTasks([])
        } else {
            await fetch(`https://playground.4geeks.com/todo/users/${name}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" }
            });
            console.log("Usuario creado!")
        }
    };
    useEffect(() => {
        getAllData();
    }, [name]);
    useEffect(() => {
        setLabel("");
    }, [tasks]);
    return (
        <div className="container-fluid row-flex justify-content-center w-75 mb-5 mt-5">
            <form onSubmit={createUser} className="mb-4">
                <div className="mb-3">
                    <label className="form-label"><strong>New User</strong></label>
                    <input
                        placeholder="Name User"
                        value={name}
                        className="form-control"
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-warning mb-3"><strong>New User</strong></button>
            </form>
            <form onSubmit={createNewElement}>
                <div className="mb-3">
                    <label className="form-label"><strong>Task List</strong></label>
                    <input
                        placeholder="Add New Task"
                        value={label}
                        className="form-control"
                        aria-describedby="emailHelp"
                        onChange={(event) => setLabel(event.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-warning mb-3"><strong>Add Task</strong></button>
            </form>
            <div className="w-100 m-auto">
                <ol>
                    {tasks?.map((item, index) => (
                        <li key={index}>
                            {item.label}
                            <button
                                className="btn btn-warning btn-sm ms-3"
                                onClick={() => deleteElement(item.id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
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