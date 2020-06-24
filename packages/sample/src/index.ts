import Varys, { AttributeDecoder, AttributeEncoder, FactDTO, HttpListener, NamespaceDTO } from '@varys/api-sdk';
import assert from 'assert';
import express from 'express';

interface TestEntity {
    name: string;
    age: number;
}

enum TestFactType {
    NAME = 'name',
    AGE = 'age'
}

const BLACKBOARD = 'test';

const REFERENCE = 'abc123';

const SOURCE = 'sample-app';

const PORT = 4000;

const API_TOKEN = process.env['API_TOKEN'];
assert(API_TOKEN, 'Missing environment variable API_TOKEN');

const varys = Varys.init({
    apiUrl: 'http://localhost:3000',
    apiToken: API_TOKEN,
    listenerType: 'sns'
});

const blackboardClient = varys.blackboard(BLACKBOARD);

const entityClient = varys.entity<TestEntity>(BLACKBOARD, {

    asFacts(reference: string, entity: TestEntity, source: string, discoveryDate: Date): FactDTO[] {

        const encoder = new AttributeEncoder(source, discoveryDate);

        return [
            encoder.high(TestFactType.NAME, entity.name),
            encoder.low(TestFactType.AGE, entity.age)
        ];
    },

    fromNamespace(namespace: NamespaceDTO): TestEntity {

        const decoder = new AttributeDecoder(namespace);

        return {
            name: decoder.string(TestFactType.NAME, ''),
            age: decoder.number(TestFactType.AGE, 0)
        };
    }
});

let subscription: HttpListener | null = null;

async function sendFact() {

    console.info('pre', await entityClient.find(REFERENCE));

    const entity: TestEntity = {
        name: `Danilo (${Math.round(Math.random() * 10)})`,
        age: 24 + Math.round(Math.random() * 10 - 5)
    };

    console.info('entity', entity);

    await entityClient.save(REFERENCE, entity, SOURCE, new Date());

    console.info('post', await entityClient.find(REFERENCE));
}

async function subscribe(endpoint: string) {

    await blackboardClient.createBlackboard();

    subscription = await varys.listener().toAll({
        blackboard: BLACKBOARD,
        endpoint,
        async handler(fact: FactDTO) {
            console.info(fact);
        }
    });
}

const app = express();

app.use(express.json());
app.use(express.text());

app.get('/', (req, res) => {
    console.info('GET /');

    sendFact()
        .then(() => res.send());
});

app.get('/subscribe', (req, res) => {
    console.info('GET /listen');

    subscribe(`https://0625e4f89c5e.ngrok.io/listen`)
        .then(() => res.send());
});

app.post('/listen', (req, res) => {
    console.info('POST /listen');

    subscription!.handle(req.body, req.headers)
        .then(({ status, result }) => res.status(status).send(result));
});

app.listen(PORT, () => 'Listening');
