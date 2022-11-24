import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "new user",
      email: "new user@example.com",
      password: "1234"
    }

    const res = await createUserUseCase.execute(user)

    expect(res).toMatchObject({})

  })

  it("should not be able to create a new user with same email", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "new user",
        email: "new user@example.com",
        password: "1234"
      }

      await createUserUseCase.execute(user)
      await createUserUseCase.execute(user)
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
