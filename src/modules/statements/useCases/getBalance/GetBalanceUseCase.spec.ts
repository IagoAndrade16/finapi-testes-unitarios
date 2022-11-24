import exp from "constants";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;


describe("Get balance", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("should be able to list user balance", async () => {
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


    const resBalance = await getBalanceUseCase.execute({
      user_id: res.user.id!,
    })

    expect(resBalance).toHaveProperty("balance")
  })

  it("should be able to list user balance", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        email: "test@example.com",
        password: "1234"
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password
      })


      await getBalanceUseCase.execute({
        user_id: "1",
      })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
