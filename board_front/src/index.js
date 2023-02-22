import React, { useState, useEffect, setPosts, deleteItem } from 'react';
import ReactDOM from 'react-dom';
import './style/style.css';
import { Note } from './components/note';

const baseURL = 'http://127.0.0.1:8000/';

const App = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [posts, setPosts] = useState([]);

	const createNote = async (event) => {
		event.preventDefault();

		const new_request = new Request(`${baseURL}/posts/`, {
			body: JSON.stringify({ title, content }),
			headers: {
				'Content-type': 'Application/Json',
			},
			method: 'POST',
		});

		const response = await fetch(new_request);

		const data = await response.json();

		if (response.ok) {
			console.log(data);
		} else {
			console.log('Błąd');
		}

		setTitle('');
		setContent('');

		setModalVisible(false);
		getAllPosts();
	};

	const getAllPosts = async () => {
		const response = await fetch(`${baseURL}/posts/`);

		const data = await response.json();

		if (response.ok) {
			console.log(data);
			setPosts(data);
		} else {
			console.log('Brak połączenia');
		}
	};

	useEffect(() => {
		getAllPosts();
	}, []);


	const deleteItem = async (noteId) => {
		const response = await fetch(`${baseURL}/posts/${noteId}/`, {
			method: 'DELETE'
		});

		getAllPosts();
	};

	return (
		<div>
			<div className='header'>
				<div className='logo'>
					<p className='title'>Notatki</p>
				</div>
				<div className='add-section'>
					<a className='add-btn' href='#' onClick={() => setModalVisible(true)}>
						Dodaj notatkę
					</a>
				</div>
			</div>

			{posts.length > 0 ? (
				<div className='post-list'>
					{posts.map((item) => (
						<Note
							title={item.title}
							content={item.content}
							onclick={()=> deleteItem(item.id)}
							key={item.id}
						/>
					))}
				</div>
			) : (
				<div className='posts'>
					<p className='centerText'>Brak Notatek</p>
				</div>
			)}

			<div className={modalVisible ? 'modal' : 'modal-not-visible'}>
				<div className='form'>
					<div className='form-header'>
						<div>
							<p className='form-header-text'>Dodaj nową notatkę</p>
						</div>
						<div>
							<a
								href='#'
								className='close-btn'
								onClick={() => setModalVisible(!modalVisible)}>
								X
							</a>
						</div>
					</div>
					<form action=''>
						<div className='form-group'>
							<label htmlFor='title'>Tytuł</label>
							<input
								type='text'
								className='form-control'
								id='title'
								name='title'
								placeholder='Wprowadź tytuł'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='content'>Treść</label>
							<textarea
								className='form-control'
								name='content'
								placeholder='Wprowadź treść'
								cols='30'
								rows='5'
								value={content}
								onChange={(e) => setContent(e.target.value)}
								required></textarea>
						</div>
						<div className='form-group'>
							<input
								type='submit'
								value='Dodaj'
								className='btn'
								onClick={createNote}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

ReactDOM.render(<App />, document.querySelector('#root'));
