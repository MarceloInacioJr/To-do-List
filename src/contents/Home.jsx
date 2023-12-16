import { useEffect, useState } from 'react';
import NavBar from './NavBar';
import './styles/home.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../db/configFirebase';
import { onValue, ref, remove, set, update } from 'firebase/database';
import { uid } from 'uid';

const Home = () => {
  const navigate = useNavigate();
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

  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user){
        const displayName = user.displayName
        setnameUser(displayName || '')
      }else{
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
    set(ref(db, `${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
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
    });
  }

  // Delete list
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
  }

  return (
    <div className="body-home">
      <div className="navBar" id="id-navbar">
        <NavBar></NavBar>
      </div>

      <div className="content-home" id="id-navbar">
        <div className="content-date">
          <p id="timer">{currentTime}</p>
          <p id="date-today">{dateToday()}</p>
        </div>

        <div className="message">
          <p>Seja bem vindo {nameUser}</p>

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

          <button onClick={writeDatabase}>OK</button>
        </div>

        {todos.map((todoItem) => (
          <div key={todoItem.uidd||'fallbackKey'} className="list">
            <div className="date-list">{todoItem.todo?.date ? new Date(todoItem.todo.date).toLocaleDateString('pt-BR') : 'sem data'} <span>{
              todoItem.todo?.time || '00:00'}</span></div>

            <div className="list-row">
              <div className="title-list">{todoItem.todo?.title || 'sem titulo'}</div>
              <div className="description-list">
                <p>Descrição: {todoItem.todo?.describe || 'sem time '}</p>
              </div>
              
              
              {
                
                isEdit ? (
                  <div className="form-isEdit">
                    <input
                      type="text"
                      className='input title-form'
                      value={todo.title}
                      placeholder='Titulo'
                      onChange={e => {
                        setTodo(prevTodo => ({ ...prevTodo, title: e.target.value }));
                      }}
                    />
                    <input
                      type="text"
                      className='input title-form'
                      value={todo.describe}
                      placeholder='Descrição'
                      onChange={e => {
                        setTodo(prevTodo => ({ ...prevTodo, describe: e.target.value }));
                      }}
                    />
                    <input
                      type="date"
                      className='input title-form'
                      value={todo.date}
                      onChange={e => {
                        setTodo(prevTodo => ({ ...prevTodo, date: e.target.value }));
                      }}
                    />
                    <input
                      type="time"
                      className='input title-form'
                      value={todo.time}
                      onChange={e => {
                        setTodo(prevTodo => ({ ...prevTodo, time: e.target.value }));
                      }}
                    />
                    <button onClick={() => handleConfirmEdit(todoItem)}>Confirmar</button>
                    <button onClick={() => { setIsEdit(false) }}>Cancelar</button>
                  </div>
                ) : (
                  <div className="btn-noEdit">
                    <button onClick={() => handleEdit(todoItem)}>Editar</button>
                    <button onClick={() => handleDelete(todoItem.uidd)}>Excluir</button>
                  </div>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
