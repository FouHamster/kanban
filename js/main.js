Vue.component('kanban', {
    template: `
    <div>
        <h1>Kanban</h1>
        <div class="colums">
            <div class="colum">
                <h3>Запланированные задачи</h3>
                <createCard class="card" :addCard="addCard"></createCard>
                <card class="card" :key="card.id" v-for="card in cards" 
                    v-if="card.status == 0" :card="card" 
                    :deleteCard="deleteCard" :editCard="editCard" 
                    :back="back" :forword="forword"></card>
            </div>  
            <div class="colum">
                <h3>Задачи в работе</h3>
                <card class="card" :key="card.id" v-for="card in cards" 
                    v-if="card.status == 1" :card="card" 
                    :deleteCard="deleteCard" :editCard="editCard" 
                    :back="back" :forword="forword"></card>
            </div>
            <div class="colum">
                <h3>Тестирование</h3>
                <card class="card" :key="card.id" v-for="card in cards" 
                    v-if="card.status == 2" :card="card" 
                    :deleteCard="deleteCard" :editCard="editCard" 
                    :back="back" :forword="forword"></card>
            </div>
            <div class="colum">
                <h3>Выполненные задачи</h3>
                <card class="card" :key="card.id" v-for="card in cards" 
                    v-if="card.status == 3" :card="card" 
                    :deleteCard="deleteCard" :editCard="editCard" 
                    :back="back" :forword="forword"></card>
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
                createdDate: new Date(),
                isFinishInTime: false
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
        back(id, backDescription) {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].id == id) {
                    let currentCard = this.cards[i];
                    // если карта во втором столбце переносим ее в 1
                    if (currentCard.status == 2)
                    {
                        currentCard.status -= 1;
                        currentCard.backDescription = backDescription;
                    }
                }
            }
        },
        forword(id) {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].id == id) {
                    let currentCard = this.cards[i];
                    // переносим карту в следующий столбец

                    if (currentCard.status < 3)
                        currentCard.status += 1;

                    if (currentCard.status == 3) {
                        let deadLineDate = new Date(currentCard.deadLine);
                        let dYear = deadLineDate.getFullYear();
                        let dMonth = deadLineDate.getMonth();
                        let dDay = deadLineDate.getDate();

                        let currentTime = new Date();
                        let cYear = currentTime.getFullYear();
                        let cMonth = currentTime.getMonth();
                        let cDay = currentTime.getDate();

                        if (dYear < cYear || dMonth < cMonth || dDay < cDay) {
                            currentCard.isFinishInTime = false;
                        } else {
                            currentCard.isFinishInTime = true;
                        }
                    }
                }
            }
        }
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
        back: {
            type: Function,
            required:true,
        },
        forword: {
            type: Function,
            required:true,
        }
    },

    template: `
    <div>
        <div v-if="!isEdit && !isBack">
            <p>Заголовок: {{card.title}}</p>
            <p>Описание задачи: {{card.description}}</p>
            <p>Дата создаиния: {{card.createdDate.getFullYear()}}-{{card.createdDate.getMonth() + 1}}-{{card.createdDate.getDate()}}</p>
            <p>Дедлайн: {{card.deadLine}}</p>
            <p v-if="card.backDescription">Причина возврата: {{card.backDescription}}</p>
            <p  v-if="card.editTime">Дата Редактирования: {{card.editTime.getFullYear()}}-{{card.editTime.getMonth() + 1}}-{{card.editTime.getDate()}}</p>
            <div class="card-actions" v-if="!(card.status == 3)">
                <button v-if="card.status == 2" @click="backActionOpen">Назад</button>
                <button  @click="() => forword(card.id)">Вперед</button>
            </div>
            <div class="card-actions" v-if="!(card.status == 3)">
                <button @click="editCurrentCard">Редактировать</button>
                <button v-if="card.status == 0" @click="() => deleteCard(card.id)">Удалить</button>
            </div>
            <h2 class="good" v-if="card.isFinishInTime">Выполнено в срок</h2>
            <h2 class="bad" v-if="!card.isFinishInTime && card.status == 3">Выполнено не в срок</h2>
        </div>
        <div v-if="isEdit">
            <h2>Edit mode</h2>
            <p>Заголовок:</p>
            <input :value="title" type="text" @input="event => title = event.target.value"/>
            <p>Описание задачи:</p>
            <input :value="description" type="text" @input="event => description = event.target.value"/>
            <p>Дэдлайн:</p>
            <input :value="deadLine" type="date" @input="event => deadLine = event.target.value"/>
            <button @click="saveEdit">Save</button>
        </div>
        <div v-if="isBack">
            <h2>Возврат</h2>
            <p>Укажите причину возврата:</p>
            <input type="text" @input="event => backDescription = event.target.value"/>
            <button @click="backActionClose">Вернуть</button>
        </div>
    </div>
    `,

    data() {
        return {
            isEdit: false,
            title: this.card.title,
            description: this.card.description,
            deadLine: this.card.deadLine,
            isBack: false,
            backDescription: "",
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
        },
        backActionOpen() {
            this.isBack = true;
        },
        backActionClose() {
            this.back(this.card.id, this.backDescription);
            this.isBack = false;
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        cards: [],
    },
});
