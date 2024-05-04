Vue.component('create-card', {
    template: `
    <div>
        <div class="create-card">
            <h1>Добавить карточку:</h1>
            
            <label for="task-name">Название заметки</label>
            <input v-model="title" type="text">     
            
            <div class="tasks-list" v-for="task in tasks">   <!-- отоброжает поля задач  -->
                <div class="task">
                    <input :value="task.name" @input="event => task.name = event.target.value"/> <!-- :value = "task.name" передаёт значение name из массива tasks для каждого task; @input? для чего, что делает, как называется -->
                    <button @click="deleteTask(task.id)">Удалить</button> <!-- Удаляет задачу по id -->
                </div>
            </div>

            <div>
                <button @click="addCard">Добавить карточку в таблицу</button>
            </div>
        </div>
        <div class="colums">
                <div class="colum">
                <h3>Запланированные задачи</h3>
                    <div class="card" v-for="card in cards" v-if="card.column == 0">
                        <p>Название: {{card.title}}</p>
                        <div class="tasks-list" v-for="task in card.tasks">
                            <div class="task" @click="finishTask(card.id, task.id)">
                                <p :class="{'strike': task.done }">{{task.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="colum">
                <h3>Задачи в работе</h3>
                    <div class="card" v-for="card in cards" v-if="card.column == 1">
                        <p>Название: {{card.title}}</p>
                        <div class="tasks-list" v-for="task in card.tasks">
                            <div class="task" @click="finishTask(card.id, task.id)">
                                <p :class="{'strike': task.done }">{{task.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="colum">
                <h3>Тестирование</h3>
                    <div class="card" v-for="card in cards" v-if="card.column == 2">
                        <p>Название: {{card.title}}</p>
                        <p>Время: {{card.date}}</p>
                        <div class="tasks-list" v-for="task in card.tasks">
                            <div class="task" @click="finishTask(card.id, task.id)">
                                <p :class="{'strike': task.done }">{{task.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="colum">
                <h3>Выполненные задачи</h3>
                    <div class="card" v-for="card in cards" v-if="card.column == 2">
                        <p>Название: {{card.title}}</p>
                        <p>Время: {{card.date}}</p>
                        <div class="tasks-list" v-for="task in card.tasks">
                            <div class="task" @click="finishTask(card.id, task.id)">
                                <p :class="{'strike': task.done }">{{task.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
    `,

    data() {
        return {
            title: "",
            tasks: [
                { id: "0", name: "Task 0", done: false },
            ],
            cards: [],
        };
    },

    methods: {
        deleteTask(id) {
            if (this.tasks.length === 3) {     
                alert("Нельзя удалить задачу, в листе должно быть 3 задачи");
                return;
            }

            for (let i = 0; i < this.tasks.length; i++) { 
                if (this.tasks[i].id == id) {
                    this.tasks.splice(i, 1);
                }
            }
        },
        addTask() {
            if (this.tasks.length > 4) {
                alert("Нельзя добавить больше 5 задач в одну карточку");
                return;
            }

            this.tasks.push({
                id: this.tasks.length + 1,
                name: "Описание задачи",
                done: false
            });
        },
        addCard() {
            let cardItem = {
                id: this.cards.length + 1,
                title: this.title,
                tasks: this.tasks,
                column: 0
            };

            //считаем кол-во карт в первой колонке
            let firstColumnCards = 0;
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].column == 0) {
                    firstColumnCards++;
                }
            }

            if (firstColumnCards == 3) {
                alert("В первой колонке максимальное количество карточек");
                return;
            }

            this.cards.push(cardItem);

            // занулить данные формы
            this.title = "";
            this.tasks = [
                { id: "0", name: "Task 0", done: false },
                { id: "1", name: "Task 1", done: false },
                { id: "2", name: "Task 2", done: false },
            ];
        },
        finishTask(cardId, taskId) {
            // блокирование карт из 1 столбца при 5 картах во втором
            let firstColumnCards = 0;
            let secondColumnCards = 0;
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].column == 0) {
                    firstColumnCards++;
                }
                if (this.cards[i].column == 1) {
                    secondColumnCards++;
                }
            }

            let currentCard = this.cards.find(card => card.id == cardId); //ищем текущую карту

            //считаем кол-во выполненых задач в текущей карте
            let doneTasks = 0;
            let globalCurrentTask = {}; // строчка которую мы тыкнули
            for (let i = 0; i < currentCard.tasks.length; i++) {
                let currentTask = currentCard.tasks[i];
                if (currentTask.id == taskId) {
                    currentTask.done = true;
                    globalCurrentTask = currentTask;
                }
                if (currentCard.tasks[i].done) {
                    doneTasks++;
                }
            }

            let halfDoneTasks = doneTasks / currentCard.tasks.length;
            if (firstColumnCards == 3 && secondColumnCards == 5 &&
                currentCard.column == 0 && halfDoneTasks >= 0.5)
            {
                globalCurrentTask.done = false;
                alert("Освободите место во второй колонке");
                return;
            }

            // если задание выполнено на 100% то переносим в 3 столбец 
            if (currentCard.column == 1 && doneTasks == currentCard.tasks.length) {
                currentCard.column = 2;
                return;
            }

            // переносим карточку во второй столбец если кол-во выполненных заданий > 50%
            if (halfDoneTasks >= 0.5) {
                if (secondColumnCards == 5) {
                    globalCurrentTask.done = false;
                    alert("Максимальное количество карт во втором столбце");
                    return;
                }
                currentCard.column = 1;
                let date = new Date();
                let options = { weekday: 'long', year: 'numeric', month: 'long', 
                    day: 'numeric', hour: 'numeric', minute:'numeric', second: 'numeric'};
                currentCard.date = date.toLocaleDateString('ru', options)
            }
        }
    }
});

let app = new Vue({
    el: '#app',
});