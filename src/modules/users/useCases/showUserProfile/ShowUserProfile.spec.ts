import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IncorrectEmailOrPasswordError } from "../authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Auth user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("should be able to show user profile", async () => {
    const user: ICreateUserDTO = {
      name: "test",
      email: "test@example.com",
      password: "1234"
    }

    const res = await createUserUseCase.execute(user)

    const userListed = await showUserProfileUseCase.execute(res.id!)

    expect(userListed).toMatchObject({
      id: res.id,
      name: user.name,
      email: user.email
    })
  })

  it("should not be able to show user profile if user does not exists", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test",
        email: "test@example.com",
        password: "1234"
      }

      await createUserUseCase.execute(user)

      await showUserProfileUseCase.execute("1")

    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
