import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to list a specified balance", async () => {
    const user: ICreateUserDTO = {
      name: "test",
      email: "test@example.com",
      password: "1234"
    }

    const resUser = await createUserUseCase.execute(user)

    const resDeposit = await createStatementUseCase.execute({
      user_id: resUser.id!,
      amount: 100,
      description: "test description",
      type: "deposit" as OperationType
    })

    const resGetStatement = await getStatementOperationUseCase.execute({
      user_id: resUser.id!,
      statement_id: resDeposit.id!
    })

    expect(resGetStatement).toHaveProperty("id")
  })

  it("should not be able to list a specified balance if user not exists", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        email: "test@example.com",
        password: "1234"
      }

      const resUser = await createUserUseCase.execute(user)

      const resDeposit = await createStatementUseCase.execute({
        user_id: resUser.id!,
        amount: 100,
        description: "test description",
        type: "deposit" as OperationType
      })

      await getStatementOperationUseCase.execute({
        user_id: "1",
        statement_id: resDeposit.id!
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

    it("should not be able to list a specified balance if statement not exists", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        email: "test@example.com",
        password: "1234"
      }

      const resUser = await createUserUseCase.execute(user)

      await createStatementUseCase.execute({
        user_id: resUser.id!,
        amount: 100,
        description: "test description",
        type: "deposit" as OperationType
      })

      await getStatementOperationUseCase.execute({
        user_id: resUser.id!,
        statement_id: "1"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
