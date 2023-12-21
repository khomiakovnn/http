export default class Ticket_view{
    constructor(){
        this.overlay = document.querySelector('.overlay');
        this.modal = document.querySelector('.modal');
        this.modalTitle = document.getElementById('modal_title');
        this.descriptionShort = document.getElementById('short_descr');
        this.descriptionLong = document.getElementById('long_descr');
        this.editWarn = document.getElementById('edit_warn');
        this.inputField = document.querySelector('.input_field');
        this.cancelButton = document.getElementById("cancel_button");
        this.okButton = document.getElementById("OK_button");
        this.cancelButton.addEventListener('click', () => this.hideContainer())
        this.addButton = document.getElementById('addTicket_button');
        this.addButton.addEventListener('click', () => this.create())
        this.ticketMarkup = '<input class="checkbox" type="checkbox"><div class="tiket_desription">Ticket description</div><div class="ticket_data">Ticket data</div><button class="edit_button">&#9998;</button><button class="delete_button">X</button>'
        this.serverUrl = 'http://localhost:8888';
        this.ticketsContainer = document.querySelector('.tickets_container');
        this.clickAdHandler = this.clickAdHandler.bind(this);
        this.clickDeleteHandler = this.clickDeleteHandler.bind(this);
        this.clickEditHandler = this.clickEditHandler.bind(this);
        this.ticketId = 0;
    }
    
    clickEditHandler() {
        var updatedData = {
            name: this.descriptionShort.value,
            description: this.descriptionLong.value,
        };
        fetch(`http://localhost:8888/?method=updateTicket&id=${this.ticketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(data => {
            this.okButton.removeEventListener('click', this.clickEditHandler);
            this.allTickets();
            this.hideContainer();
        })
        .catch(error => console.error(`Ошибка при обновлении тикета с id ${this.ticketId}:`, error));
    }

    edit() {
        this._makeContainer()
        this.modalTitle.textContent = 'Изменить тикет';
        this.inputField.style.display = 'flex';
        this.editWarn.style.display = 'none';
        this.okButton.addEventListener('click', this.clickEditHandler)
    }
    
    clickDeleteHandler() {
        fetch(`http://localhost:8888/?method=deleteTicket&id=${this.ticketId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                this.okButton.removeEventListener('click', this.clickDeleteHandler);
                this.allTickets();
                this.hideContainer();
            } else {
                console.error(`Ошибка при удалении тикета с id ${this.ticketId}`);
            }
        })
        .catch(error => console.error(`Ошибка при удалении тикета с id ${this.ticketId}:`, error));
    }

    delete() {
        this._makeContainer()
        this.modalTitle.textContent = 'Удалить тикет';
        this.inputField.style.display = 'none';
        this.editWarn.style.display = 'block';
        this.okButton.addEventListener('click', this.clickDeleteHandler)
    }
    
    clickAdHandler() {
        const newTicket = {
            name: this.descriptionShort.value,
            description: this.descriptionLong.value,
            status: false,
        }
        fetch('http://localhost:8888/?method=createTicket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTicket),
        })
        .then(response => response.json())
        .then(data => {
            this.okButton.removeEventListener('click', this.clickAdHandler);
            this.hideContainer();
            this.allTickets();
        })
        .catch(error => console.error('Ошибка при создании нового тикета:', error));
    }

    create() {
        this._makeContainer()
        this.modalTitle.textContent = 'Добавить тикет';
        this.inputField.style.display = 'flex';
        this.editWarn.style.display = 'none';
        this.okButton.addEventListener('click', this.clickAdHandler)
    }

    _makeContainer() {
        this.overlay.style.display = "block";
        this.modal.style.display = "block";  
    }

    hideContainer() {
        this.descriptionShort.value = '';
        this.descriptionLong.value = '';
        this.overlay.style.display = "none";
        this.modal.style.display = "none";

    }

    allTickets() {
        fetch(`${this.serverUrl}/?method=allTickets`)
            .then(response => response.json())
            .then(data => {
                this.ticketsContainer.innerHTML = ''
                for (let index = 0; index < data.length; index++) {
                    const ticket = document.createElement('div');
                    ticket.className = 'ticket_in_list';
                    ticket.id = data[index].id;
                    ticket.innerHTML = this.ticketMarkup;
                    this.ticketsContainer.appendChild(ticket);
                    ticket.addEventListener('click', (event) => {
                        const targetElement = event.target;
                        if (!targetElement.matches('.edit_button, .delete_button, .checkbox')) {
                            console.log('click')
                        }
                    })
                    const checkboxElement = ticket.querySelector('.checkbox');
                    const descriptionElement = ticket.querySelector('.tiket_desription');
                    const dataElement = ticket.querySelector('.ticket_data');
                    const editElement = ticket.querySelector('.edit_button');
                    const deleteElement = ticket.querySelector('.delete_button');                  
                    
                    checkboxElement.checked = data[index].status;
                    descriptionElement.textContent = data[index].name;
                    dataElement.textContent = this._convertDate(data[index].created);
                    
                    checkboxElement.addEventListener('click', () => {
                        this.ticketId = checkboxElement.parentNode.id;
                        var updatedData = {
                            status: checkboxElement.checked,
                        };
                        fetch(`http://localhost:8888/?method=updateTicket&id=${this.ticketId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedData),
                        })
                        .then(response => response.json())
                        .catch(error => console.error(`Ошибка при обновлении тикета с id ${this.ticketId}:`, error));                
                    });

                    editElement.addEventListener('click', () => {
                        this.ticketId = editElement.parentNode.id;
                        this.edit();
                    });
                    deleteElement.addEventListener('click', () => {
                        this.ticketId = deleteElement.parentNode.id;
                        this.delete();
                    });
                }
            })
            .catch(error => console.error('Ошибка при получении тикетов:', error));
    }

    _convertDate(timestamp) {
        var date = new Date(parseInt(timestamp));
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        var hours = ('0' + date.getHours()).slice(-2);
        var minutes = ('0' + date.getMinutes()).slice(-2);
        var formattedDate = day + ':' + month + ':' + year + ' ' + hours + ':' + minutes;
        return formattedDate
    }
}