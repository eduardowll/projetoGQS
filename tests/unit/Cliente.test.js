const Cliente = require('../../src/models/Cliente');
const db = require('../../src/database/database');

describe('Cliente Model', () => {
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

    describe('create', () => {
        it('deve criar um cliente com dados válidos', async () => {
            const clienteData = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '(11) 99999-9999',
                endereco: 'Rua A, 123'
            };

            const cliente = await Cliente.create(clienteData);

            expect(cliente).toHaveProperty('id');
            expect(cliente.nome).toBe(clienteData.nome);
            expect(cliente.email).toBe(clienteData.email);
            expect(cliente.telefone).toBe(clienteData.telefone);
            expect(cliente.endereco).toBe(clienteData.endereco);
        });

        it('deve criar um cliente sem endereço', async () => {
            const clienteData = {
                nome: 'Maria Santos',
                email: 'maria@email.com',
                telefone: '(11) 88888-8888'
            };

            const cliente = await Cliente.create(clienteData);

            expect(cliente).toHaveProperty('id');
            expect(cliente.nome).toBe(clienteData.nome);
            expect(cliente.email).toBe(clienteData.email);
            expect(cliente.telefone).toBe(clienteData.telefone);
        });
    });

    describe('findAll', () => {
        it('deve retornar lista vazia quando não há clientes', async () => {
            const clientes = await Cliente.findAll();
            expect(clientes).toEqual([]);
        });

        it('deve retornar todos os clientes cadastrados', async () => {
            await Cliente.create({
                nome: 'Cliente 1',
                email: 'cliente1@email.com',
                telefone: '(11) 11111-1111'
            });

            await Cliente.create({
                nome: 'Cliente 2',
                email: 'cliente2@email.com',
                telefone: '(11) 22222-2222'
            });

            const clientes = await Cliente.findAll();
            expect(clientes).toHaveLength(2);
            expect(clientes[0].nome).toBe('Cliente 2');
            expect(clientes[1].nome).toBe('Cliente 1');
        });
    });

    describe('findById', () => {
        it('deve retornar cliente por ID válido', async () => {
            const clienteData = {
                nome: 'Teste Cliente',
                email: 'teste@email.com',
                telefone: '(11) 99999-9999'
            };

            const clienteCriado = await Cliente.create(clienteData);
            const clienteEncontrado = await Cliente.findById(clienteCriado.id);

            expect(clienteEncontrado).toBeTruthy();
            expect(clienteEncontrado.id).toBe(clienteCriado.id);
            expect(clienteEncontrado.nome).toBe(clienteData.nome);
        });

        it('deve retornar undefined para ID inexistente', async () => {
            const cliente = await Cliente.findById(999);
            expect(cliente).toBeUndefined();
        });
    });

    describe('findByEmail', () => {
        it('deve retornar cliente por email válido', async () => {
            const clienteData = {
                nome: 'Email Teste',
                email: 'email.teste@email.com',
                telefone: '(11) 99999-9999'
            };

            await Cliente.create(clienteData);
            const cliente = await Cliente.findByEmail(clienteData.email);

            expect(cliente).toBeTruthy();
            expect(cliente.email).toBe(clienteData.email);
            expect(cliente.nome).toBe(clienteData.nome);
        });

        it('deve retornar undefined para email inexistente', async () => {
            const cliente = await Cliente.findByEmail('inexistente@email.com');
            expect(cliente).toBeUndefined();
        });
    });

    describe('update', () => {
        it('deve atualizar cliente com dados válidos', async () => {
            const clienteData = {
                nome: 'Nome Original',
                email: 'original@email.com',
                telefone: '(11) 99999-9999'
            };

            const clienteCriado = await Cliente.create(clienteData);

            const dadosAtualizados = {
                nome: 'Nome Atualizado',
                email: 'atualizado@email.com',
                telefone: '(11) 88888-8888',
                endereco: 'Novo Endereço'
            };

            const resultado = await Cliente.update(clienteCriado.id, dadosAtualizados);

            expect(resultado.changes).toBe(1);
            expect(resultado.id).toBe(clienteCriado.id);

            const clienteAtualizado = await Cliente.findById(clienteCriado.id);
            expect(clienteAtualizado.nome).toBe(dadosAtualizados.nome);
            expect(clienteAtualizado.email).toBe(dadosAtualizados.email);
        });

        it('deve retornar changes 0 para ID inexistente', async () => {
            const resultado = await Cliente.update(999, {
                nome: 'Teste',
                email: 'teste@email.com',
                telefone: '(11) 99999-9999'
            });

            expect(resultado.changes).toBe(0);
        });
    });

    describe('delete', () => {
        it('deve deletar cliente existente', async () => {
            const clienteData = {
                nome: 'Cliente para Deletar',
                email: 'deletar@email.com',
                telefone: '(11) 99999-9999'
            };

            const clienteCriado = await Cliente.create(clienteData);
            const resultado = await Cliente.delete(clienteCriado.id);

            expect(resultado.changes).toBe(1);
            expect(resultado.id).toBe(clienteCriado.id);

            const clienteDeletado = await Cliente.findById(clienteCriado.id);
            expect(clienteDeletado).toBeUndefined();
        });

        it('deve retornar changes 0 para ID inexistente', async () => {
            const resultado = await Cliente.delete(999);
            expect(resultado.changes).toBe(0);
        });
    });
});

