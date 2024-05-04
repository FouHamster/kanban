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
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].id == id) {
                    this.cards.splice(i, 1);
                }
            }
        },
        editCard(
            id,
            title,
            description,
            deadLine,
            editTime
        ) {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].id == id) {
                    this.cards[i].title = title;
                    this.cards[i].description = description;
                    this.cards[i].deadLine = deadLine;
                    this.cards[i].editTime = editTime;
                }
            }
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
        <div  v-if="!isEdit">
            <p>Заголовок: {{card.title}}</p>
            <p>Описание задачи: {{card.description}}</p>
            <p>Дата создаиния: {{card.createdDate.getFullYear()}}-{{card.createdDate.getMonth() + 1}}-{{card.createdDate.getDate()}}</p>
            <p>Дедлайн: {{card.deadLine}}</p>
            <p  v-if="card.editTime">Дата Редактирования: {{card.editTime.getFullYear()}}-{{card.editTime.getMonth() + 1}}-{{card.editTime.getDate()}}</p>
            <div class="card-actions">
                <button @click="editCurrentCard">Редактировать</button>
                <button @click="() => deleteCard(card.id)">Удалить</button>
            </div>
        </div>
        <div  v-if="isEdit">
            <h2>Edit mode</h2>
            <p>Заголовок:</p>
            <input :value="title" type="text" @input="event => title = event.target.value"/>
            <p>Описание задачи:</p>
            <input :value="description" type="text" @input="event => description = event.target.value"/>
            <p>Дэдлайн:</p>
            <input :value="deadLine" type="date" @input="event => deadLine = event.target.value"/>
            <button @click="saveEdit">Save</button>
        </div>
    </div>
    `,

    data() {
        return {
            isEdit: false,
            title: this.card.title,
            description: this.card.description,
            deadLine: this.card.deadLine,
        }
    },

    methods: {
        editCurrentCard() {
            this.isEdit = true;
        },
        saveEdit() {
            this.isEdit = false;
            let editTime = new Date();

            this.editCard(
                this.card.id,
                this.title,
                this.description,
                this.deadLine,
                editTime
            );
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        cards: [],
    },
});
