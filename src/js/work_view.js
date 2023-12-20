export default class Work_view{
    constructor(){
        this.ticketMarkup = '<input class="checkbox" type="checkbox"><div class="tiket_desription">Ticket description</div><div class="ticket_data">Ticket data</div><button class="edit_button">&#9998;</button><button class="delete_button">X</button>'
        this.serverUrl = 'http://localhost:8888';
        this.ticketsContainer = document.querySelector('.tickets_container');
    }
    
    allTickets() {
        fetch(`${this.serverUrl}/?method=allTickets`)
            .then(response => response.json())
            .then(data => {
                for (let index = 0; index < data.length; index++) {
                    const ticket = document.createElement('div');
                    ticket.className = 'ticket_in_list';
                    ticket.innerHTML = this.ticketMarkup;
                    this.ticketsContainer.appendChild(ticket);
                    const checkboxElement = ticket.querySelector('.checkbox');
                    const descriptionElement = ticket.querySelector('.tiket_desription');
                    const dataElement = ticket.querySelector('.ticket_data');
                    const editElement = ticket.querySelector('.edit_button');
                    const deleteElement = ticket.querySelector('.delete_button');                  
                    
                    if (data[index].status) {
                        checkboxElement.checked = true;
                    }
                    
                    descriptionElement.textContent = data[index].name;
                    dataElement.textContent = this._convertDate(data[index].created);                   
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