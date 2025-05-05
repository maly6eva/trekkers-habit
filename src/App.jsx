import './App.css'
import {Habits} from "./component/Habits.jsx";
import React, {useState, useEffect} from "react";

const getNext7Days = () => {
    const days = []
    const now = new Date()
    for (let i = 0; i < 7; i++) {
        const date = new Date(now)
        date.setDate(now.getDate() + i)
        days.push({
            day: date.toLocaleDateString('ru-Ru', {weekday: 'short'}),
            date: date.getDate()
        })
    }
    return days
}


function App() {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('tasks')
        return saved ? JSON.parse(saved) : []
    })
    const [day, setDay] = useState('')

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])
    const days = getNext7Days()

    function addTask(task) {
        setTasks((prevTasks) => [task, ...prevTasks])
    }

    function removeTask(id) {
        setTasks((del) => del.filter(task => task.id !== id))
    }

    return (
        <>
            <h1>🧘 Трекер привычек</h1>
            <Habits addTask={addTask} day={day} setDay={setDay}/>

            <ul>
                {tasks.map((t) => {
                    return (
                        <li className='day' key={t.id}>
                            <div className='task'>
                                <p>{t.habits}</p>
                                <section className="habits" value={day} onChange={(e) => setDay(e.target.value)}>
                                    {days.map((d, index) => (
                                        <option key={index} value={`${d.day} ${d.date}`}>
                                            {d.day} {d.date}
                                        </option>
                                    ))}
                                </section>
                                <div className='button'>
                                    <button onClick={() => removeTask(t.id)}>❌</button>
                                    <button>{`<7дн`}</button>
                                    <button>{`7дн>`}</button>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default App
