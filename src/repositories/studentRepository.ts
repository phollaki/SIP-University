import { EntityRepository, Repository } from "typeorm";
import User from "../entity/user";

@EntityRepository(User)
export default class StudentRepository extends Repository<User> {}
