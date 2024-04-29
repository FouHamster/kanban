Vue.component('kanban', {
    template: `
    <div>
        <h1>Kanban</h1>
        <div class="colums">
            <div class="colum">
                <h3>Запланированные задачи</h3>
                <createCard class="card"></createCard>
                <div class="card" v-for="card in cards" v-if="card.column == 0">
                        <p>Заголовок: {{card.title}}</p>
                        <p>Описание задачи: {{card.task}}</p>
<!--                        <div class="tasks-list" v-for="task in card.tasks">-->
<!--                            <div class="task" @click="finishTask(card.id, task.id)">-->
<!--                                <p :class="{'strike': task.done }">{{task.name}}</p>-->
<!--                            </div>-->
<!--                        </div>-->
                </div>
            </div>
            <div class="colum">
                <h3>Задачи в работе</h3>
            </div>
            <div class="colum">
                <h3>Тестирование</h3>
            </div>
            <div class="colum">
                <h3>Выполненные задачи</h3>
            </div>
        </div>
    </div>`,
    data() {
        return {

        }
    },
})

Vue.component('createCard', {
    template: `
    <div>
        <p>Заголовок:</p>
        <input v-model="title" type="text"/>
        <p>Описание задачи:</p>
        <input type="text"/>
<!--        <p>Дэдлайн:</p>-->
<!--        <p>Дата создания:</p>   -->
        <button @click="addCard">Добавить</button>~
    </div>`,
    data() {
        return {
            // title: "",
            // task: "",
        }
    },
})

let app = new Vue({
    el: '#app',
    data: {
        title: "",
        task: "",
        cards: [],
    },
    methods: {
        addCard(){
            let cardItem = {
                id: this.cards.length + 1,
                title: this.title,
                task: this.task,
                column: 0
            };
            this.cards.push(cardItem);
        },
    }
});
