const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const tickets = [];

tickets.push({
    id: 1,
    name: 'Ticket 1',
    status: false,
    created: Date.now(),
    description: 'Description for Ticket 1',
});
tickets.push({
    id: 2,
    name: 'Ticket 2',
    status: true,
    created: Date.now(),
    description: 'Description for Ticket 2',
});

app.use(cors());
app.use(bodyParser());

router.get('/', async (ctx) => {
    const { method, id } = ctx.request.query;

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets.map(({ id, name, status, created }) => ({ id, name, status, created }));
            break;
        case 'ticketById':
            const ticket = tickets.find((t) => t.id == id);
            if (ticket) {
                ctx.response.body = ticket;
            } else {
                ctx.response.status = 404;
            }
            break;
        default:
            ctx.response.status = 404;
            break;
    }
});

router.post('/', async (ctx) => {
    const { method } = ctx.request.query;
    const { name, description, status } = ctx.request.body;

    switch (method) {
        case 'createTicket':
            const newTicket = {
                id: tickets.length + 1,
                name,
                description,
                status,
                created: Date.now(),
            };
            tickets.push(newTicket);
            ctx.response.body = newTicket;
            break;
        default:
            ctx.response.status = 404;
            break;
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8888, () => {
    console.log(`Server is running on port 8888`);
});
