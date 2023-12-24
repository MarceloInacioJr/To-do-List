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
    setTodo({
      title: '',
      describe: '',
      date: '',
      time: '',
    });
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
    setTodo({
      title: '',
      describe: '',
      date: '',
      time: '',
      timestamp: 0,
    });
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
            <div className="form-task">
              <input
                type="text"
                placeholder="Titulo"
                value={todo.title}
                onChange={(e) => {
                  setTodo(prevTodo => ({ ...prevTodo, title: e.target.value }));
                }}
              />
              <input
                type="text"
                placeholder="Descrição"
                value={todo.describe}
                onChange={(e) => {
                  setTodo(prevTodo => ({ ...prevTodo, describe: e.target.value }));
                }}
              />

              <input
                type="date"
                value={todo.date}
                onChange={(e) => {
                  setTodo(prevTodo => ({ ...prevTodo, date: e.target.value }));
                }}
              />

              <input
                type="time"
                placeholder="List"
                value={todo.time}
                onChange={(e) => {
                  setTodo(prevTodo => ({ ...prevTodo, time: e.target.value }));
                }}
              />

              <button onClick={() => {
                writeDatabase()
                setCreateTaskForm(false)
              }}>OK</button>

              <button onClick={
                () => setCreateTaskForm(false)
              }>Cancelar</button>
            </div>

            :
            <></>
        }
        {
          sortedTodo.map((todoItem) => (
            <div className="list-body">
              <div key={todoItem.uidd || 'fallbackKey'} className="list">
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
                      <div className='btn-edit' onClick={() => handleEdit(todoItem)}>
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
              <>
                {
                  isEdit ? (
                    <>
                      <div className="form-isEdit-body">
                        <div className="form-isEdit-content">
                          <div className="form-isEdit-title">
                            <h1>Editar</h1>
                          </div>
                          <div className="form-content">
                            <div className="form">

                              <div id="input-title-edit" className="edit-form-component-input font-input-text">
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

                              <div id="input-description-edit" className="edit-form-component-input font-input-text">
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

                              <div id="input-date-edit" className="edit-form-component-input font-input-date-time">
                                <label htmlFor="e-date">Data</label>
                                <input
                                  type="date"
                                  name='e-date'
                                  className='title-form'
                                  value={todo.date}
                                  onChange={e => {
                                    setTodo(prevTodo => ({ ...prevTodo, date: e.target.value }));
                                  }}
                                />
                              </div>

                              <div id="input-time-edit" className="edit-form-component-input font-input-date-time">
                                <label htmlFor="e-time">Hora</label>
                                <input
                                  type="time"
                                  name='e-time'
                                  className=' title-form'
                                  value={todo.time}
                                  onChange={e => {
                                    setTodo(prevTodo => ({ ...prevTodo, time: e.target.value }));
                                  }}
                                />
                              </div>
                              <div className="buttons-edit" id='buttons-edit'>
                              <button id='button-edit' onClick={() => handleConfirmEdit(todoItem)}>Confirmar</button>
                              <button id='button-edit-cancel' onClick={() => { setIsEdit(false) }}>Cancelar</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="cover-isEdit"></div>
                    </>
                  ) : null}
              </>
            </div>

          ))}
      </div>
    </div>
  );
};

export default Home;
