import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import bcrypt from "bcryptjs";
import { User } from "../entity/User";

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.username = "admin";
    user.password = bcrypt.hashSync("admin", 8);
    user.role = "ADMIN";
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
