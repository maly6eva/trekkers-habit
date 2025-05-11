import './App.css'
import {Habits} from "./component/Habits.jsx";
import React, {useState, useEffect, useRef, useReducer} from "react";

const getNext7Days = (offset = 0) => {
    const days = []
    const now = new Date()
    now.setDate(now.getDate() + offset * 7)

    for (let i = 0; i < 7; i++) {
        const date = new Date(now)
        date.setDate(now.getDate() + i)

        if (isNaN(date)) continue

        const dayISO = date.toISOString().split('T')[0]
        const weekday = date.toLocaleDateString('ru-Ru', {weekday: 'short'})
        const dayHum = date.getDate()
        const month = date.toLocaleDateString('ru-Ru', {month: 'short'})

        days.push({
            key: dayISO,
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


    const [day, setDay] = useState('')

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    const weekOffsets = useRef({})

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    function addTask(task) {
        const id = crypto.randomUUID()

        const newTask = {
            ...task,
            id,
            days: {},
        }
        setTasks((prevTasks) => [newTask, ...prevTasks])
        weekOffsets.current[id] = 0
    }

    function toggleCheckbox(taskId, dayKey) {
        setTasks((prev) =>
            prev.map((task) => {
                if (task.id !== taskId) return task


                const offset = weekOffsets.current[taskId] || 0
                const currentWeek = task.days?.[offset] || {}

                return {
                    ...task,
                    days: {
                        ...task.days,
                        [offset]: {
                            ...currentWeek,
                            [dayKey]: !currentWeek[dayKey]
                        }

                    }
                }
            })
        )
    }

    function removeTask(id) {
        setTasks((del) => del.filter(task => task.id !== id))
        delete weekOffsets.current[id]
    }

    function shiftWeek(taskId, direction) {
        weekOffsets.current[taskId] = (weekOffsets.current[taskId] || 0) + direction
        forceUpdate()
    }

    return (
        <>
            <h1>🧘 Трекер привычек</h1>
            <Habits addTask={addTask} day={day} setDay={setDay}/>

            <ul>
                {tasks.map((t) => {
                    const offset = weekOffsets.current[t.id] || 0
                    const days = getNext7Days(offset)
                    return (
                        <li className='day' key={t.id}>
                            <div className='task'>
                                <p>{t.habits}</p>

                                <div className="habits">
                                    {days.map((d) => (
                                        <label key={d.key}>

                                            <input type='checkbox'
                                                   checked={t.days?.[offset]?.[d.key] || false}
                                                   onChange={() => toggleCheckbox(t.id, d.key)}/>
                                            {d.label}
                                        </label>
                                    ))}

                                </div>
                                <div className='button'>
                                    <button onClick={() => removeTask(t.id)}>❌</button>
                                    <button onClick={() => shiftWeek(t.id, -1)}>{`<7дн`}</button>
                                    <button onClick={() => shiftWeek(t.id, 1)}>{`7дн>`}</button>
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
