import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Auth user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to authenticate user", async () => {
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

    expect(res).toHaveProperty("token")
  })

  it("should not be able to authenticate user with email incorrects", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        email: "test@example.com",
        password: "1234"
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: "error@example.com",
        password: user.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate user with password incorrects", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        email: "test@example.com",
        password: "1234"
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "123"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
