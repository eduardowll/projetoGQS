const request = require('supertest');
const app = require('../../app');
const db = require('../../src/database/database');

describe('Reserva Routes Integration Tests', () => {
    let clienteId;

    beforeEach(async () => {
        await new Promise((resolve) => {
            db.run('DELETE FROM reservas', resolve);
        });
        await new Promise((resolve) => {
            db.run('DELETE FROM clientes', resolve);
        });

        const clienteResponse = await request(app)
            .post('/api/clientes')
            .send({
                nome: 'Cliente Teste',
                email: 'cliente.teste@email.com',
                telefone: '(11) 99999-9999'
            });

        clienteId = clienteResponse.body.data.id;
    });

    afterAll(async () => {
        await new Promise((resolve) => {
            db.close(resolve);
        });
    });

    describe('POST /api/reservas', () => {
        it('deve criar uma reserva com dados válidos', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:30',
                numero_pessoas: 4,
                observacoes: 'Mesa próxima à janela',
                status: 'ativa'
            };

            const response = await request(app)
                .post('/api/reservas')
                .send(reservaData)
                .expect(201);

            expect(response.body.message).toBe('Reserva criada com sucesso');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.cliente_id).toBe(reservaData.cliente_id);
            expect(response.body.data.data_reserva).toBe(reservaData.data_reserva);
            expect(response.body.data.hora_reserva).toBe(reservaData.hora_reserva);
        });

        it('deve retornar erro 400 para dados obrigatórios ausentes', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '',
                hora_reserva: '',
                numero_pessoas: null
            };

            const response = await request(app)
                .post('/api/reservas')
                .send(reservaData)
                .expect(400);

            expect(response.body.error).toBe('Cliente, data, hora e número de pessoas são obrigatórios');
        });

        it('deve retornar erro 400 para cliente inexistente', async () => {
            const reservaData = {
                cliente_id: 999,
                data_reserva: '2025-12-25',
                hora_reserva: '19:30',
                numero_pessoas: 4
            };

            const response = await request(app)
                .post('/api/reservas')
                .send(reservaData)
                .expect(400);

            expect(response.body.error).toBe('Cliente não encontrado');
        });

        it('deve retornar erro 400 para data no passado', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2020-01-01',
                hora_reserva: '19:30',
                numero_pessoas: 4
            };

            const response = await request(app)
                .post('/api/reservas')
                .send(reservaData)
                .expect(400);

            expect(response.body.error).toBe('Data da reserva não pode ser no passado');
        });

        it('deve retornar erro 400 para formato de data inválido', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '25/12/2025',
                hora_reserva: '19:30',
                numero_pessoas: 4
            };

            const response = await request(app)
                .post('/api/reservas')
                .send(reservaData)
                .expect(400);

            expect(response.body.error).toBe('Data deve estar no formato YYYY-MM-DD');
        });

        it('deve retornar erro 400 para formato de hora inválido', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '7:30 PM',
                numero_pessoas: 4
            };

            const response = await request(app)
                .post('/api/reservas')
                .send(reservaData)
                .expect(400);

            expect(response.body.error).toBe('Hora deve estar no formato HH:MM');
        });

        it('deve retornar erro 400 para número de pessoas inválido', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:30',
                numero_pessoas: 0
            };

            const response = await request(app)
                .post('/api/reservas')
                .send(reservaData)
                .expect(400);

            expect(response.body.error).toBe('Número de pessoas deve ser maior que zero');
        });
    });

    describe('GET /api/reservas', () => {
        it('deve retornar lista vazia quando não há reservas', async () => {
            const response = await request(app)
                .get('/api/reservas')
                .expect(200);

            expect(response.body.message).toBe('Reservas encontradas');
            expect(response.body.data).toEqual([]);
        });

        it('deve retornar todas as reservas com dados do cliente', async () => {
            const reserva1 = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2
            };

            const reserva2 = {
                cliente_id: clienteId,
                data_reserva: '2025-12-26',
                hora_reserva: '20:00',
                numero_pessoas: 4
            };

            await request(app).post('/api/reservas').send(reserva1);
            await request(app).post('/api/reservas').send(reserva2);

            const response = await request(app)
                .get('/api/reservas')
                .expect(200);

            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toHaveProperty('cliente_nome');
            expect(response.body.data[0]).toHaveProperty('cliente_email');
            expect(response.body.data[0].cliente_nome).toBe('Cliente Teste');
        });
    });

    describe('GET /api/reservas/:id', () => {
        it('deve retornar reserva por ID válido', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:30',
                numero_pessoas: 4
            };

            const createResponse = await request(app)
                .post('/api/reservas')
                .send(reservaData);

            const reservaId = createResponse.body.data.id;

            const response = await request(app)
                .get(`/api/reservas/${reservaId}`)
                .expect(200);

            expect(response.body.message).toBe('Reserva encontrada');
            expect(response.body.data.id).toBe(reservaId);
            expect(response.body.data.cliente_id).toBe(reservaData.cliente_id);
            expect(response.body.data.cliente_nome).toBe('Cliente Teste');
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app)
                .get('/api/reservas/abc')
                .expect(400);

            expect(response.body.error).toBe('ID inválido');
        });

        it('deve retornar erro 404 para ID inexistente', async () => {
            const response = await request(app)
                .get('/api/reservas/999')
                .expect(404);

            expect(response.body.error).toBe('Reserva não encontrada');
        });
    });

    describe('PUT /api/reservas/:id', () => {
        it('deve atualizar reserva com dados válidos', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2
            };

            const createResponse = await request(app)
                .post('/api/reservas')
                .send(reservaData);

            const reservaId = createResponse.body.data.id;

            const dadosAtualizados = {
                cliente_id: clienteId,
                data_reserva: '2025-12-26',
                hora_reserva: '20:00',
                numero_pessoas: 4,
                observacoes: 'Atualizado',
                status: 'concluida'
            };

            const response = await request(app)
                .put(`/api/reservas/${reservaId}`)
                .send(dadosAtualizados)
                .expect(200);

            expect(response.body.message).toBe('Reserva atualizada com sucesso');
            expect(response.body.data.data_reserva).toBe(dadosAtualizados.data_reserva);
            expect(response.body.data.hora_reserva).toBe(dadosAtualizados.hora_reserva);
            expect(response.body.data.numero_pessoas).toBe(dadosAtualizados.numero_pessoas);
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app)
                .put('/api/reservas/abc')
                .send({
                    cliente_id: clienteId,
                    data_reserva: '2025-12-25',
                    hora_reserva: '19:00',
                    numero_pessoas: 2
                })
                .expect(400);

            expect(response.body.error).toBe('ID inválido');
        });

        it('deve retornar erro 404 para ID inexistente', async () => {
            const response = await request(app)
                .put('/api/reservas/999')
                .send({
                    cliente_id: clienteId,
                    data_reserva: '2025-12-25',
                    hora_reserva: '19:00',
                    numero_pessoas: 2
                })
                .expect(404);

            expect(response.body.error).toBe('Reserva não encontrada');
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2
            };

            const createResponse = await request(app)
                .post('/api/reservas')
                .send(reservaData);

            const reservaId = createResponse.body.data.id;

            const response = await request(app)
                .put(`/api/reservas/${reservaId}`)
                .send({
                    cliente_id: '',
                    data_reserva: '',
                    hora_reserva: '',
                    numero_pessoas: null
                })
                .expect(400);

            expect(response.body.error).toBe('Cliente, data, hora e número de pessoas são obrigatórios');
        });
    });

    describe('DELETE /api/reservas/:id', () => {
        it('deve deletar reserva existente', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2
            };

            const createResponse = await request(app)
                .post('/api/reservas')
                .send(reservaData);

            const reservaId = createResponse.body.data.id;

            const response = await request(app)
                .delete(`/api/reservas/${reservaId}`)
                .expect(200);

            expect(response.body.message).toBe('Reserva deletada com sucesso');

            await request(app)
                .get(`/api/reservas/${reservaId}`)
                .expect(404);
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app)
                .delete('/api/reservas/abc')
                .expect(400);

            expect(response.body.error).toBe('ID inválido');
        });

        it('deve retornar erro 404 para ID inexistente', async () => {
            const response = await request(app)
                .delete('/api/reservas/999')
                .expect(404);

            expect(response.body.error).toBe('Reserva não encontrada');
        });
    });
});

