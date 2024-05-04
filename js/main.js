Vue.component('kanban', {
    template: `
    <div>
        <h1>Kanban</h1>
        <div class="colums">
            <div class="colum">
                <h3>Запланированные задачи</h3>
                <createCard class="card" :addCard="addCard"></createCard>
                <card class="card" :key="card.id" v-for="card in cards" v-if="card.status == 0" 
                    :card="card" :deleteCard="deleteCard" :editCard="editCard"></card>
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
                status: 0,
                id: this.cards.length + 1,
                title: item.title,
                description: item.description,
                deadLine: item.deadLine,
                createdDate: new Date()
            };
            this.cards.push(cardItem);
        },
        deleteCard(id) {
            console.log(id);
            console.log(this.cards);
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].id == id) {
                    this.cards.splice(i, 1);
                }
            }
        },
        editCard() {
            alert("editCard");
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

Vue.component('card', {
    props: {
        card: {
            type:Object,
            required: true,
        },
        deleteCard: {
            type: Function,
            required:true,
        },
        editCard: {
            type: Function,
            required:true,
        },
    },

    template: `
    <div>
        <p>Заголовок: {{card.title}}</p>
        <p>Описание задачи: {{card.description}}</p>
        <p>Дата создаиния: {{card.createdDate.getFullYear()}}-{{card.createdDate.getMonth() + 1}}-{{card.createdDate.getDate()}}</p>
        <p>Дедлайн: {{card.deadLine}}</p>
        <div class="card-actions">
            <button @click="() => editCard()">Редактировать</button>
            <button @click="() => deleteCard(card.id)">Удалить</button>
        </div>
    </div>
    `,

    data() {
        return {

        }
    },

    methods: {

    }
})

let app = new Vue({
    el: '#app',
    data: {
        cards: [],
    },
});
