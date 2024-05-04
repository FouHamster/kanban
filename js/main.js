Vue.component('kanban', {
    template: `
    <div>
        <h1>Kanban</h1>
        <div class="colums">
            <div class="colum">
                <h3>Запланированные задачи</h3>
                <createCard class="card" :addCard="addCard"></createCard>
                <div class="card" v-for="card in cards" v-if="card.column == 0">
                    <p>Заголовок: {{card.title}}</p>
                    <p>Описание задачи: {{card.task}}</p>
                    <p>Дата создаиния: {{card.createdDate.getFullYear()}}-{{card.createdDate.getMonth() + 1}}-{{card.createdDate.getDate()}}</p>
                    <p>Дедлайн: {{card.deadLine}}</p>
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
            cards: [],
        }
    },

    methods: {
        addCard(item){
            let cardItem = {
                column: 0,
                id: this.cards.length + 1,
                title: item.title,
                description: item.description,
                deadLine: item.deadLine,
                createdDate: new Date()
            };
            this.cards.push(cardItem);
        },
    }
})

Vue.component('createCard', {
    props: {
        addCard: {
            type:Function,
            required: true,
        }
    },

    template: `
    <div class="create-card">
        <p>Заголовок:</p>
        <input v-model="title" type="text" @input="event => title = event.target.value"/>
        <p>Описание задачи:</p>
        <input type="text" @input="event => description = event.target.value"/>
        <p>Дэдлайн:</p>
        <input type="date" @input="event => deadLine = event.target.value"/>
        <button @click="() => addCard({title, description, deadLine})">Добавить</button>
    </div>`,

    data() {
        return {
            title: "",
            description: "",
            deadLine: Date,
        }
    },
})

let app = new Vue({
    el: '#app',
    data: {
        cards: [],
    },
});
