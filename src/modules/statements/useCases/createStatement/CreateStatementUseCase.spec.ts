import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to create a statement deposit", async () => {

    const user: ICreateUserDTO = {
      name: "test",
      email: "test@example.com",
      password: "1234"
    }

    await createUserUseCase.execute(user)

    const res = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    const resDeposit = await createStatementUseCase.execute({
      user_id: res.user.id!,
      amount: 100,
      description: "test description",
      type: "deposit" as OperationType
    })

    expect(resDeposit).toHaveProperty("id")
  })

  it("should be able to create a statement withdraw", async () => {
    const user: ICreateUserDTO = {
      name: "test",
      email: "test@example.com",
      password: "1234"
    }

    await createUserUseCase.execute(user)

    const res = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    await createStatementUseCase.execute({
      user_id: res.user.id!,
      amount: 100,
      description: "test description",
      type: "deposit" as OperationType
    })

    const resWithdraw = await createStatementUseCase.execute({
      user_id: res.user.id!,
      amount: 100,
      description: "test description",
      type: "deposit" as OperationType
    })

    expect(resWithdraw).toHaveProperty("id")
  })

  it("should not be able to create a statement with invalid user", async () => {

    expect(async() => {

      await createStatementUseCase.execute({
        user_id: '1',
        amount: 100,
        description: "test description",
        type: "deposit" as OperationType
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("should not be able to make a withdraw if insuficient funds", async () => {

    expect(async() => {
      const user: ICreateUserDTO = {
        name: "test withdraw",
        email: "withdraw@example.com",
        password: "1234"
      }

      await createUserUseCase.execute(user)

      const res = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password
      })

      await createStatementUseCase.execute({
        user_id: res.user.id!,
        amount: 1000,
        description: "test description",
        type: "withdraw" as OperationType
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
