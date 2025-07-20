const Reserva = require('../../src/models/Reserva');
const Cliente = require('../../src/models/Cliente');
const db = require('../../src/database/database');

describe('Reserva Model', () => {
    let clienteId;

    beforeEach(async () => {
        await new Promise((resolve) => {
            db.run('DELETE FROM reservas', resolve);
        });
        await new Promise((resolve) => {
            db.run('DELETE FROM clientes', resolve);
        });

        const cliente = await Cliente.create({
            nome: 'Cliente Teste',
            email: 'cliente.teste@email.com',
            telefone: '(11) 99999-9999'
        });
        clienteId = cliente.id;
    });

    afterAll(async () => {
        await new Promise((resolve) => {
            db.close(resolve);
        });
    });

    describe('create', () => {
        it('deve criar uma reserva com dados válidos', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:30',
                numero_pessoas: 4,
                observacoes: 'Mesa próxima à janela',
                status: 'ativa'
            };

            const reserva = await Reserva.create(reservaData);

            expect(reserva).toHaveProperty('id');
            expect(reserva.cliente_id).toBe(reservaData.cliente_id);
            expect(reserva.data_reserva).toBe(reservaData.data_reserva);
            expect(reserva.hora_reserva).toBe(reservaData.hora_reserva);
            expect(reserva.numero_pessoas).toBe(reservaData.numero_pessoas);
            expect(reserva.observacoes).toBe(reservaData.observacoes);
            expect(reserva.status).toBe(reservaData.status);
        });

        it('deve criar uma reserva sem observações', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '20:00',
                numero_pessoas: 2
            };

            const reserva = await Reserva.create(reservaData);

            expect(reserva).toHaveProperty('id');
            expect(reserva.cliente_id).toBe(reservaData.cliente_id);
            expect(reserva.data_reserva).toBe(reservaData.data_reserva);
            expect(reserva.hora_reserva).toBe(reservaData.hora_reserva);
            expect(reserva.numero_pessoas).toBe(reservaData.numero_pessoas);
        });

        it('deve criar uma reserva com status padrão "ativa"', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '18:00',
                numero_pessoas: 3
            };

            const reserva = await Reserva.create(reservaData);

            expect(reserva.status).toBe('ativa');
        });
    });

    describe('findAll', () => {
        it('deve retornar lista vazia quando não há reservas', async () => {
            const reservas = await Reserva.findAll();
            expect(reservas).toEqual([]);
        });

        it('deve retornar todas as reservas com dados do cliente', async () => {
            await Reserva.create({
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2
            });

            await Reserva.create({
                cliente_id: clienteId,
                data_reserva: '2025-12-26',
                hora_reserva: '20:00',
                numero_pessoas: 4
            });

            const reservas = await Reserva.findAll();
            expect(reservas).toHaveLength(2);
            expect(reservas[0]).toHaveProperty('cliente_nome');
            expect(reservas[0]).toHaveProperty('cliente_email');
            expect(reservas[0].cliente_nome).toBe('Cliente Teste');
        });
    });

    describe('findById', () => {
        it('deve retornar reserva por ID válido com dados do cliente', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:30',
                numero_pessoas: 4
            };

            const reservaCriada = await Reserva.create(reservaData);
            const reservaEncontrada = await Reserva.findById(reservaCriada.id);

            expect(reservaEncontrada).toBeTruthy();
            expect(reservaEncontrada.id).toBe(reservaCriada.id);
            expect(reservaEncontrada.cliente_id).toBe(reservaData.cliente_id);
            expect(reservaEncontrada.cliente_nome).toBe('Cliente Teste');
            expect(reservaEncontrada.cliente_email).toBe('cliente.teste@email.com');
        });

        it('deve retornar undefined para ID inexistente', async () => {
            const reserva = await Reserva.findById(999);
            expect(reserva).toBeUndefined();
        });
    });

    describe('findByClienteId', () => {
        it('deve retornar reservas do cliente específico', async () => {
            await Reserva.create({
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2
            });

            await Reserva.create({
                cliente_id: clienteId,
                data_reserva: '2025-12-26',
                hora_reserva: '20:00',
                numero_pessoas: 4
            });

            const reservas = await Reserva.findByClienteId(clienteId);
            expect(reservas).toHaveLength(2);
            expect(reservas[0].cliente_id).toBe(clienteId);
            expect(reservas[1].cliente_id).toBe(clienteId);
        });

        it('deve retornar lista vazia para cliente sem reservas', async () => {
            const reservas = await Reserva.findByClienteId(999);
            expect(reservas).toEqual([]);
        });
    });

    describe('findByStatus', () => {
        it('deve retornar reservas com status específico', async () => {
            await Reserva.create({
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2,
                status: 'ativa'
            });

            await Reserva.create({
                cliente_id: clienteId,
                data_reserva: '2025-12-26',
                hora_reserva: '20:00',
                numero_pessoas: 4,
                status: 'cancelada'
            });

            const reservasAtivas = await Reserva.findByStatus('ativa');
            const reservasCanceladas = await Reserva.findByStatus('cancelada');

            expect(reservasAtivas).toHaveLength(1);
            expect(reservasAtivas[0].status).toBe('ativa');
            expect(reservasCanceladas).toHaveLength(1);
            expect(reservasCanceladas[0].status).toBe('cancelada');
        });
    });

    describe('update', () => {
        it('deve atualizar reserva com dados válidos', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2
            };

            const reservaCriada = await Reserva.create(reservaData);

            const dadosAtualizados = {
                cliente_id: clienteId,
                data_reserva: '2025-12-26',
                hora_reserva: '20:00',
                numero_pessoas: 4,
                observacoes: 'Atualizado',
                status: 'concluida'
            };

            const resultado = await Reserva.update(reservaCriada.id, dadosAtualizados);

            expect(resultado.changes).toBe(1);
            expect(resultado.id).toBe(reservaCriada.id);

            const reservaAtualizada = await Reserva.findById(reservaCriada.id);
            expect(reservaAtualizada.data_reserva).toBe(dadosAtualizados.data_reserva);
            expect(reservaAtualizada.hora_reserva).toBe(dadosAtualizados.hora_reserva);
            expect(reservaAtualizada.numero_pessoas).toBe(dadosAtualizados.numero_pessoas);
            expect(reservaAtualizada.status).toBe(dadosAtualizados.status);
        });

        it('deve retornar changes 0 para ID inexistente', async () => {
            const resultado = await Reserva.update(999, {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2
            });

            expect(resultado.changes).toBe(0);
        });
    });

    describe('delete', () => {
        it('deve deletar reserva existente', async () => {
            const reservaData = {
                cliente_id: clienteId,
                data_reserva: '2025-12-25',
                hora_reserva: '19:00',
                numero_pessoas: 2
            };

            const reservaCriada = await Reserva.create(reservaData);
            const resultado = await Reserva.delete(reservaCriada.id);

            expect(resultado.changes).toBe(1);
            expect(resultado.id).toBe(reservaCriada.id);

            const reservaDeletada = await Reserva.findById(reservaCriada.id);
            expect(reservaDeletada).toBeUndefined();
        });

        it('deve retornar changes 0 para ID inexistente', async () => {
            const resultado = await Reserva.delete(999);
            expect(resultado.changes).toBe(0);
        });
    });
});

