import { useEffect, useState } from 'react';
import NavBar from './NavBar';
import './styles/home.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../db/configFirebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { uid } from 'uid';


const Home = () => {
  const navigate = useNavigate();
  const [createTaskForm, setCreateTaskForm] = useState(false)

  const [nameUser, setnameUser] = useState("")

  // timer
  const [currentUrl, setCurrentUrl] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const url = window.location.href;

  // edit 
  const [isEdit, setIsEdit] = useState(false)
  const [editForm, setEditForm] = useState(null)


  // Realtime database
  const [todo, setTodo] = useState({
    title: '',
    describe: '',
    date: '',
    time: '',
  });
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // verificando se o usuario esta na pagina /home
    if (url.indexOf('/home') !== -1) {
      setCurrentUrl(true);
      console.log('use');
    } else {
      setCurrentUrl(false);
      console.log('use não');
    }
  }, [url]);

  useEffect(() => {
    // verificando se o usuario esta logado
    const inLog = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('user logado');
        onValue(ref(db, `${auth.currentUser.uid}`), (inst) => {
          setTodos([]);
          const data = inst.val();
          if (data !== null) {
            Object.values(data).forEach((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else {
        navigate('/');
      }
    });
    return () => inLog();
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const displayName = user.displayName
        setnameUser(displayName || '')
      } else {
        navigate('/')
      }
    })
  })

  // Date
  const dateToday = () => {
    let stringMonth = [
      'Jan.',
      'Fev.',
      'Mar.',
      'Abr.',
      'Mai.',
      'Jun.',
      'Jul.',
      'Ago.',
      'Set.',
      'Out.',
      'Nov.',
      'Dez.',
    ];

    let date = new Date();
    let day = date.getDate();
    let month = stringMonth[date.getMonth()];
    let year = date.getFullYear();
    let dateNow = `${day < 10 ? `0${day}` : day} ${month} ${year}`;
    return dateNow;
  };

  // time
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentUrl) {
        const date = new Date();
        let hours = date.getHours();
        let minute = date.getMinutes();

        let timer = `${hours < 10 ? `0${hours}` : hours}:${minute < 10 ? `0${minute}` : minute}`;

        setCurrentTime(timer);
      } else {
        console.log('Nao ativado');
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentUrl]);


  // Add list database
  const writeDatabase = () => {
    const uidd = uid();
    const timestamp = Date.now()

    set(ref(db, `${auth.currentUser.uid}/${uidd}`), {
      todo: { ...todo, timestamp },
      uidd: uidd,
    });
    clearInputs()
  };

  // Edit list
  const handleEdit = (todoItem) => {
    setIsEdit(true)
    setTodo(todoItem.todo)

  }

  const handleConfirmEdit = (todoItem) => {
    update(ref(db, `/${auth.currentUser.uid}/${todoItem.uidd}`), {
      todo: {
        title: todo.title || todoItem.todo.title,
        describe: todo.describe || todoItem.todo.describe,
        date: todo.date || todoItem.todo.date,
        time: todo.time || todoItem.todo.time,
      },
    });
    setIsEdit(false);  // Defina o modo de edição como falso
    clearInputs()
  }

  // Delete list
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
  }

  // format date in pt-br
  const formatDate = (date) => {
    let dateObj = new Date()
    let dateToday = dateObj.toISOString().split('T')[0].replace(/-/g, '/').split("/").reverse().join('/')

    let dateFormated = date.replace(/-/g, '/').split("/").reverse().join('/')
    if (dateToday !== dateFormated) {
      return <><span className="span-day">{dateFormated}</span> -</>
    } else {
      return <><span className="span-day">Hoje  </span> -</>
    }

  }

  // sort list
  const sortedTodo = todos.sort((a, b) => {
    return b.todo.timestamp - a.todo.timestamp
  })


  // clear inputs 
  const clearInputs = () => {
    setTodo({
      title: '',
      describe: '',
      date: '',
      time: '',
      timestamp: 0,
    });
  }

  return (
    <div className="body-home">
      <div className="navBar" id="id-navbar">
        <NavBar handleCreateTask={() => setCreateTaskForm(true)}></NavBar>
      </div>

      <div className="content-home" id="id-navbar">
        <div className="content-date">
          <p id="timer">{currentTime}</p>
          <p id="date-today">{dateToday()}</p>
        </div>

        <div className="message">
          <p>Olá <span id='message-name-user'>{nameUser}</span> seja bem-vindo(a)</p>
        </div>

        <div className="list-task-title">
          <h1>Tarefas</h1>
        </div>
        {

          createTaskForm ?
            <>
              <div className="form-isEdit-body">
                <div className="form-isEdit-content ">
                  <div className="form-isEdit-title">
                    <h1>Criar tarefa</h1>
                  </div>
                  <div className="form-content">
                    <div className="form">

                      <div className="edit-form-component-input font-input-text input-title-edit">
                        <label htmlFor="e-title">Titulo</label>
                        <input
                          type="text"
                          className='input title-form'
                          value={todo.title}
                          onChange={(e) => {
                            setTodo(prevTodo => ({ ...prevTodo, title: e.target.value }));
                          }}
                        />
                      </div>

                      <div className="edit-form-component-input font-input-text input-description-edit">
                        <label htmlFor="e-discription">Descrição</label>
                        <input
                          type="text"
                          value={todo.describe}
                          onChange={(e) => {
                            setTodo(prevTodo => ({ ...prevTodo, describe: e.target.value }));
                          }}
                        />
                      </div>
                      <div className="edit-form-component-input font-input-date-time input-date-edit">
                        <label htmlFor="e-date">Data</label>
                        <input
                          type="date"
                          name='e-date'
                          value={todo.date}
                          onChange={(e) => {
                            setTodo(prevTodo => ({ ...prevTodo, date: e.target.value }));
                          }}
                        />
                      </div>

                      <div className="edit-form-component-input font-input-date-time input-time-edit">
                        <label htmlFor="e-time">Hora</label>
                        <input
                          type="time"
                          name="e-time"
                          className='title-form'
                          value={todo.time}
                          onChange={(e) => {
                            setTodo(prevTodo => ({ ...prevTodo, time: e.target.value }));
                          }}
                        />
                      </div>
                      <div className="buttons-edit" id='buttons-edit'>
                        <button className='button-edit' onClick={() => {
                          writeDatabase()
                          setCreateTaskForm(false)

                        }}>OK</button>

                        <button
                          className='button-edit-cancel'
                          onClick={
                            () => setCreateTaskForm(false)
                          }>Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cover-isEdit"></div>
            </>
            :
            <></>

        }

        {
          /* Form Edit */
          isEdit ? (

            <>

              <div className="form-isEdit-body">
                <div className="form-isEdit-content">
                  <div className="form-isEdit-title">
                    <h1>Editar</h1>
                  </div>
                  <div className="form-content">
                    <div className="form">

                      <div className="edit-form-component-input font-input-text input-title-edit">
                        <label htmlFor="e-title">Título</label>
                        <input
                          type="text"
                          name='e-title'
                          className='input title-form'
                          value={todo.title}
                          onChange={e => {
                            setTodo(prevTodo => ({ ...prevTodo, title: e.target.value }));
                          }}
                        />
                      </div>

                      <div className="edit-form-component-input font-input-text input-description-edit">
                        <label htmlFor="e-description">Descrição</label>
                        <input
                          type="text"
                          name='e-discription'
                          className='input title-form'
                          value={todo.describe}
                          placeholder='Descrição'
                          onChange={e => {
                            setTodo(prevTodo => ({ ...prevTodo, describe: e.target.value }));
                          }}
                        />
                      </div>

                      <div className="edit-form-component-input font-input-date-time input-date-edit">
                        <label htmlFor="e-date">Data</label>
                        <input
                          type="date"
                          name='e-date'
                          value={todo.date}
                          onChange={e => {
                            setTodo(prevTodo => ({ ...prevTodo, date: e.target.value }));
                          }}
                        />
                      </div>

                      <div className="edit-form-component-input font-input-date-time input-time-edit">
                        <label htmlFor="e-time">Hora</label>
                        <input
                          type="time"
                          name='e-time'
                          value={todo.time}
                          onChange={e => {
                            setTodo(prevTodo => ({ ...prevTodo, time: e.target.value }));
                          }}
                        />
                      </div>
                      <div className="buttons-edit" id='buttons-edit'>
                        <button className='button-edit disable' onClick={() => { handleConfirmEdit(editForm) }}>Confirmar</button>
                        <button className='button-edit-cancel' onClick={() => { setIsEdit(false) }}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cover-isEdit"></div>
            </>
          ) : null

        }
        {
          // list
          sortedTodo.map((todoItem) => (
            <div key={todoItem.uidd || 'falbackKey'} className="list-body">
              <div className="list">
                <div className="date-list">{(
                  todoItem.todo?.date ?
                    formatDate(todoItem.todo.date) : 'Sem data'
                )} <span>{
                  todoItem.todo?.time || '00:00'}</span></div>

                <div className="task-content">
                  <div className="title-task">
                    <div className="triangle">
                      <div className="figure">
                        {todoItem.todo?.title.charAt(0).toUpperCase() + todoItem.todo.title.slice(1) || 'Sem titulo'}

                      </div>
                    </div>

                  </div>
                  <div className="description-list">
                    <p> {todoItem.todo?.describe.charAt(0).toUpperCase() + todoItem.todo.describe.slice(1) || 'Sem descrição'}</p>
                  </div>

                  {
                    <div className="btn-noEdit">
                      <div className='btn-edit' onClick={() => {
                        handleEdit(todoItem)
                        setEditForm(todoItem)
                      }
                      }>
                        <div id="img-button-editEditar"></div>
                        <p>Editar</p>
                      </div>
                      <div className='btn-cancel' onClick={() => handleDelete(todoItem.uidd)}>
                        <div id="img-button-delete"></div>
                        <p>Excluir</p>
                      </div>
                    </div>

                  }
                </div>
                <div className="hr-content">
                  <div className="hr-line"></div>
                </div>
              </div>

            </div>

          ))}
      </div>
    </div>
  );
};

export default Home