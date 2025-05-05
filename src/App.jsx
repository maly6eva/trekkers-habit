import './App.css'
import {Habits} from "./component/Habits.jsx";
import React, {useState, useEffect} from "react";

const getNext7Days = (offset = 0) => {
    const days = []
    const now = new Date()
    now.setDate(now.getDate() + offset * 7)

    for (let i = 0; i < 7; i++) {
        const date = new Date(now)
        date.setDate(now.getDate() + i)

        const weekday = date.toLocaleDateString('ru-Ru', {weekday: 'short'})
        const dayHum = date.getDate()
        const month = date.toLocaleDateString('ru-Ru', {month: 'short'})

        days.push({
            key: `${weekday} ${dayHum} ${month}`,
            label: `${weekday} ${dayHum} ${month}`
        })
    }
    return days
}

function App() {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('tasks')
        return saved ? JSON.parse(saved) : []
    })

    const [weekOffset, setWeekOffset] = useState(0)
    const days = getNext7Days(weekOffset)

    const [day, setDay] = useState('')

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    function addTask(task) {
        const newTask = {
            ...task,
            days: {}
        }
        setTasks((prevTasks) => [newTask, ...prevTasks])
    }

    function toggleCheckbox(taskId, dayKey) {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        days: {
                            ...task.days,
                            [dayKey]: !task.days?.[dayKey]
                        }
                    }
                    : task))
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
                                <div className="habits" value={day} onChange={(e) => setDay(e.target.value)}>
                                    {days.map((d, index) => (
                                        <label key={index}>

                                            <input type='checkbox'
                                                   checked={t.days?.[d.key] || false}
                                                   onChange={() => toggleCheckbox(t.id, d.key)}/>
                                            {d.label}
                                        </label>
                                    ))}

                                </div>
                                <div className='button'>
                                    <button onClick={() => removeTask(t.id)}>❌</button>
                                    <button onClick={() => setWeekOffset((prev) => prev - 1)}>{`<7дн`}</button>
                                    <button onClick={() => setWeekOffset((prev) => prev + 1)}>{`7дн>`}</button>
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
