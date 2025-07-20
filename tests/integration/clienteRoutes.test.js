const request = require('supertest');
const app = require('../../app');
const db = require('../../src/database/database');

describe('Cliente Routes Integration Tests', () => {
    beforeEach(async () => {
        await new Promise((resolve) => {
            db.run('DELETE FROM clientes', resolve);
        });
    });

    afterAll(async () => {
        await new Promise((resolve) => {
            db.close(resolve);
        });
    });

    describe('POST /api/clientes', () => {
        it('deve criar um cliente com dados válidos', async () => {
            const clienteData = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '(11) 99999-9999',
                endereco: 'Rua A, 123'
            };

            const response = await request(app)
                .post('/api/clientes')
                .send(clienteData)
                .expect(201);

            expect(response.body.message).toBe('Cliente criado com sucesso');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.nome).toBe(clienteData.nome);
            expect(response.body.data.email).toBe(clienteData.email);
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            const clienteData = {
                nome: '',
                email: 'email-invalido',
                telefone: ''
            };

            const response = await request(app)
                .post('/api/clientes')
                .send(clienteData)
                .expect(400);

            expect(response.body.error).toBe('Nome, email e telefone são obrigatórios');
        });

        it('deve retornar erro 400 para email inválido', async () => {
            const clienteData = {
                nome: 'João Silva',
                email: 'email-invalido',
                telefone: '(11) 99999-9999'
            };

            const response = await request(app)
                .post('/api/clientes')
                .send(clienteData)
                .expect(400);

            expect(response.body.error).toBe('Email inválido');
        });

        it('deve retornar erro 400 para email duplicado', async () => {
            const clienteData = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '(11) 99999-9999'
            };

            await request(app)
                .post('/api/clientes')
                .send(clienteData)
                .expect(201);

            const response = await request(app)
                .post('/api/clientes')
                .send({
                    nome: 'Maria Silva',
                    email: 'joao@email.com',
                    telefone: '(11) 88888-8888'
                })
                .expect(400);

            expect(response.body.error).toBe('Email já cadastrado');
        });
    });

    describe('GET /api/clientes', () => {
        it('deve retornar lista vazia quando não há clientes', async () => {
            const response = await request(app)
                .get('/api/clientes')
                .expect(200);

            expect(response.body.message).toBe('Clientes encontrados');
            expect(response.body.data).toEqual([]);
        });

        it('deve retornar todos os clientes cadastrados', async () => {
            const cliente1 = {
                nome: 'Cliente 1',
                email: 'cliente1@email.com',
                telefone: '(11) 11111-1111'
            };

            const cliente2 = {
                nome: 'Cliente 2',
                email: 'cliente2@email.com',
                telefone: '(11) 22222-2222'
            };

            await request(app).post('/api/clientes').send(cliente1);
            await request(app).post('/api/clientes').send(cliente2);

            const response = await request(app)
                .get('/api/clientes')
                .expect(200);

            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].nome).toBe('Cliente 2');
            expect(response.body.data[1].nome).toBe('Cliente 1');
        });
    });

    describe('GET /api/clientes/:id', () => {
        it('deve retornar cliente por ID válido', async () => {
            const clienteData = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '(11) 99999-9999'
            };

            const createResponse = await request(app)
                .post('/api/clientes')
                .send(clienteData);

            const clienteId = createResponse.body.data.id;

            const response = await request(app)
                .get(`/api/clientes/${clienteId}`)
                .expect(200);

            expect(response.body.message).toBe('Cliente encontrado');
            expect(response.body.data.id).toBe(clienteId);
            expect(response.body.data.nome).toBe(clienteData.nome);
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app)
                .get('/api/clientes/abc')
                .expect(400);

            expect(response.body.error).toBe('ID inválido');
        });

        it('deve retornar erro 404 para ID inexistente', async () => {
            const response = await request(app)
                .get('/api/clientes/999')
                .expect(404);

            expect(response.body.error).toBe('Cliente não encontrado');
        });
    });

    describe('PUT /api/clientes/:id', () => {
        it('deve atualizar cliente com dados válidos', async () => {
            const clienteData = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '(11) 99999-9999'
            };

            const createResponse = await request(app)
                .post('/api/clientes')
                .send(clienteData);

            const clienteId = createResponse.body.data.id;

            const dadosAtualizados = {
                nome: 'João Santos',
                email: 'joao.santos@email.com',
                telefone: '(11) 88888-8888',
                endereco: 'Nova Rua, 456'
            };

            const response = await request(app)
                .put(`/api/clientes/${clienteId}`)
                .send(dadosAtualizados)
                .expect(200);

            expect(response.body.message).toBe('Cliente atualizado com sucesso');
            expect(response.body.data.nome).toBe(dadosAtualizados.nome);
            expect(response.body.data.email).toBe(dadosAtualizados.email);
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app)
                .put('/api/clientes/abc')
                .send({
                    nome: 'Teste',
                    email: 'teste@email.com',
                    telefone: '(11) 99999-9999'
                })
                .expect(400);

            expect(response.body.error).toBe('ID inválido');
        });

        it('deve retornar erro 404 para ID inexistente', async () => {
            const response = await request(app)
                .put('/api/clientes/999')
                .send({
                    nome: 'Teste',
                    email: 'teste@email.com',
                    telefone: '(11) 99999-9999'
                })
                .expect(404);

            expect(response.body.error).toBe('Cliente não encontrado');
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            const clienteData = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '(11) 99999-9999'
            };

            const createResponse = await request(app)
                .post('/api/clientes')
                .send(clienteData);

            const clienteId = createResponse.body.data.id;

            const response = await request(app)
                .put(`/api/clientes/${clienteId}`)
                .send({
                    nome: '',
                    email: 'email-invalido',
                    telefone: ''
                })
                .expect(400);

            expect(response.body.error).toBe('Nome, email e telefone são obrigatórios');
        });
    });

    describe('DELETE /api/clientes/:id', () => {
        it('deve deletar cliente existente', async () => {
            const clienteData = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '(11) 99999-9999'
            };

            const createResponse = await request(app)
                .post('/api/clientes')
                .send(clienteData);

            const clienteId = createResponse.body.data.id;

            const response = await request(app)
                .delete(`/api/clientes/${clienteId}`)
                .expect(200);

            expect(response.body.message).toBe('Cliente deletado com sucesso');

            await request(app)
                .get(`/api/clientes/${clienteId}`)
                .expect(404);
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app)
                .delete('/api/clientes/abc')
                .expect(400);

            expect(response.body.error).toBe('ID inválido');
        });

        it('deve retornar erro 404 para ID inexistente', async () => {
            const response = await request(app)
                .delete('/api/clientes/999')
                .expect(404);

            expect(response.body.error).toBe('Cliente não encontrado');
        });
    });
});

