import React, {useState} from 'react';





export const Habits = ({addTask, day, setDay}) => {

    const [habits, setHabits] = useState('')


    function getHabits(e) {
        e.preventDefault()
        if(!habits.trim()) return

        const habit = {
            id: Date.now(),
            habits,
            day,
            com: false
        }
        addTask(habit)
        setHabits('')
        setDay('')

    }

    return (
        <form onSubmit={getHabits}>
            <div>
                <input type="text" placeholder="Добавить привычку  🔍"  value={habits} onChange={(e) =>  setHabits(e.target.value)}/>
                <button>Добавть привычку!</button>
            </div>
        </form>
    );
};

